import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  
  const navigate=useNavigate();

 

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        
        localStorage.setItem("accessToken", response.data.token);
        alert(response.data.token)
        console.log(response.data.token)
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    });
  };
  return (
    <>
    <div>
      <h1>Login Page</h1>
    </div>
    <div className="loginContainer">

      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
    </>
  );
}

export default Login;