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
  const [mediaId, setMediaId] = useState(0);

  const handleMediaId = (data) => {

    setMediaId(data);

  };
  const initialValues = {
    title: "",
    postText: "",
    mediaid: mediaId,
  };
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
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
    data["MediaId"]=mediaId;
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate(`/`);
        console.log(data)
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
            <ErrorMessage name="mediaid" component="div" />
            <label>{mediaId} </label>
            <Field type="hidden" name="mediaid" value={mediaId} />

           



            <button type="submit">Create Post</button>
          </Form>
        </Formik>

      </div>
      {medias.map((value) => {
        return (
          <Media handleMediaId={handleMediaId}
            MediaNametext={value.MediaNametext}
            MediaImages={value.MediaImages}
            MediaType={value.MediaType}
            id={value.id}
          ></Media>
        );
      })}
    </>
  );
}

export default CreatePost;
