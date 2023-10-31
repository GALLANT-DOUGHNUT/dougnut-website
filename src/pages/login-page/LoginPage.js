import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const [username, SetUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await fetch("/api/get-credentials")
      .then((response) => response.json())
      .then(({ result }) => {
        setLoading(false);
        const admin = result?.rows?.[0];
        if (username === admin?.username && password === admin?.password) {
          const { password: _, ...userObj } = admin;
          setUser(userObj);
          sessionStorage.setItem("user", JSON.stringify(userObj));
          navigate("/admin");
        } else {
          alert("Incorrect Credentials.");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <form className="mainContainer" method="post" onSubmit={handleSubmit}>
      <label>
        username:
        <br />
        <input
          name="username"
          type="text"
          onChange={(event) => SetUsername(event.target.value)}
        />
      </label>
      <br />
      <label>
        password:
        <br />
        <input
          name="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <br />
      <input type="submit" />
      {loading && <h5>Attempting to log in...</h5>}
    </form>
  );
};

export default LoginPage;
