import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { Button } from "antd";
import AddToListModal from "./AddToListModal";
import { useNavigate } from "react-router-dom";
function Media(props) {
  const [inputValue, setInputValue] = useState("");
  const [isInputVisible, setInputVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, SetIsListModalOpen] = useState(false);
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showListModal = () => {
    SetIsListModalOpen(true);
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
          <img src={props.MediaImages} />
          <div class="descriptions">
            <h1
              onClick={() => {
                navigate(`/mediadetail/${props.id}`);
              }}
            >
              {props.MediaNametext}
            </h1>
            <p>{props.MediaType}</p>
            <div className="mediabutton">
              
              <button class="share-button" onClick={showModal}>
 Share
</button>
              <Button className="share-button" onClick={showListModal}>ADD TO LIST</Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <CreatePostModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          mediaId={props.id}
        ></CreatePostModal>
        <AddToListModal
          isModalOpen={isListModalOpen}
          setIsModalOpen={SetIsListModalOpen}
          mediaId={props.id}
        ></AddToListModal>
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

export default Media;
