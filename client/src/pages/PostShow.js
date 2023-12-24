import React, { useEffect, useState } from "react";
import axios from "axios";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useNavigate } from 'react-router-dom';


function PostShow(props) {

  const [likedPosts, setLikedPosts] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    // Beğenilen postların ID'lerini sunucudan al
    axios.get('http://localhost:3001/posts', {
      headers: { accessToken: localStorage.getItem("accessToken") }
    }).then(response => {
      const likedPostIds = response.data.likedPosts.map(like => like.PostId);
      setLikedPosts(likedPostIds);
    });
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        props.setListOfPosts(
          props.listOfPosts.map((post) => {
            if (post.id === postId) {
              const updatedLikes = response.data.liked
                ? [...post.Likes, 0]
                : post.Likes.slice(0, -1);
              return { ...post, Likes: updatedLikes };
            } else {
              return post;
            }
          })
        );

        if (response.data.liked) {
          setLikedPosts([...likedPosts, postId]);
        } else {
          setLikedPosts(likedPosts.filter(id => id !== postId));
        }
      });
  };




  return (
    <div>
      {props.listOfPosts && props.listOfPosts.map((value, key) => {
        return (
        

          <div key={key} className="post">


            <div className="title"> {value.Media?.MediaNametext} </div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              <img src={value.Media?.MediaImages} alt="" height="150px"></img>
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">{value.User.username}</div>
              
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

export default PostShow;
