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
      {followedList.map((id) => {})}
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
