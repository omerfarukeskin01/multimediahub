import React, { useContext, useEffect, useState ,useRef} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { Button, Modal } from 'antd';
import { useNavigate } from "react-router-dom";

const CreatePostModal = (props) => {
    const formikRef = useRef();
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
   


    const initialValues = {
        title: "",
        postText: "",

    };
    const validationSchema = Yup.object().shape({
        postText: Yup.string().required("You must input a Title!"),
      


    });
    const onSubmit = (data) => {
        
        axios
            .post("http://localhost:3001/posts", data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                navigate(`/`);
                console.log(data)
            });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const formData = formikRef.current.values;
        formData["MediaId"] = props.mediaId;
        onSubmit(formData)
        setIsModalOpen(false);
      };
      
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>


           
    
           
           
           
           

          
                   <Button type="primary" onClick={showModal}>
                Share
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="">
                    <Formik
                    innerRef={formikRef}
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}

                    >
                        <Form className="">
                           
                    
                            <label>Post: </label>
                            <ErrorMessage name="postText" component="span" />
                            <Field
                                autocomplete="off"
                                id="inputCreatePost"
                                name="postText"
                                placeholder="(Ex. Post...)"
                            />

                        </Form>
                    </Formik>

                </div>
            </Modal>
        </>
    );
};
export default CreatePostModal;