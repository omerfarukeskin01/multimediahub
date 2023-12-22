import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helper/AuthContext";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    //tamaen yanlış bir yaklaşım kullancı hiç giriş yapmazsa bu sefer ana sayfaya griiş yetkis olamdığı için boşa çıyor
    if (!authState.status) {
      navigate("/login");
    } else {
      axios.get("http://localhost:3001/posts", {
        headers: authState.status ? { accessToken: localStorage.getItem("accessToken") } : {}
      })
      .then((response) => {
        setListOfPosts(response.data.listOfPosts);

        if (authState.status) {
          const likedPostIds = response.data.likedPosts.map(like => like.PostId);
          setLikedPosts(likedPostIds);
        }
        console.log()
      });
    }
  }, [authState.status, navigate]);


  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          }
          )
          
        );
        
        // likedPosts state'ini de güncelleyin
        if (response.data.liked) {
          setLikedPosts([...likedPosts, postId]);
        } else {
          setLikedPosts(likedPosts.filter(id => id !== postId));
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">{value.username}</div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => likeAPost(value.id)}
                  className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                />

                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
