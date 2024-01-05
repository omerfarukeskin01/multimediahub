import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Carousel, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import Media from "../pages/Media";
function CreatePost() {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [medias, setMedias] = useState([]);
  const carouselRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Infinity);
  const otherMedias = () => {
    let page = currentPage + 1;
    setCurrentPage(page);
    if (page > maxPage) {
      setCurrentPage(1);
      page = 1;
    }
    axios.get(`http://localhost:3001/Medias/${page}`).then((response) => {
      setError("");
      setMedias(response.data?.listOfMedias);
      setMaxPage(response.data?.numberOfPages);
      console.log(response.data);
      window.scrollTo(0, 0);
    });
  };
  const next = () => {
    carouselRef.current.next();
  };

  const previous = () => {
    carouselRef.current.prev();
  };

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  useEffect(() => {
    setCurrentPage(1);
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }

    axios
      .get(`http://localhost:3001/Medias/${currentPage}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setError("");
        setMedias(response.data?.listOfMedias);
        setMaxPage(response.data?.numberOfPages);
        console.log(response.data);
      });
  }, []);
  const searchOnclick = (e) => {
    console.log(e.target.value);
    if (e.target.value !== "") {
      axios
        .get(`http://localhost:3001/Medias/mediasearch`, {
          params: { mediaQuery: e.target.value },
        })
        .then((response) => {
          setError("");
          console.log("searxh medias", response.data);
          setMedias(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError("Media bulunamadı.");
          } else {
            setError("Bir hata oluştu.");
          }
        });
    } else {
      axios
        .get(`http://localhost:3001/Medias/${currentPage}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setMedias(response.data?.listOfMedias);
          setMaxPage(response.data?.numberOfPages);
        });
    }
  };

  return (
    <>
      <div class="textInputWrapper">
        <input
          placeholder="search"
          type="text"
          class="textInput"
          onChange={searchOnclick}
        />
      </div>

      {error ? (
        <p>{error}</p> // Hata mesajını göster
      ) : (
        <div className="mediacontainer">
          {console.log(medias)}
          {medias.map((value) => (
            <div key={value.id} className="media-card">
              <Media
                MediaNametext={value.MediaNametext}
                MediaImages={value.MediaImages}
                MediaType={value.MediaType}
                id={value.id}
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <button onClick={otherMedias}>Other Medias</button>
        <span style={{ color: "white" }}>{currentPage}</span>
      </div>

      {/*
      <div className="test">

  
        <Button onClick={previous}>Önceki</Button>
        <Button onClick={next}>Sonraki</Button>
        <Carousel ref={carouselRef} afterChange={onChange}>
          {medias.map((value) => (
            <div key={value.id} className="media-slide">
              <Media
                MediaNametext={value.MediaNametext}
                MediaImages={value.MediaImages}
                MediaType={value.MediaType}
                id={value.id}
              />
            </div>
          ))}
        </Carousel>
      </div>*/}
    </>
  );
}

export default CreatePost;
