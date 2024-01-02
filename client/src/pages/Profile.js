import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import PostShow from "./PostShow";
import ProfileCard from "./ProfileCard";
import MediaForList from "./MediaForList";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfLists, setListOfLists] = useState([]);
  const [followedList, setFollowedList] = useState([]);
  const { authState } = useContext(AuthContext);
  const [userr, setUser] = useState({});
  const [selectedListid, setSelectedListid] = useState(0); //0 is posts

  useEffect(() => {
    console.log(
      "giriş: ",
      authState.id,
      " ",
      localStorage.getItem("accessToken")
    );
    axios
      .get(`http://localhost:3001/lists/getlistbylistid/${selectedListid}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfLists(response.data);
        console.log("RESPONSE DATA: ", response.data);
      });
    axios
      .get(`http://localhost:3001/auth/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(" response: ", response.data.id);
        axios
          .get(`http://localhost:3001/auth/followed/${response.data.id}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          })
          .then((response) => {
            if (response) {
              setFollowedList(
                response.data?.map((followed) => {
                  return followed.id;
                })
              );
            }
          });
      });

    axios
      .get(`http://localhost:3001/auth/basicinfo/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setUsername(response.data?.username);
        setUser(response?.data);
        console.log("KULLANICININ İDSİİİİİ", response.data.id);
      });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
    console.log("LİSTENIN IDSI", selectedListid);
    console.log(listOfLists);
  }, [selectedListid]);

  return (
    <div className="profilePageContainer">
      {followedList.includes(userr.id) ? (
        <ProfileCard
          setSelectedListid={setSelectedListid}
          user={userr}
          isFollowed={true}
        ></ProfileCard>
      ) : (
        <ProfileCard
          setSelectedListid={setSelectedListid}
          user={userr}
          isFollowed={false}
        ></ProfileCard>
      )}
      {selectedListid == 0 ? (
        <PostShow
          listOfPosts={listOfPosts}
          setListOfPosts={setListOfPosts}
        ></PostShow>
      ) : (
        listOfLists.map((list) => {
          return (
            <MediaForList listid={selectedListid} media={list}></MediaForList>
          );
        })
      )}
      {console.log("LISTEEEEEE:", listOfLists)}
      <div className="basicInfo">
        {/*<h1> Username: {username} </h1>*/}
        {authState.username == username && (
          <button
            class="cssbuttons-io-button"
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change My Password
            <div class="change-icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
