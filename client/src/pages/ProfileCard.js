import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../helper/AuthContext";
import CreateListModal from "./CreateListModal";
function ProfileCard(props) {
  const { authState } = useContext(AuthContext);
  const [user, SetUser] = useState(props.user);
  console.log("PROOOOPPPPPSSSSSS USSEEEERRRRR IDDDDDDDD", props.user.id);
  const [isFollowed, SetIsFollowed] = useState(props.isFollowed);
  const [listOfLists, SetListOfLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const showModal = () => {
    setIsModalOpen(true);
  };

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
    axios
      .get(`http://localhost:3001/auth/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setLoggedUser(response.data);
      });
    axios
      .get(`http://localhost:3001/lists/${props.user.id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        SetListOfLists(response.data);
        console.log("LİSSSSSTTTSSS", response.data, "id :", props.user.id);
      });
    SetIsFollowed(props.isFollowed);
  }, [props, props.isFollowed, isModalOpen, authState]);

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
            {listOfLists.map((list) => {
              return <li>{list.listname}</li>;
            })}
            <li>
              {props.user.id == authState.id ? (
                <button
                  onClick={() => {
                    showModal();
                  }}
                  className="primary ghost"
                >
                  add new list
                </button>
              ) : (
                <div></div>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <CreateListModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        ></CreateListModal>
      </div>
    </div>
  );
}

export default ProfileCard;
