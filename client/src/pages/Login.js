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
      
        console.log(response.data.token)
        setAuthState({
          status: true,
          token: response.data.token
         
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="usernameicon">
    <path d="M2 22s3-2 4-3c0 0 6-6 6-9 0-4-3-7-7-7s-7 3-7 7c0 3 6 9 6 9 1 1 4 3 4 3"></path>
  </svg>
      <input
      class="input"
        type="text"
        placeholder="username"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
     
      
      <div class="group">
  <svg stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon">
  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke-linejoin="round" stroke-linecap="round"></path>
</svg>
<input class="input" type="password" placeholder="password"  onChange={(event) => {
          setPassword(event.target.value);
        }}/>
</div>

      <button onClick={login}> Login </button>
    </div>
    </>
  );
}

export default Login;