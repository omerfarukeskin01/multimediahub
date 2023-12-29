import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Carousel, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import Media from "../pages/Media";
function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [medias, setMedias] = useState([]);
  const carouselRef = useRef();

  const next = () => {
    carouselRef.current.next();
  };

  const previous = () => {
    carouselRef.current.prev();
  };

  const contentStyle = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }

    axios
      .get(`http://localhost:3001/Medias/`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setMedias(response.data);
        console.log(response.data);
      });
  }, []);

  return (
    <>
      <div className="mediacontainer">
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
