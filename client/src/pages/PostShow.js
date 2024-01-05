import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";

function PostShow(props) {
  const [showForm, setShowForm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { authState } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [usernames, setUsernames] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/comments/post/${selectedPostId}`)
      .then((response) => {
        setComments(response.data);
      });

    axios
      .get("http://localhost:3001/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        const likedPostsData = response.data.likedPosts;
        if (likedPostsData && Array.isArray(likedPostsData)) {
          const likedPostIds = likedPostsData.map((like) => like.PostId);
          setLikedPosts(likedPostIds);
        } else {
          // Handle the case where likedPostsData is not an array
          console.error("Liked posts data is not an array:", likedPostsData);
        }
      });
  }, [selectedPostId]);

  const addComment = () => {
    console.log(selectedPostId);
    axios
      .post(
        "http://localhost:3001/comments/post",
        {
          commentBody: newComment,
          PostId: selectedPostId,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          axios
            .get(`http://localhost:3001/comments/post/${selectedPostId}`)
            .then((response) => {
              setComments(response.data);
              console.log(response.data);
            });
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/post/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const handleButtonClick = (postId) => {
    setSelectedPostId(postId);
    if (!showForm) {
      axios
        .get(`http://localhost:3001/comments/post/${postId}`)
        .then((response) => {
          setComments(response.data);
        });
    }

    setShowForm(!showForm);
  };
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

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
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        }
      });
  };

  return (
    <div>
      {props.listOfPosts &&
        props.listOfPosts.map((value, key) => {
          if (!value) {
            return <h1 style={{ color: "white" }}>Henüz post yok</h1>;
          }
          return (
            <div key={key} class="post-card">
              <div class="avatar">
                <img
                  className="avatar"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                  alt="user"
                />
                <div
                  className="post-username"
                  onClick={() => {
                    navigate(`/profile/${value.UserId}`);
                  }}
                >
                  {value.User?.username}
                  {authState.username === value.User?.username && (
                    <button
                      class="bin-button"
                      onClick={() => deletePost(value.id)}
                    >
                      <svg
                        class="bin-top"
                        viewBox="0 0 39 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          y1="5"
                          x2="39"
                          y2="5"
                          stroke="white"
                          stroke-width="4"
                        ></line>
                        <line
                          x1="12"
                          y1="1.5"
                          x2="26.0357"
                          y2="1.5"
                          stroke="white"
                          stroke-width="3"
                        ></line>
                      </svg>
                      <svg
                        class="bin-bottom"
                        viewBox="0 0 33 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask id="path-1-inside-1_8_19" fill="white">
                          <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                        </mask>
                        <path
                          d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                          fill="white"
                          mask="url(#path-1-inside-1_8_19)"
                        ></path>
                        <path
                          d="M12 6L12 29"
                          stroke="white"
                          stroke-width="4"
                        ></path>
                        <path
                          d="M21 6V29"
                          stroke="white"
                          stroke-width="4"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <a href="#" class="title">
                {value.postText}
              </a>
              <span class="datetime">{value.Media?.MediaNametext}</span>
              <div
                className="body"
                onClick={() => {
                  navigate(`/mediadetail/${value.MediaId}`);
                }}
              >
                <div class="image-preview">
                  {" "}
                  <img src={value.Media?.MediaImages}></img>
                </div>
              </div>
              <div class="comment-like">
                <button
                  className="likeButton"
                  onClick={() => likeAPost(value.id)}
                  class={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                >
                  <span>
                    <svg fill="" viewBox="0 0 32 32">
                      <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                      <g
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        id="SVGRepo_tracerCarrier"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M21.081,6C23.752,6.031,26,8.766,26,12c0,5.106-6.47,10.969-10.001,13.593 C12.466,22.974,6,17.12,6,12c0-3.234,2.248-5.969,4.918-6C13.586,6.175,13.926,6.801,16,8.879C18.069,6.806,18.418,6.173,21.081,6 M20.911,4.006L20.912,4C18.993,4,17.259,4.785,16,6.048C14.741,4.785,13.007,4,11.088,4l0.001,0.006C7.044,3.936,4,7.719,4,12 c0,8,11.938,16,11.938,16h0.124C16.062,28,28,20,28,12C28,7.713,24.951,3.936,20.911,4.006z"
                          className="bentblocks_een"
                        ></path>
                      </g>
                    </svg>
                    {console.log("ŞLA VAD VADK VKAŞD VKADÇV  ,", value)}
                    <div className="likesLength">{value.Likes.length}</div>
                  </span>
                </button>

                <button
                  class="commentButton"
                  onClick={() => handleButtonClick(value.id)}
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                      <g
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        id="SVGRepo_tracerCarrier"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill=""
                          d="M4.49999 20.25C4.37892 20.2521 4.25915 20.2248 4.1509 20.1705C4.04266 20.1163 3.94916 20.0366 3.87841 19.9383C3.80766 19.8401 3.76175 19.7261 3.74461 19.6063C3.72747 19.4864 3.73961 19.3641 3.77999 19.25L5.37999 14C5.03175 13.0973 4.85539 12.1375 4.85999 11.17C4.8584 10.1057 5.06918 9.0518 5.47999 8.06999C5.88297 7.13047 6.45975 6.27549 7.17999 5.54999C7.90382 4.82306 8.76344 4.24545 9.70999 3.84999C10.6889 3.4344 11.7415 3.22021 12.805 3.22021C13.8685 3.22021 14.9211 3.4344 15.9 3.84999C17.3341 4.46429 18.5573 5.48452 19.4191 6.7851C20.2808 8.08568 20.7434 9.60985 20.75 11.17C20.7437 13.2771 19.9065 15.2966 18.42 16.79C17.6945 17.5102 16.8395 18.087 15.9 18.49C14.0091 19.2819 11.8865 19.3177 9.96999 18.59L4.71999 20.19C4.64977 20.22 4.57574 20.2402 4.49999 20.25ZM12.8 4.74999C11.5334 4.75547 10.2962 5.13143 9.24068 5.83153C8.18519 6.53164 7.35763 7.52528 6.85999 8.68999C6.19883 10.2911 6.19883 12.0889 6.85999 13.69C6.91957 13.8548 6.91957 14.0352 6.85999 14.2L5.62999 18.37L9.77999 17.11C9.94477 17.0504 10.1252 17.0504 10.29 17.11C11.0824 17.439 11.932 17.6083 12.79 17.6083C13.648 17.6083 14.4976 17.439 15.29 17.11C16.0708 16.7813 16.779 16.3018 17.3742 15.6989C17.9693 15.096 18.4397 14.3816 18.7583 13.5967C19.077 12.8118 19.2376 11.9717 19.231 11.1245C19.2244 10.2774 19.0508 9.4399 18.72 8.65999C18.2234 7.50094 17.398 6.51285 16.3459 5.81792C15.2937 5.123 14.0609 4.75171 12.8 4.74999Z"
                        ></path>{" "}
                      </g>
                    </svg>
                    {comments.length}
                  </span>
                </button>
                {showForm && selectedPostId === value.id && (
                  <div class="commentcard">
                    <span class="commenttitle">Comments</span>

                    {comments.map((comment, key) => {
                      return (
                        <div class="comments">
                          <div class="comment-container">
                            <div class="user">
                              <div class="user-pic">
                                <svg
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  height="20"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke-linejoin="round"
                                    fill="#707277"
                                    stroke-linecap="round"
                                    stroke-width="2"
                                    stroke="#707277"
                                    d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                                  ></path>
                                  <path
                                    stroke-width="2"
                                    fill="#707277"
                                    stroke="#707277"
                                    d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div key={key} className="comment">
                              <div key={key} className="user-info">
                                <span>{comment.username}</span>
                              </div>

                              <p class="comment-content">
                                {comment.commentBody}
                              </p>
                            </div>
                            {authState.username === comment.username && (
                              <button
                                class="comdelete-btn"
                                onClick={() => {
                                  deleteComment(comment.id);
                                }}
                              >
                                <svg
                                  viewBox="0 0 15 17.5"
                                  height="17.5"
                                  width="15"
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="delete-icon"
                                >
                                  <path
                                    transform="translate(-2.5 -1.25)"
                                    d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                                    id="Fill"
                                  ></path>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div class="text-box">
                      <div class="box-container">
                        <textarea
                          placeholder="Reply"
                          type="text"
                          autoComplete="off"
                          value={newComment}
                          onChange={(event) => {
                            setNewComment(event.target.value);
                          }}
                        ></textarea>
                        <div>
                          <div class="formatting">
                            <button
                              type="submit"
                              class="send"
                              title="Send"
                              onClick={addComment}
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                height="18"
                                width="18"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  stroke-linejoin="round"
                                  stroke-linecap="round"
                                  stroke-width="2.5"
                                  stroke="#ffffff"
                                  d="M12 5L12 20"
                                ></path>
                                <path
                                  stroke-linejoin="round"
                                  stroke-linecap="round"
                                  stroke-width="2.5"
                                  stroke="#ffffff"
                                  d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default PostShow;
