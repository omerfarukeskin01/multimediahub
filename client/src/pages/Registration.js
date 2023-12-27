import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Registration() {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
    Email:"",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
    Email:Yup.string().email().required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then((res) => {
      alert(res.data)
      navigate("/")
    });
  };

  return (
    <>
   
    <div className="registerpage">
    <div>
      <h2 className="registrationpage">Registration Page</h2>
    </div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="Registration">
        <ErrorMessage name="username" component="span" />
        <div className="usernamegroup">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="registerusericon">
    <path d="M2 22s3-2 4-3c0 0 6-6 6-9 0-4-3-7-7-7s-7 3-7 7c0 3 6 9 6 9 1 1 4 3 4 3"></path>
  </svg>
         
          <Field class="input"
            autocomplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="  Username"
          />
          </div>
          <ErrorMessage name="Email" component="span" class="erroremail"/>
          <div className="emailgroup">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  stroke="black" stroke-width="1.5"  class="registeremailicon">
    <path d="M22 2H2C1 2 0 3 0 4v16c0 1 1 2 2 2h20c1 0 2-1 2-2V4c0-1-1-2-2-2zM2 6l10 7 10-7M2 6l10 7 10-7" />
</svg>

          
          <Field class="input"
            autocomplete="off"
            id="inputCreatePost"
            name="Email"
            placeholder="Your Email.."
          />
          </div>


          <ErrorMessage name="password" component="span" />
          <div className="passwordgroup">
<svg stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="registerpasswordicon">
  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke-linejoin="round" stroke-linecap="round"></path>
</svg>
          
          <Field class="input"
            autocomplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Your Password..."
          />
          </div>

          <button type= "submit" class="loginbutton">
          Register
  <svg class="loginicon" viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clip-rule="evenodd"></path>
  </svg>
</button>
        </Form>
      </Formik>
    </div>
    </>
  );
}

export default Registration;