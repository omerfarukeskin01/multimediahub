import React, { useState } from "react";

function Media(props) {
  const [inputValue, setInputValue] = useState('');
  const [isInputVisible, setInputVisible] = useState(false);

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
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '1000px', 
          height: '100px',
          backgroundColor: '#f0f0f0', 
          margin: '10px' 
      }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={props.MediaImages} alt="test" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
            <div>{props.MediaNametext}</div>
            <div style={{ marginLeft: '15px' }}>{props.MediaType}</div>
          </div>
          <div>
              <button onClick={toggleInputVisibility} style={{background:'#1E90FF'}}>Share</button>
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

export default Media;
