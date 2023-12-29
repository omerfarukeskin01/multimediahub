import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import PostShow from "./PostShow";
import ProfileCard from "./ProfileCard";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [followedList, setFollowedList] = useState([]);
  const { authState } = useContext(AuthContext);
  const [userr, setUser] = useState({});

  useEffect(() => {
    console.log(
      "giriş: ",
      authState.id,
      " ",
      localStorage.getItem("accessToken")
    );
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
    console.log("followedlist: ", followedList);
  }, []);

  return (
    <div className="profilePageContainer">
      {followedList.map((id) => {
        console.log(id, "9999999999", userr.id);
      })}
      {followedList.includes(userr.id) ? (
        <ProfileCard user={userr} isFollowed={true}></ProfileCard>
      ) : (
        <ProfileCard user={userr} isFollowed={false}></ProfileCard>
      )}
      <PostShow
        listOfPosts={listOfPosts}
        setListOfPosts={setListOfPosts}
      ></PostShow>
      <div className="basicInfo">
        {/*<h1> Username: {username} </h1>*/}
        {authState.username == username && (
          <button
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change My Password
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
