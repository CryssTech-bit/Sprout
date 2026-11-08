import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function compressImage(file, maxSize = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

async function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  setError("");
  try {
    const image = await compressImage(file);
    const next = { ...entries, [today]: { prompt, image, shared: share } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEntries(next);
  } catch {
    setError("Couldn't save that image. Try a different photo.");
  }
}

const PROMPTS = [
  "A cup",
  "Your favorite shoe",
  "A leaf",
  "A house plant",
  "A pair of glasses",
  "A slice of bread",
  "A candle",
  "An umbrella",
  "A key",
  "A book (closed, just the cover)",
  "A chair",
  "A pair of headphones",
  "A cloud",
  "A doorknob",
  "A spoon",
  "A backpack",
  "A lightbulb",
  "A clock",
  "A flower in a vase",
  "Your own hand",
];

const STORAGE_KEY = "entries";

// Local-time "YYYY-MM-DD" (toISOString uses UTC, which can be off by a day)
function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

// Same prompt all day, changes daily
function getTodayPrompt() {
  const now = new Date();
  const dayNumber = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );
  return PROMPTS[dayNumber % PROMPTS.length];
}

// Count back from today until the first day with no drawing
function calculateStreak(entries) {
  let streak = 0;
  const cursor = new Date();
  while (entries[dateKey(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function Home() {
  const [entries, setEntries] = useState(loadEntries);
  const [share, setShare] = useState(false);
  const [error, setError] = useState("");

  const today = dateKey();
  const prompt = getTodayPrompt();
  const doneToday = Boolean(entries[today]);
  const streak = calculateStreak(entries);

  // Last 7 days, oldest to newest
  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      key: dateKey(d),
      letter: d.toLocaleDateString("en-US", { weekday: "short" })[0],
    };
  });

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      const next = {
        ...entries,
        [today]: { prompt, image: reader.result, shared: share },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setEntries(next);
      } catch {
        setError("That image is too large to save. Try a smaller photo.");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="app-name">Sprout</h1>
        <div className="streak-badge" aria-label={`${streak} day streak`}>
          <span>{streak}</span>
          <span className="streak-label">day streak</span>
        </div>
      </header>

      <main className="today-card">
        <p className="today-label">Today's prompt</p>
        <h2 className="today-prompt">{prompt}</h2>

        {doneToday ? (
          <div className="today-done">
            <img
              src={entries[today].image}
              alt={`Your drawing for today: ${prompt}`}
              className="today-preview"
            />
            <p>Done for today. Your streak is safe.</p>
          </div>
        ) : (
          <>
            <label className="upload-btn" htmlFor="drawingUpload">
              Upload today's drawing
            </label>
            <input
              type="file"
              id="drawingUpload"
              accept="image/*"
              hidden
              onChange={handleUpload}
            />
            <label className="share-toggle">
              <input
                type="checkbox"
                checked={share}
                onChange={(e) => setShare(e.target.checked)}
              />
              Share this one
            </label>
            {error && <p className="home-error">{error}</p>}
          </>
        )}
      </main>

      <section className="streak-strip" aria-label="Last 7 days">
        {lastSevenDays.map((day) => (
          <div
            key={day.key}
            className={`day-dot ${entries[day.key] ? "done" : ""}`}
          >
            {day.letter}
          </div>
        ))}
      </section>

      <Link to="/my-gallery" className="home-gallery-link">
        See all my drawings
      </Link>
    </div>
  );
}
