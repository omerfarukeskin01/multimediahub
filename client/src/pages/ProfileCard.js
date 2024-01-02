import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import CreateListModal from "./CreateListModal";
import { accordionActionsClasses } from "@mui/material";
function ProfileCard(props) {
  const { authState } = useContext(AuthContext);
  const [user, SetUser] = useState(props.user);
  const [userId, setUserId] = useState(props.user.id);
  const [isFollowed, SetIsFollowed] = useState(props.isFollowed);
  const [isFollow, SetIsFollow] = useState(false);
  const [listOfLists, SetListOfLists] = useState([]);
  const [listOfFollowers, setListOfFollowers] = useState([]);
  const [numberOfFollowers, setNumberOfFollowers] = useState(null);
  const [numberOfFollowed, setNumberOfFollowed] = useState(null);
  const [listOfFollowed, setListOfFollowed] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [currentList, setCurrentList] = useState(-1);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleClickOnList = (id) => {
    if (currentList == id) {
      console.log("Geldi burayaaaaŞ sıfırrrr");
      props.setSelectedListid(0);
      setCurrentList(-1);
    } else {
      console.log("Geldi burayaaaaŞ ", id, " ", currentList);
      props.setSelectedListid(id);
      setCurrentList(id);
    }
  };
  const followUser = (userId) => {
    axios.post(
      "http://localhost:3001/auth/follow",
      { followedid: userId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    );

    SetIsFollowed((old) => {
      return !old;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("BİRRRRRRRR");
        const followedResponse = await axios.get(
          `http://localhost:3001/auth/followed/${props.user.id}`,
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
        console.log("İKİİİİİİİİİİİ");
        const followerResponse = await axios.get(
          `http://localhost:3001/auth/follower/${props.user.id}`,
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
        console.log(
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          followedResponse.data.length
        );
        console.log(followerResponse.data.length);

        setListOfFollowed(followedResponse.data);
        setNumberOfFollowed(followedResponse.data.length);

        setListOfFollowers(followerResponse.data);
        setNumberOfFollowers(followerResponse.data.length);
      } catch (error) {
        console.error("Error fetching follower and following data:", error);
      }
    };

    fetchData();
    console.log("fetched");
  }, [props.user.id, isFollow]);

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
      });
    SetIsFollowed(props.isFollowed);
  }, [props, props.isFollowed, isModalOpen, authState, authState.id, user]);

  const UnFollowUser = (userId) => {
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
          Following: {numberOfFollowed} <br /> Followers: {numberOfFollowers}
        </p>
        <div className="buttons">
          {authState.id == props.user.id ? (
            <div></div>
          ) : (
            <div>
              {isFollowed ? (
                <button
                  backgroundColor={"red"}
                  onClick={() => {
                    UnFollowUser(user.id);
                    SetIsFollow(!isFollow);
                  }}
                  className="primary ghost"
                >
                  unFollow
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserId(user.id);
                    followUser(user.id);
                    SetIsFollow(!isFollow);
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
          <h6>Lists</h6>
          <ul>
            {listOfLists.map((list) => {
              return (
                <li onClick={() => handleClickOnList(list.id)}>
                  {list.listname}
                </li>
              );
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
