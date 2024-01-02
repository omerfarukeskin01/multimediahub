import React, { useContext, useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";

function CreateListModal(props) {
  const formikRef = useRef();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  //----------------------------------
  const [open, setOpen] = useState(false); //hata mesaji için
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  //---------------------------------------------
  const initialValues = {
    listname: "",
  };
  const validationSchema = Yup.object().shape({
    listname: Yup.string()
      .min(1)
      .required("You must enter a Name for your list!"),
  });
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/lists", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(response.data);
      });
  };

  const handleOk = () => {
    const formData = formikRef.current.values;
    const isValid = Object.keys(formikRef.current.errors).length === 0;
    if (isValid) {
      onSubmit(formData);
      props.setIsModalOpen(false);
      setOpen(true);
    } else {
      alert("input not valid");
    }
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "top" }}
      >
        <Alert
          onClose={handleClose}
          variant="filled"
          severity="success"
          sx={{ width: "25%" }}
        >
          Successfully
        </Alert>
      </Snackbar>
      <Modal
        okText="Add list"
        title="Share"
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="">
              <label>listname: </label>
              <ErrorMessage name="listname" component="span" />
              <Field
                autocomplete="off"
                id="inputlistname"
                name="listname"
                placeholder="(Ex. name of the list)"
              />
            </Form>
          </Formik>
        </div>
      </Modal>
    </>
  );
}

export default CreateListModal;
