import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useParams } from 'react-router-dom';


function PostShow(props) {
  const [showForm, setShowForm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  let { id } = useParams();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);

  const navigate = useNavigate();
  const handleButtonClick = (postId) => {
    setSelectedPostId(postId);
    setShowForm(!showForm);
    
  };
  useEffect(() => {
    


    axios.get(`http://localhost:3001/comments/${selectedPostId}`).then((response) => {
      setComments(response.data);
    });
    // Beğenilen postların ID'lerini sunucudan al
    axios.get('http://localhost:3001/posts', {
      headers: { accessToken: localStorage.getItem("accessToken") }
    }).then(response => {
      const likedPostIds = response.data.likedPosts.map(like => like.PostId);
      setLikedPosts(likedPostIds);
    });
  }, [selectedPostId]);


  

  const addComment = () => {
    console.log(selectedPostId)
    axios
      .post(
        "http://localhost:3001/comments",
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
          axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
            console.log(response.data)
          });
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
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
          
          <div key={key} class="post-card">
          <div class="avatar"></div>
          <a href="#" class="title">{value.postText}</a>
          <span class="datetime">{value.Media?.MediaNametext}</span>
           <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
          <div class="image-preview"> <img src={value.Media?.MediaImages}></img></div>
          </div>
          <div class="comment-like">
          <button className="likeButton" onClick={() => likeAPost(value.id)}
        class={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}>
  <span >
    <svg fill="" viewBox="0 0 32 32">
      <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
      <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
      <g  id="SVGRepo_iconCarrier">
        <path d="M21.081,6C23.752,6.031,26,8.766,26,12c0,5.106-6.47,10.969-10.001,13.593 C12.466,22.974,6,17.12,6,12c0-3.234,2.248-5.969,4.918-6C13.586,6.175,13.926,6.801,16,8.879C18.069,6.806,18.418,6.173,21.081,6 M20.911,4.006L20.912,4C18.993,4,17.259,4.785,16,6.048C14.741,4.785,13.007,4,11.088,4l0.001,0.006C7.044,3.936,4,7.719,4,12 c0,8,11.938,16,11.938,16h0.124C16.062,28,28,20,28,12C28,7.713,24.951,3.936,20.911,4.006z" className="bentblocks_een"></path>
      </g>
    </svg>
    <div className="likesLength">
    {value.Likes.length}
    </div>
    
  </span>
</button>

  <button class="commentButton" onClick={() => handleButtonClick(value.id)}>
            <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M4.49999 20.25C4.37892 20.2521 4.25915 20.2248 4.1509 20.1705C4.04266 20.1163 3.94916 20.0366 3.87841 19.9383C3.80766 19.8401 3.76175 19.7261 3.74461 19.6063C3.72747 19.4864 3.73961 19.3641 3.77999 19.25L5.37999 14C5.03175 13.0973 4.85539 12.1375 4.85999 11.17C4.8584 10.1057 5.06918 9.0518 5.47999 8.06999C5.88297 7.13047 6.45975 6.27549 7.17999 5.54999C7.90382 4.82306 8.76344 4.24545 9.70999 3.84999C10.6889 3.4344 11.7415 3.22021 12.805 3.22021C13.8685 3.22021 14.9211 3.4344 15.9 3.84999C17.3341 4.46429 18.5573 5.48452 19.4191 6.7851C20.2808 8.08568 20.7434 9.60985 20.75 11.17C20.7437 13.2771 19.9065 15.2966 18.42 16.79C17.6945 17.5102 16.8395 18.087 15.9 18.49C14.0091 19.2819 11.8865 19.3177 9.96999 18.59L4.71999 20.19C4.64977 20.22 4.57574 20.2402 4.49999 20.25ZM12.8 4.74999C11.5334 4.75547 10.2962 5.13143 9.24068 5.83153C8.18519 6.53164 7.35763 7.52528 6.85999 8.68999C6.19883 10.2911 6.19883 12.0889 6.85999 13.69C6.91957 13.8548 6.91957 14.0352 6.85999 14.2L5.62999 18.37L9.77999 17.11C9.94477 17.0504 10.1252 17.0504 10.29 17.11C11.0824 17.439 11.932 17.6083 12.79 17.6083C13.648 17.6083 14.4976 17.439 15.29 17.11C16.0708 16.7813 16.779 16.3018 17.3742 15.6989C17.9693 15.096 18.4397 14.3816 18.7583 13.5967C19.077 12.8118 19.2376 11.9717 19.231 11.1245C19.2244 10.2774 19.0508 9.4399 18.72 8.65999C18.2234 7.50094 17.398 6.51285 16.3459 5.81792C15.2937 5.123 14.0609 4.75171 12.8 4.74999Z"></path> </g></svg>{4}</span>
          </button>
          {showForm && selectedPostId === value.id &&(
         <div class="commentcard">
         <span class="commenttitle">Comments</span>
         <div class="comments">
          
          
              
           {comments.map((comment, key) => {
            return ( 

              <div class="comment-container">
              <div class="user">
                  <div class="user-pic">
                    <svg fill="none" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linejoin="round" fill="#707277" stroke-linecap="round" stroke-width="2" stroke="#707277" d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"></path>
                      <path stroke-width="2" fill="#707277" stroke="#707277" d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"></path>
                    </svg>
                  </div>
                  </div>
           
              <div key={key} className="comment">
               <div key={key} className="user-info">
               
                 <span>{comment.username}</span>
               </div>
               
            
             <p class="comment-content" >
             {comment.commentBody}
            </p>
          </div>
           </div>
            );
          })}
          
         </div>
       
         <div class="text-box">
           <div class="box-container">
             <textarea placeholder="Reply"  type="text"
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}>
             </textarea>
             <div>
               <div class="formatting">
                 <button type="submit" class="send" title="Send"  onClick={addComment} >
                   <svg fill="none" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                     <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#ffffff" d="M12 5L12 20"></path>
                     <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#ffffff" d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9"></path>
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





 /*
         <div class="card">
  <span class="title">Comments</span>
  <div class="comments">
    <div class="comment-react">
      <button>
        <svg fill="none" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
          <path fill="#707277" stroke-linecap="round" stroke-width="2" stroke="#707277" d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"></path>
        </svg>
      </button>
      <hr>
      <span>14</span>
    </div>
    <div class="comment-container">
      <div class="user">
        <div class="user-pic">
          <svg fill="none" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linejoin="round" fill="#707277" stroke-linecap="round" stroke-width="2" stroke="#707277" d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"></path>
            <path stroke-width="2" fill="#707277" stroke="#707277" d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"></path>
          </svg>
        </div>
        <div class="user-info">
          <span>Yassine Zanina</span>
          <p>Wednesday, March 13th at 2:45pm</p>
        </div>
      </div>
      <p class="comment-content">
        I've been using this product for a few days now and I'm really impressed! The interface is intuitive and easy to
        use, and the features are exactly what I need to streamline my workflow.
      </p>
    </div>
  </div>

  <div class="text-box">
    <div class="box-container">
      <textarea placeholder="Reply"></textarea>
      <div>
        <div class="formatting">
          <button type="submit" class="send" title="Send">
            <svg fill="none" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#ffffff" d="M12 5L12 20"></path>
              <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#ffffff" d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
          */
        );
      })}
    </div>
  );
}

export default PostShow;
