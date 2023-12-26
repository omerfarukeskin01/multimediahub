import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { Button } from 'antd';
function Media(props) {

  const [inputValue, setInputValue] = useState('');
  const [isInputVisible, setInputVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const toggleInputVisibility = () => {
    setInputVisible(!isInputVisible);
  };

  const inputStyle = {
    opacity: isInputVisible ? 1 : 0,
    transition: 'opacity 0.5s ease',
    height: isInputVisible ? 'auto' : '0',
    overflow: 'hidden'
  };

  return (
    <>
    
      <div class="wrapper">
        <div class="card">
          <img src={props.MediaImages} />
          <div class="descriptions">
            <h1>{props.MediaNametext}</h1>
            <p>
              {props.MediaType}</p>
              <Button type="primary" onClick={showModal}>
          Share
        </Button>
          </div>
        </div>
      </div>



      <div>
        
        <CreatePostModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} mediaId={props.id}></CreatePostModal>
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