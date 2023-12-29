import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import PostShow from "./PostShow";
import ProfileCard from "./ProfileCard";

function Users() {
  let inputname;
  const [listOfUsername, setListOfUsername] = useState([]);
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [followedList, setFollowedList] = useState([]);
  const { authState } = useContext(AuthContext);
  const [userr, setUser] = useState({});
  const [Inputname, setInputUsername] = useState("");

  useEffect(() => {
    console.log("udst: ", listOfUsername);
    console.log(
      "giriş: ",
      authState.id,
      " ",
      localStorage.getItem("accessToken")
    );
    console.log(Inputname);
    const data = { username: Inputname };
    axios
      .get(`http://localhost:3001/auth/usersearch`, { params: data })
      .then((response) => {
        setListOfUsername(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching usernames:", error);
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
      });
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [Inputname]);

  return (
    <div className="profilePageContainer">
      <div class="textInputWrapper">
        <input
          placeholder="search"
          type="text"
          class="textInput"
          onChange={(event) => {
            setInputUsername(event.target.value);
          }}
        />
      </div>

      {listOfUsername.map((userrr) => {
        return followedList.includes(userrr.id) ? (
          <ProfileCard user={userrr} isFollowed={true}></ProfileCard>
        ) : (
          <ProfileCard user={userrr} isFollowed={false}></ProfileCard>
        );
      })}
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

export default Users;
