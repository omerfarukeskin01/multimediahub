import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const navigate = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert(response.data.id);
        localStorage.setItem("accessToken", response.data.token);

        setAuthState({
          status: true,
          token: response.data.token,
          username: username,
          id: response.data.id,
        });
        navigate("/");
      }
    });
  };
  return (
    <>
      <div className="loginContainer">
        <div>
          <h2 className="registrationpage">Login Page</h2>
        </div>
        <div className="inputContainer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
            class="usernameicon"
          >
            <path d="M2 22s3-2 4-3c0 0 6-6 6-9 0-4-3-7-7-7s-7 3-7 7c0 3 6 9 6 9 1 1 4 3 4 3"></path>
          </svg>
          <input
            className="input"
            type="text"
            placeholder="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>

        <div className="group">
          <svg
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
          >
            <path
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></path>
          </svg>
          <input
            className="input"
            type="password"
            placeholder="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <button class="loginbutton" onClick={login}>
          Login
          <svg class="loginicon" viewBox="0 0 24 24" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </>
  );
}

export default Login;
