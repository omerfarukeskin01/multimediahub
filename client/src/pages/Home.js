import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import PostShow from "./PostShow";
import ProfileCard from "./ProfileCard";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);

  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/auth/followedposts", {
          headers: authState.status
            ? { accessToken: localStorage.getItem("accessToken") }
            : {},
        })
        .then((response) => {
          setListOfPosts(response.data?.listOfPosts);
        });
    }
  }, [authState.status, navigate]);

  return (
    <>
      <div className="homePage">
        {console.log("-------------", listOfPosts)}
        <PostShow
          listOfPosts={listOfPosts}
          setListOfPosts={setListOfPosts}
        ></PostShow>
      </div>
    </>
  );
}

export default Home;
