import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      setToken(response.data.token);
      setError("");
      alert("Logged in successfully!");
    } catch (err) {
      setError("Login Failed: 401 Unauthorized");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (err) {
      setError("Fetch Failed: 401 Unauthorized - You must log in first!");
      setData(null);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Final Project</h1>

      {!token ? (
        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <p style={{ color: "green" }}>✓ Authenticated</p>
          <button onClick={fetchData}>Get Protected Data</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h4>Backend Response:</h4>
          <p>{data.message}</p>
          <small>Server Time: {data.timestamp}</small>
        </div>
      )}
    </div>
  );
}

export default App;
