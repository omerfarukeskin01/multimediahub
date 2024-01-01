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
            <div>Ortalama Puan: {meanRating}</div>
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
            <button
              className="btn btn-primary"
              onClick={addComment}
              disabled={!newComment.trim()} // Yorum boşsa butonu devre dışı bırak
            >
              Yorum Ekle
            </button>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            {comments.map((comment) => (
              <div key={comment.id} className="mb-2 p-3 border rounded">
                <p>{comment.commentBody}</p>
                <small>Kullanıcı Adı: {comment.username}</small>
                {authState.username === comment.username && (
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => deleteComment(comment.id)}
                  >
                    Sil
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
