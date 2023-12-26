import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import Media from "../pages/Media";
function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [medias, setMedias] = useState([]);
 



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
   <div className="sex">
      {medias.map((value) => {
        return (
        
          <Media 
            MediaNametext={value.MediaNametext}
            MediaImages={value.MediaImages}
            MediaType={value.MediaType}
            id={value.id}
          ></Media>
        );
      })}
      </div>
    </>

  );

}

export default CreatePost;