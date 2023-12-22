import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext } from "./helper/AuthContext";
import PageNotFound from "./pages/PageNotFound";
import React, { useEffect, useState } from "react";
import Profile from "./pages/Profile";

import Liked from "./pages/Likedd"; // Yeni bileşeni import edin

import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    // Create a variable to track whether the component is mounted
    let isMounted = true;

    // Use an async function to make the axios call
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        if (isMounted) {
          if (response.data.error) {
            console.error("Authentication check failed:", response.data.error);
            setAuthState(false);
          } else {
            setAuthState({
              username: response.data.username,
              id: response.data.id,
              status: true,
            });
          }
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        if (isMounted) {
          setAuthState(false);
        }
      }
    };

    fetchData();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };
  return (
    <div className="App">
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
      <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/"> Home Page</Link>
                  <Link to="/createpost"> Create A Post</Link>
                  <Link to="/likedd">liked</Link>
                </>
              )}
          </div>
            <div className="loggedInContainer">
            <Link to={`/profile/${authState.id}`}> <h1>{authState.username} </h1></Link>
             
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/likedd" exact element={<Liked/>}/>
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile/>}/>
            <Route path="*" exact Component={PageNotFound} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
