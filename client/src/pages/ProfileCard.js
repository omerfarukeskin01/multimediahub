import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../helper/AuthContext";
function ProfileCard(props) {
  const { authState } = useContext(AuthContext);
  const user = props.user;
  const [isFollowed, SetIsFollowed] = useState(props.isFollowed);

  const followUser = (userId) => {
    axios.post(
      "http://localhost:3001/auth/follow",
      { followedid: userId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    );
    console.log("followid:", userId);
    SetIsFollowed((old) => {
      return !old;
    });
  };
  useEffect(() => {
    SetIsFollowed(props.isFollowed);
  }, [props.isFollowed]);

  console.log(isFollowed, " ", props.isFollowed);
  const UnFollowUser = (userId) => {
    console.log("unfollow: ", userId);
    axios
      .delete("http://localhost:3001/auth/unfollow", {
        data: { followedid: userId },
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(response);
      });
    SetIsFollowed((old) => {
      return !old;
    });
  };
  return (
    <div>
      <div className="card-container">
        <img
          className="round"
          src="https://avatar.iran.liara.run/public"
          alt="user"
        />
        <h3>{props.user.username}</h3>
        <h6>{props.user.Email}</h6>
        <p>
          User interface designer and <br /> front-end developer
        </p>
        <div className="buttons">
          <button className="primarycard">Message</button>
          {authState.id !== user.id && (
            <div>
              {isFollowed ? (
                <button
                  backgroundColor={"red"}
                  onClick={() => {
                    UnFollowUser(user.id);
                  }}
                  className="primary ghost"
                >
                  unFollow
                </button>
              ) : (
                <button
                  onClick={() => {
                    followUser(user.id);
                  }}
                  className="primary ghost"
                >
                  Follow
                </button>
              )}
            </div>
          )}
        </div>
        <div className="skills">
          <h6>Skills</h6>
          <ul>
            <li>UI / UX</li>
            <li>Front End Development</li>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>React</li>
            <li>Node</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
