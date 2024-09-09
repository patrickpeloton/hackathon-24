/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

let CfuTreadSensor: any;

export default function Home() {
  const [speed, setSpeed] = useState(0);
  const [incline, setIncline] = useState(0);
  const [targetIncline, setTargetIncline] = useState(0);

  function withTreadMetrics() {
    let cfu: any = null;
    try {
      // request updates at 30Hz (30 times/second).
      cfu = new CfuTreadSensor({ frequency: 30 });
      // current implementation will not report any errors from the cfu
      // but chromium can report errors for permissions and such
      cfu.addEventListener("error", (event: any) => {
        if (event.error.name == "NotAllowedError") {
          // seems like permissions have been revoked by the user
          console.log("Permissions revoked.");
        } else {
          // some other error occured, just log it
          console.log("Error reading sensor: " + event.error.name);
        }
      });

      // add event listener to start receiving sensor input
      cfu.addEventListener("reading", () => {
        console.log(
          `Bike data received speed ${cfu.speed}, incline ${cfu.incline}, target incline ${cfu.targetIncline}`
        );
        // let's update the DOM with new values
        setSpeed(cfu?.speed);
        setIncline(cfu?.incline);
        setTargetIncline(cfu?.targetIncline);
      });

      if (cfu != null) {
        cfu.start();
      }
    } catch (err) {
      console.log("Error opening tread " + err);
    }
  }

  useEffect(() => {
    // not sure if we need to run this permissions code
    // if (navigator.permissions != null) {
    //   // we need to ask the user for permissions to access the sensor
    //   navigator.permissions
    //     .query({ name: "cfu-tread" })
    //     .then((result) => {
    //       if (result.state == "denied") {
    //         console.log("Permission to use CFU sensor is denied.");
    //         return;
    //       }

    //       withTreadMetrics();
    //     });
    // } else {
    withTreadMetrics();
    // }
  }, []);

  return (
    <div className={styles.page}>
      <div>Speed: {speed}</div>
      <div>Incline: {incline}</div>
      <div>Target Incline: {targetIncline}</div>
    </div>
  );
}
