import React, { useEffect, useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { Button } from "antd";
import AddToListModal from "./AddToListModal";
import axios from "axios";
function MediaForList(props) {
  //media listid(silme işlemi için)
  const [inputValue, setInputValue] = useState("");
  const [isInputVisible, setInputVisible] = useState(false);
  useEffect(() => {}, []);
  const deleteMediaFromListClick = () => {
    //axios delete
    axios
      .delete("http://localhost:3001/lists/removemediafromlist", {
        data: {
          listid: props.listid,
          MediaId: props.media.id,
        },
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(
          response.data,
          "   listid",
          props.listid,
          "  mediaid :",
          props.media.id
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const toggleInputVisibility = () => {
    setInputVisible(!isInputVisible);
  };

  const inputStyle = {
    opacity: isInputVisible ? 1 : 0,
    transition: "opacity 0.5s ease",
    height: isInputVisible ? "auto" : "0",
    overflow: "hidden",
  };

  return (
    <>
      <div class="wrapper">
        <div class="card">
          <img src={props.media.MediaImages} />
          <div class="descriptions">
            <h1>{props.media.MediaNametext}</h1>
            <p>{props.media.MediaType}</p>
            <button className="medialist"  onClick={deleteMediaFromListClick}>
              Delete Media
            </button>
          </div>
        </div>
      </div>

      <div style={inputStyle}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Bir şeyler yazın"
        />
      </div>
    </>
  );
}

export default MediaForList;
