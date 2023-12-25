import React, { useEffect, useState,useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
  
      setUsername(response.data?.username);
    });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        
        <h1> Username: {username} </h1>
        {authState.username==username && (
          <button onClick={()=> navigate('/changepassword') }>Change My Password</button>
        )}
        
      </div>
     
    </div>
  );
}

export default Profile;