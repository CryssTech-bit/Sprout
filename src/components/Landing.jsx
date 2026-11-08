import React from "react";
import { Link } from "react-router-dom";
import "../Landing.css";

// Fixed positions/timings for each leaf, ported directly from the original CSS
const LEAVES = [
  { left: "5%", duration: "9s", delay: "0s", color: "#a83232", scale: 1 },
  { left: "15%", duration: "12s", delay: "2s", color: "#f0f0f0", scale: 1 },
  { left: "28%", duration: "7s", delay: "1s", color: "#012b0f", scale: 0.7 },
  { left: "40%", duration: "14s", delay: "4s", color: "#f0f0f0", scale: 1 },
  { left: "55%", duration: "10s", delay: "0.5s", color: "#a83232", scale: 1 },
  { left: "65%", duration: "8s", delay: "3s", color: "#012b0f", scale: 1.3 },
  { left: "75%", duration: "11s", delay: "1.5s", color: "#a83232", scale: 1 },
  { left: "85%", duration: "13s", delay: "2.5s", color: "#f0f0f0", scale: 1 },
  { left: "92%", duration: "9s", delay: "0s", color: "#012b0f", scale: 0.8 },
  { left: "48%", duration: "15s", delay: "5s", color: "#f0f0f0", scale: 1 },
];

export default function Landing() {
  return (
    <div className="landing">
      <div className="leaves">
        {LEAVES.map((leaf, i) => (
          <span
            key={i}
            style={{
              left: leaf.left,
              background: leaf.color,
              animationDuration: leaf.duration,
              animationDelay: leaf.delay,
              transform: `scale(${leaf.scale})`,
            }}
          />
        ))}
      </div>

      <div className="name">
        <h1>
          <span className="l">Spr</span>
          <span className="w">out</span>
        </h1>
        <h3> A daily drawing app to help you grow your creativity</h3>
        <Link to="/my-gallery" className="start-btn">
          Gallery
        </Link>
        <Link to="/today" className="start-btn">
          Start
        </Link>
      </div>
    </div>
  );
}
