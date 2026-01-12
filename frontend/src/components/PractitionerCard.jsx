import React from "react";

export default function PractitionerCard({ practitioner, isBooked, onCancel }) {
  return (
    <div className="bg-white dark:bg-[#1B3C53] rounded-[2rem] p-6 flex flex-col shadow-md border border-[#1B3C53]/10 dark:border-white/10 transition-all hover:shadow-lg">
      <p>
        <strong>Session ID:</strong> {practitioner.id}
      </p>
      <p>
        <strong>Therapy ID:</strong> {practitioner.therapyId}
      </p>
      <p>
        <strong>Practitioner ID:</strong> {practitioner.practitionerId}
      </p>
      <p>
        <strong>Date & Time:</strong>{" "}
        {new Date(practitioner.dateTime).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={`font-bold ${practitioner.status === "booked" ? "text-green-500" : practitioner.status === "completed" ? "text-blue-500" : "text-red-500"}`}>
          {practitioner.status}
        </span>
      </p>
      <p>
        <strong>Notes:</strong> {practitioner.notes}
      </p>

      {isBooked && onCancel && (
        <button
          onClick={() => onCancel(practitioner.id)}
          className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition"
        >
          Cancel Session
        </button>
      )}
    </div>
  );
}
