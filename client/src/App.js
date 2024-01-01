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
import ChangePassword from "./pages/ChangePassword";
import Liked from "./pages/Likedd"; // Yeni bileşeni import edin

import axios from "axios";
import Users from "./pages/Users";
import MediaDetail from "./pages/MediaDetail";

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
    console.log("BURAYA GELME AMMMMK");
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <ul class="menu-bar">
            {!authState.status ? (
              <>
                <li>
                  <Link to="/login"> Login</Link>
                </li>
                <li>
                  <Link to="/registration"> Registration</Link>
                </li>
              </>
            ) : (
              <>
                <Link to="/">
                  {" "}
                  <li>Home Page</li>
                </Link>
                <Link to="/createpost">
                  <li>Create A Post</li>
                </Link>
                <Link to="/likedd">
                  <li>Liked</li>
                </Link>
                <Link to={`/profile/${authState.id}`}>
                  {" "}
                  <li>Profile</li>
                </Link>
                <Link to="/users">
                  <li>Users</li>
                </Link>
              </>
            )}

            {authState.status && (
              <button className="Btn" onClick={logout}>
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>

                <div className="text">Logout</div>
              </button>
            )}
          </ul>

          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/likedd" exact element={<Liked />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="/changepassword" exact element={<ChangePassword />} />
            <Route path="/users" exact element={<Users />} />
            <Route path="/mediadetail/:id" exact element={<MediaDetail />} />
            <Route path="*" exact Component={PageNotFound} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
