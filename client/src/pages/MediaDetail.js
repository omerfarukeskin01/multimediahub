import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Typography from "@mui/material/Typography";
function MediaDetail() {
  let { id } = useParams();
  const [mediaObject, setMediaObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const nav = useNavigate();
  const [rating, setRating] = useState(0);
  const [meanRating, setMeanRating] = useState(0); // [1]
  let [value, setValue] = useState(0);
  function formatTime(time) {
    const parts = time.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours}m `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes}h `;
    }
    if (seconds > 0) {
      formattedTime += `${seconds}m`;
    }
    return formattedTime.trim();
  }
  const handleChange = (event, newValue) => {
    axios
      .post(
        "http://localhost:3001/comments/rating",
        {
          value: newValue,
          MediaId: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setRating(newValue);
        }
      })
      .catch((error) => {
        console.log("Değerlendirme kaydetme hatası:", error);
      })
      .then(() => {
        axios
          .get(`http://localhost:3001/comments/rating/meanmedia/${id}`)
          .then((response) => {
            setMeanRating(response.data);
          });
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/comments/rating/meanmedia/${id}`)
      .then((response) => {
        setMeanRating(response.data);
      });
    axios
      .get(`http://localhost:3001/medias/mediadetail/${id}`)
      .then((response) => {
        setMediaObject(response.data);
      });

    axios.get(`http://localhost:3001/comments/media/${id}`).then((response) => {
      setComments(response.data);
    });

    axios
      .get(`http://localhost:3001/comments/rating/user/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data) {
          setRating(response.data.value);
        }
      })
      .catch((error) => {
        console.log("Değerlendirme getirme hatası:", error);
      });
  }, [id]); // rating'i bağımlılıklardan çıkarın

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments/media",
        {
          commentBody: newComment,
          MediaId: id, // Changed to MediaId
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
          const commentToAdd = { ...response.data };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3001/comments/media/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(comments.filter((val) => val.id !== commentId));
      });
  };
  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  return (
    <>
      {console.log(mediaObject)}
      <div className="container mt-4">
        <div className="row">
          {/* Sol Taraf: Medya Görseli ve Değerlendirmeler */}
          <div className="col-md-4">
            <img
              src={mediaObject?.MediaImages}
              className="img-fluid mb-3"
              alt="Medya Görseli"
            />
          </div>

          {/* Sağ Taraf: Medya Detayları */}
          <div className="col-md-6">
            <h1>{mediaObject.MediaNametext}</h1>
            {mediaObject?.MediaType}
            <Box className="mb-3">
              <Rating
                name="customized-10"
                value={rating}
                onChange={handleChange}
                max={10}
              />
            </Box>
            {mediaObject.MediaType === "Film" && (
              <div>
                {" "}
                <p>FilmLength:{mediaObject.FilmDetail?.FilmLength} </p>
                <p>FilmDirector: {mediaObject.FilmDetail?.FilmDirector}</p>
                <p>FilmSynopsis: {mediaObject.FilmDetail?.FilmSynopsis}</p>
                <p>
                  ReleaseDate:{" "}
                  {new Date(mediaObject.FilmDetail?.ReleaseDate).getFullYear()}
                </p>
              </div>
            )}
            {mediaObject.MediaType === "Game" && (
              <div>
                <p>Publisher: {mediaObject.GameDetail?.Publisher}</p>
                <p>
                  ReleaseDate:{" "}
                  {new Date(mediaObject.GameDetail?.ReleaseDate).getFullYear()}
                </p>
              </div>
            )}
            {mediaObject.MediaType === "Series" && (
              <div>
                {" "}
                <p>
                  NumberOfEpisodes: {mediaObject.SeriesDetail?.NumberOfEpisodes}
                </p>
                <p>
                  NumberOfSeasons :{mediaObject.SeriesDetail?.NumberOfSeasons}
                </p>
                <p>
                  SeriesSynopsis :{mediaObject.SeriesDetail?.SeriesSynopsis}
                </p>
              </div>
            )}
          </div>
          <div className="col-md-2">
            <div className="avarege">Ortalama Puan: {meanRating}</div>
          </div>
        </div>

        {/* Yorum Ekleme ve Listeleme */}
        <div className="row mt-4">
          <div className="col">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Yorum ekle..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            
              <button class="bookmarkBtn"  onClick={addComment}
              disabled={!newComment.trim()} >  
  <span class="IconContainer"> 
   <svg fill="white" viewBox="0 0 512 512" height="1em"><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"></path></svg>
  </span>
  <p class="comment-text">Add</p>
</button>
        
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            {comments.map((comment) => (
              <div key={comment.id} className="mb-2p-3borderrounded">
                <p>{comment.commentBody}</p>
                <small>Username: {comment.username}</small>
                {authState.username === comment.username && (
                    <button class="delete-button" onClick={() => deleteComment(comment.id)}>
  <svg class="delete-svgIcon" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
</button>
                 
                  
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MediaDetail;
