import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import Media from "../pages/Media";
function CreatePost() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [medias, setMedias] = useState([]);
  const initialValues = {
    title: "",
    postText: "",
    mediaid: "",
  };
  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
    console.log("hata burda");
    axios
      .get(`http://localhost:3001/Medias/`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setMedias(response.data);
        console.log(response.data);
      });

    console.log("hata burda 2");
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required(),
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate(`/`);
      });
  };
  return (
    <>
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />
        <div className="Button">
        <button className="filmButton" type="submit">Film</button>
        <button className="musicButton" type="submit">Music</button>
        <button className="gamesButton" type="submit">Games</button>
        </div>
        <div className="CreatePost">
        <button className="postButton" type="submit">CreatePost</button>  
        </div>
        </Form>
      </Formik>
      
    </div>
    {medias.map((value) => {
        return (
          <Media
            MediaNametext={value.MediaNametext}
            MediaImages={value.MediaImages}
            MediaType={value.MediaType}
          ></Media>
        );
      })}
    </>
  );
}

export default CreatePost;
