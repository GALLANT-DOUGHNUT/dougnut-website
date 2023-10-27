import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setAuthenticated }) => {
  const navigate = useNavigate();

  const [username, SetUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === "glasgow" && password === "digitaldonut") {
      setAuthenticated(true);
      sessionStorage.setItem("authenticated", true);
      navigate("/admin");
    } else {
      alert("Incorrect Credentials.");
    }
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
    </form>
  );
};

export default LoginPage;
