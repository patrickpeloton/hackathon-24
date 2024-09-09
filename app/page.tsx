/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [speed, setSpeed] = useState(0);
  const [incline, setIncline] = useState(0);
  const [targetIncline, setTargetIncline] = useState(0);
  const [successfulClick, setClick] = useState(false);
  const cfuRef = useRef<any>(null);

  function withTreadMetrics() {
    try {
      // request updates at 30Hz (30 times/second).
      cfuRef.current = new (window as any).CfuTreadSensor({ frequency: 30 });
      // current implementation will not report any errors from the cfu
      // but chromium can report errors for permissions and such
      cfuRef.current?.addEventListener("error", (event: any) => {
        if (event.error.name == "NotAllowedError") {
          // seems like permissions have been revoked by the user
          console.log("Permissions revoked.");
        } else {
          // some other error occured, just log it
          console.log("Error reading sensor: " + event.error.name);
        }
      });

      // add event listener to start receiving sensor input
      cfuRef.current?.addEventListener("reading", () => {
        console.log(
          `Bike data received speed ${cfuRef.current.speed}, incline ${cfuRef.current.incline}, target incline ${cfuRef.current.targetIncline}`
        );
        // let's update the DOM with new values
        setSpeed(cfuRef.current?.speed);
        setIncline(cfuRef.current?.incline);
        setTargetIncline(cfuRef.current?.targetIncline);
      });

      if (cfuRef.current != null) {
        cfuRef.current.start();
      }
    } catch (err) {
      console.log("Error opening tread " + err);
    }
  }

  useEffect(() => {
    // not sure if we need to run this permissions code
    if (navigator.permissions != null) {
      // we need to ask the user for permissions to access the sensor
      navigator.permissions
        .query({ name: "cfu-tread" as PermissionName })
        .then((result) => {
          if (result.state == "denied") {
            console.log("Permission to use CFU sensor is denied.");
            return;
          }

          withTreadMetrics();
        });
    } else {
      withTreadMetrics();
    }
  }, []);

  return (
    <div className={styles.page}>
      {successfulClick && <div>You clicked the button!</div>}
      <div>Speed: {speed}</div>
      <div>Incline: {incline}</div>
      <div>Target Incline: {targetIncline}</div>
      <button
        onClick={() => {
          setClick(true);
          cfuRef.current.setTargetIncline(2);
        }}
      >
        Bump the speed!
      </button>
      Version 6
    </div>
  );
}
