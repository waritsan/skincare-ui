import logo from './logo.svg';
import './App.css';

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
    <div>
      <h1>Skincare Recommender</h1>
      <form onSubmit={handleSubmit}>
        <input name="age" value={inputs.age} onChange={e => setInputs({...inputs, age: e.target.value})} />
        <select onChange={e => setInputs({...inputs, skin_type: e.target.value})}>
          <option value="dry">Dry</option>
          <option value="oily">Oily</option>
          <option value="combo">Combination</option>
        </select>
        <input name="concern" value={inputs.concern} onChange={e => setInputs({...inputs, concern: e.target.value})} />
        <button type="submit">Get Recommendation</button>
      </form>
      <pre>{result}</pre>
    </div>
  );
}

export default App;
