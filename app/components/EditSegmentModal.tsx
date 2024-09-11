import React from "react";
import styles from "../page.module.css";
import { FormDataType, SegmentType } from "./types";

type EditSegmentModalProps = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  segments: SegmentType[];
  setSegments: React.Dispatch<React.SetStateAction<SegmentType[]>>;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editingIndex: number | null;
};

export const EditSegmentModal = ({
  formData,
  setFormData,
  segments,
  setSegments,
  setEditingIndex,
  editingIndex,
}: EditSegmentModalProps) => {
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
  );
};
