import React, { useState } from "react";

function PostShow(props) {

  const [inputValue, setInputValue] = useState('');
  const [isInputVisible, setInputVisible] = useState(false);
  

  const sendDataToCreatPost = () => {
    
 

    props.handleMediaId(props.id)
  };
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
      
    </>
  );
}

export default Media;
