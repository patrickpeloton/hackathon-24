/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const initialSegments = [
  { id: '1', name: 'Warm-up', duration: '1 min', speed: '5 mph' },
  { id: '2', name: 'Run', duration: '20 min', speed: '7 mph' },
  { id: '3', name: 'Cool-down', duration: '5 min', speed: '4 mph' },
];

const convertDurationToSeconds = (duration) => {
  const [value, unit] = duration.split(' ');
  const durationValue = parseInt(value, 10);
  switch (unit) {
    case 'sec':
      return durationValue;
    case 'min':
      return durationValue * 60;
    case 'hour':
      return durationValue * 3600;
    default:
      return 0;
  }
};

const Page = () => {
  const [segments] = useState(initialSegments);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

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

  const elapsedTimeInSeconds = time.minutes * 60 + time.seconds;
  let accumulatedTime = 0;
  const currentSegmentIndex = segments.findIndex((segment) => {
    accumulatedTime += convertDurationToSeconds(segment.duration);
    return elapsedTimeInSeconds < accumulatedTime;
  });

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1>Running Workout Segments</h1>
        {segments.map((segment, index) => (
          <div
            key={segment.id}
            className={`${styles.segment} ${index === currentSegmentIndex ? styles.currentSegment : ''}`}
          >
            <h2>{segment.name}</h2>
            <p>Duration: {segment.duration}</p>
            <p>Speed: {segment.speed}</p>
          </div>
        ))}
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.clock}>
          {String(time.minutes).padStart(2, '0')}:
          {String(time.seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default Page;