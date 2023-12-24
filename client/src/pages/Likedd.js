import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helper/AuthContext";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import PostShow from "./PostShow";

function Likedd() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likedPostsToShow, setLikedPostsToShow] = useState([]); // likedPostsToShow state'ini ekle
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {

      navigate("/login");
    } else {
      axios.get("http://localhost:3001/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") }
      }).then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(response.data.likedPosts.map(like => like.PostId));
      });
    }
  }, [authState.status, navigate]);

  useEffect(() => {
    // likedPosts state'i değiştiğinde likedPostsToShow'u güncelle
    const updatedLikedPostsToShow = listOfPosts.filter(post =>
      likedPosts.includes(post.id)
    );
    setLikedPostsToShow(updatedLikedPostsToShow);
  }, [likedPosts, listOfPosts]);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        if (response.data.liked) {
          setLikedPosts([...likedPosts, postId]);
        } else {
          const updatedLikedPosts = likedPosts.filter(id => id !== postId);
          setLikedPosts(updatedLikedPosts);
        }
      });
  };
  return (
  <PostShow listOfPosts={likedPostsToShow} setListOfPosts={setLikedPostsToShow}/>
    )
}

export default Likedd;
