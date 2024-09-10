/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./page.module.css";

const ItemType = "SEGMENT";

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

const Segment = ({ segment, index, moveSegment, editSegment }: any) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveSegment(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node)) as any} className={styles.segment}>
      <button onClick={() => editSegment(index)} className={styles.editButton}>
        Edit
      </button>
      <h2>{segment.name}</h2>
      <p>
        Duration: {segment.duration} {segment.durationUnit}
      </p>
      <p>
        Intensity: {segment.intensityType} - {segment.intensity}
      </p>
    </div>
  );
};

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSegments = segments.map((segment, index) =>
      index === editingIndex ? { ...segment, ...formData } : segment
    );
    setSegments(updatedSegments);
    setEditingIndex(null);
  };

  const closeModal = () => {
    setEditingIndex(null);
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
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Edit Segment</h2>
              <form onSubmit={handleFormSubmit} className={styles.editForm}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Duration Type:
                  <select
                    name="durationType"
                    value={formData.durationType}
                    onChange={handleInputChange}
                  >
                    <option value="time">Time</option>
                    <option value="distance">Distance</option>
                  </select>
                </label>
                {formData.durationType === "time" ? (
                  <>
                    <label>
                      Duration (Time):
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Unit:
                      <select
                        name="durationUnit"
                        value={formData.durationUnit}
                        onChange={handleInputChange}
                      >
                        <option value="sec">Seconds</option>
                        <option value="min">Minutes</option>
                        <option value="hour">Hours</option>
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      Duration (Distance):
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                      />
                    </label>
                    <label>
                      Unit:
                      <select
                        name="durationUnit"
                        value={formData.durationUnit}
                        onChange={handleInputChange}
                      >
                        <option value="miles">Miles</option>
                        <option value="meters">Meters</option>
                        <option value="km">Kilometers</option>
                      </select>
                    </label>
                  </>
                )}
                <label>
                  Intensity Type:
                  <select
                    name="intensityType"
                    value={formData.intensityType}
                    onChange={handleInputChange}
                  >
                    <option value="speed">Speed</option>
                    <option value="output">Output</option>
                  </select>
                </label>
                <label>
                  Intensity:
                  <input
                    type="text"
                    name="intensity"
                    value={formData.intensity}
                    onChange={handleInputChange}
                  />
                </label>
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.closeButton}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Page;
