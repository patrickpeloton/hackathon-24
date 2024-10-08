import React from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "../page.module.css";
import { SegmentType } from "./types";

const ItemType = "SEGMENT";

export const Segment = ({
  segment,
  index,
  moveSegment,
  editSegment,
  deleteSegment,
}: {
  segment: SegmentType;
  index: number;
  moveSegment: (fromIndex: number, toIndex: number) => void;
  editSegment: (index: number) => void;
  deleteSegment: (index: number) => void;
}) => {
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
      <div className={styles.buttonContainer}>
        <button
          onClick={() => editSegment(index)}
          className={styles.editButton}
        >
          Edit
        </button>
        <button
          onClick={() => deleteSegment(index)}
          className={styles.editButton}
        >
          Delete
        </button>
      </div>
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
