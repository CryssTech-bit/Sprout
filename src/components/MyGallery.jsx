import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MyGallery.css";

// Entries are saved by the home screen as:
// { "2026-08-25": { prompt: "A cup", image: "data:image/...", shared: false }, ... }
const STORAGE_KEY = "entries";

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function formatDate(dateStr) {
  // Add a time so the date isn't shifted by timezone when parsed
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function MyGallery() {
  const [entries, setEntries] = useState(loadEntries);

  // Newest first
  const dates = Object.keys(entries).sort().reverse();

  function persist(next) {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function toggleShared(dateStr) {
    persist({
      ...entries,
      [dateStr]: { ...entries[dateStr], shared: !entries[dateStr].shared },
    });
  }

  function removeEntry(dateStr) {
    if (!window.confirm("Delete this drawing? This can't be undone.")) return;
    const next = { ...entries };
    delete next[dateStr];
    persist(next);
  }

  return (
    <div className="my-gallery">
      <header className="my-gallery-header">
        <h2 className="my-gallery-title">My Drawings</h2>
        <p className="my-gallery-count">
          {dates.length} {dates.length === 1 ? "drawing" : "drawings"} so far
        </p>
      </header>

      {dates.length === 0 ? (
        <div className="my-gallery-empty">
          <p>Nothing here yet. Your first drawing will show up here.</p>
          <Link to="/today" className="my-gallery-cta">
            Draw today's prompt
          </Link>
        </div>
      ) : (
        <div className="my-gallery-grid">
          {dates.map((dateStr) => {
            const entry = entries[dateStr];
            return (
              <figure className="entry" key={dateStr}>
                <img
                  src={entry.image}
                  alt={`Drawing for the prompt: ${entry.prompt}`}
                  className="entry-img"
                />
                <figcaption className="entry-info">
                  <div className="entry-text">
                    <span className="entry-prompt">{entry.prompt}</span>
                    <span className="entry-date">{formatDate(dateStr)}</span>
                  </div>

                  <div className="entry-actions">
                    <button
                      type="button"
                      className={`entry-share ${entry.shared ? "on" : ""}`}
                      onClick={() => toggleShared(dateStr)}
                      aria-pressed={entry.shared}
                    >
                      {entry.shared ? "Shared" : "Private"}
                    </button>
                    <button
                      type="button"
                      className="entry-delete"
                      onClick={() => removeEntry(dateStr)}
                      aria-label={`Delete drawing from ${formatDate(dateStr)}`}
                    >
                      Delete
                    </button>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
      <Link to="/today" className="my-gallery-back">
        ← Back
      </Link>
    </div>
  );
}
