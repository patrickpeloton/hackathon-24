/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./page.module.css";
import { Segment } from "./components/Segment";
import { EditSegmentModal } from "./components/EditSegmentModal";

const initialSegments = [
  {
    id: "1",
    name: "Warm-up",
    durationType: "time",
    duration: "5",
    durationUnit: "min",
    intensityType: "speed",
    intensity: "5 mph",
  },
  {
    id: "2",
    name: "Run",
    durationType: "time",
    duration: "20",
    durationUnit: "min",
    intensityType: "speed",
    intensity: "7 mph",
  },
  {
    id: "3",
    name: "Cool-down",
    durationType: "time",
    duration: "5",
    durationUnit: "min",
    intensityType: "speed",
    intensity: "4 mph",
  },
];

const Page = () => {
  const [segments, setSegments] = useState(initialSegments);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    durationType: "time",
    duration: "",
    durationUnit: "",
    intensityType: "speed",
    intensity: "",
  });

  const moveSegment = (fromIndex: number, toIndex: number) => {
    const updatedSegments = Array.from(segments);
    const [movedSegment] = updatedSegments.splice(fromIndex, 1);
    updatedSegments.splice(toIndex, 0, movedSegment);
    setSegments(updatedSegments);
  };

  const editSegment = (index: number) => {
    setEditingIndex(index);
    setFormData(segments[index]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.page}>
        <h1>Running Workout Segments</h1>
        {segments.map((segment, index) => (
          <Segment
            key={segment.id}
            index={index}
            segment={segment}
            moveSegment={moveSegment}
            editSegment={editSegment}
          />
        ))}
        <button
          onClick={() =>
            setSegments([
              ...segments,
              {
                id: (segments.length + 1).toString(),
                name: "New Segment",
                durationType: "time",
                duration: "10",
                durationUnit: "min",
                intensityType: "speed",
                intensity: "6 mph",
              },
            ])
          }
          className={styles.addButton}
        >
          Add Segment
        </button>
        {editingIndex !== null && (
          <EditSegmentModal
            formData={formData}
            setFormData={setFormData}
            segments={segments}
            setSegments={setSegments}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Page;
