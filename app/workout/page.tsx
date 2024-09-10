/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./page.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const initialSegments = [
  { id: "1", name: "Warm-up", duration: "10 sec", speed: "5 mph" },
  { id: "2", name: "Run", duration: "20 sec", speed: "7 mph" },
  { id: "3", name: "Cool-down", duration: "10 sec", speed: "4 mph" },
];

const convertDurationToSeconds = (duration) => {
  const [value, unit] = duration.split(" ");
  const durationValue = parseInt(value, 10);
  switch (unit) {
    case "sec":
      return durationValue;
    case "min":
      return durationValue * 60;
    case "hour":
      return durationValue * 3600;
    default:
      return 0;
  }
};

const Page = () => {
  const [segments] = useState(initialSegments);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [currentSpeed, setCurrentSpeed] = useState(6.0);
  const [speedData, setSpeedData] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds + 1;
        const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
        return {
          minutes: newMinutes,
          seconds: newSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const speedInterval = setInterval(() => {
      setCurrentSpeed((prevSpeed) => {
        const variance = (Math.random() - 0.25) * 2; // Generates a random number between -0.5 and 1.5
        const newSpeed = Math.max(5.0, Math.min(7.0, prevSpeed + variance)); // Keeps speed between 5.0 and 7.0 mph
        setSpeedData((prevData) => [...prevData, newSpeed]);
        return newSpeed;
      });
    }, 250);

    return () => clearInterval(speedInterval);
  }, []);

  const elapsedTimeInSeconds = time.minutes * 60 + time.seconds;
  let accumulatedTime = 0;
  const currentSegmentIndex = segments.findIndex((segment) => {
    accumulatedTime += convertDurationToSeconds(segment.duration);
    return elapsedTimeInSeconds < accumulatedTime;
  });

  const totalWorkoutTime = segments.reduce(
    (total, segment) => total + convertDurationToSeconds(segment.duration),
    0
  );

  const currentSegment = segments[currentSegmentIndex];
  const currentSegmentDurationInSeconds = convertDurationToSeconds(
    currentSegment?.duration || "0 sec"
  );
  const currentSegmentElapsedTime =
    elapsedTimeInSeconds - (accumulatedTime - currentSegmentDurationInSeconds);
  const currentSegmentRemainingTime =
    currentSegmentDurationInSeconds - currentSegmentElapsedTime;

  const labels = Array.from({ length: totalWorkoutTime * 2 }, (_, i) =>
    (i * 0.5).toFixed(1)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Speed (mph)",
        data: speedData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
      {
        label: "Goal Min Speed (5.0 mph)",
        data: labels.map(() => 5.0),
        borderColor: "rgba(255, 99, 132, 1)",
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "Goal Max Speed (7.0 mph)",
        data: labels.map(() => 7.0),
        borderColor: "rgba(54, 162, 235, 1)",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (seconds)",
        },
        min: 0,
        max: totalWorkoutTime,
      },
      y: {
        title: {
          display: true,
          text: "Speed (mph)",
        },
        min: 4,
        max: 8,
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1>Running Workout Segments</h1>
        {segments.map((segment, index) => {
          const segmentDurationInSeconds = convertDurationToSeconds(
            segment.duration
          );
          const isElapsed =
            elapsedTimeInSeconds >= accumulatedTime + segmentDurationInSeconds;
          const isCurrent = index === currentSegmentIndex;
          accumulatedTime += segmentDurationInSeconds;
          return (
            <div
              key={segment.id}
              className={`${styles.segment} ${
                isCurrent ? styles.currentSegment : ""
              } ${isElapsed ? styles.elapsedSegment : ""}`}
            >
              <h2>{segment.name}</h2>
              <p>Duration: {segment.duration}</p>
              <p>Speed: {segment.speed}</p>
            </div>
          );
        })}
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.clock}>
          {String(time.minutes).padStart(2, "0")}:
          {String(time.seconds).padStart(2, "0")}
        </div>
        {currentSegment && (
          <div className={styles.segmentMetrics}>
            <h2>Segment Metrics</h2>
            <p>Name: {currentSegment.name}</p>
            <p>Speed: {currentSpeed.toFixed(1)} mph</p>
            <p>Remaining Time: {currentSegmentRemainingTime} seconds</p>
          </div>
        )}
        <div className={styles.speedGraph}>
          <h2>Speed Over Time</h2>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Page;
