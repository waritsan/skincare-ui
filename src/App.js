import './App.css';
import React, { useState } from 'react';

function App() {
  const [result, setResult] = useState("");
  const [inputs, setInputs] = useState({
    skin_type: "dry",
    age: "30",
    concern: "wrinkles",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://skincare-recommender-xyz123.azurewebsites.net/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    const data = await res.json();
    setResult(data.recommendation);
  };

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
      {result && (
        <pre style={{
          marginTop: 28,
          background: "#f4f8fb",
          padding: 16,
          borderRadius: 8,
          color: "#2d3a4b",
          fontSize: 15,
          whiteSpace: "pre-wrap"
        }}>{result}</pre>
      )}
    </div>
  );
}

export default App;
