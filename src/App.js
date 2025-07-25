import './App.css';
import React, { useState } from 'react';

function App() {
  const [result, setResult] = useState("");
  const [inputs, setInputs] = useState({
    skin_type: "dry",
    age: "30",
    concern: "wrinkles",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(""); // Clear previous result
    setLoading(true);

    const res = await fetch("https://skincare-recommender-xyz123.azurewebsites.net/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });

    if (!res.body || !window.ReadableStream) {
      // Fallback for browsers without streaming support
      const data = await res.json();
      setResult(data.recommendation);
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    // Stream output token-by-token (character-by-character)
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // Update result as soon as a new token (character) arrives
      for (let i = 0; i < chunk.length; i++) {
        accumulated += chunk[i];
        setResult(accumulated);
      }
    }
    setLoading(false);
  };

  // Helper to format the result nicely
  function renderRecommendation(result) {
    if (!result) return null;
    let recommendationText = result;

    // Try to parse JSON if needed
    try {
      // Remove any leading/trailing whitespace before parsing
      const parsed = JSON.parse(result.trim());
      if (parsed && parsed.recommendation) {
        recommendationText = parsed.recommendation;
      }
    } catch {
      // Not JSON, use as is
    }

    // Split into items if numbered or line breaks, else show as paragraph
    // Handles both "1. ..." and line breaks
    const items = recommendationText
      .split(/\n+|\d+\.\s/)
      .map(line => line.trim())
      .filter(Boolean);

    if (items.length > 1) {
      return (
        <div>
          <ul style={{ paddingLeft: 20, margin: 0, listStyle: "disc" }}>
            {items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 14, lineHeight: 1.7 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    // Otherwise, show as paragraph(s)
    return (
      <div style={{ lineHeight: 1.7, whiteSpace: "pre-line", color: "#2d3a4b" }}>
        {recommendationText}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #eee", background: "#fafcff" }}>
      <h1 style={{ textAlign: "center", color: "#2d3a4b" }}>Skincare Recommender</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 500, color: "#3a4a5b" }}>
          Age
          <input
            name="age"
            type="number"
            min="1"
            value={inputs.age}
            onChange={e => setInputs({ ...inputs, age: e.target.value })}
            style={{ marginTop: 6, padding: 8, borderRadius: 6, border: "1px solid #cfd8dc" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 500, color: "#3a4a5b" }}>
          Skin Type
          <select
            value={inputs.skin_type}
            onChange={e => setInputs({ ...inputs, skin_type: e.target.value })}
            style={{ marginTop: 6, padding: 8, borderRadius: 6, border: "1px solid #cfd8dc" }}
          >
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="combo">Combination</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", fontWeight: 500, color: "#3a4a5b" }}>
          Main Concern
          <input
            name="concern"
            value={inputs.concern}
            onChange={e => setInputs({ ...inputs, concern: e.target.value })}
            style={{ marginTop: 6, padding: 8, borderRadius: 6, border: "1px solid #cfd8dc" }}
            placeholder="e.g. wrinkles, acne, redness"
          />
        </label>
        <button
          type="submit"
          style={{
            marginTop: 8,
            padding: "10px 0",
            borderRadius: 6,
            border: "none",
            background: "#4f8cff",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 1px 4px #e3eaf2"
          }}
        >
          Get Recommendation
        </button>
      </form>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <div style={{
            border: "4px solid #e3eaf2",
            borderTop: "4px solid #4f8cff",
            borderRadius: "50%",
            width: 36,
            height: 36,
            animation: "spin 1s linear infinite"
          }} />
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}
          </style>
        </div>
      )}
      {!loading && result && (
        <div style={{
          marginTop: 28,
          background: "#f4f8fb",
          padding: 16,
          borderRadius: 8,
          color: "#2d3a4b",
          fontSize: 15,
          whiteSpace: "normal",
          boxShadow: "0 1px 4px #e3eaf2"
        }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: "#4f8cff" }}>Your Recommendation:</div>
          {renderRecommendation(result)}
        </div>
      )}
    </div>
  );
}

export default App;
