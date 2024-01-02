import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Modal } from "antd";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
function AddToListModal(props) {
  //props.mediaid kullanıcıdan listid dropdowndan
  //----------------------------------
  const [user, SetUser] = useState({});
  const [listOfLists, SetListOfLists] = useState([]);
  const [open, setOpen] = useState(false); //hata mesaji için
  const [listid, setListId] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`http://localhost:3001/auth/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        axios
          .get(`http://localhost:3001/lists/${response.data.id}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          })
          .then((response2) => {
            SetListOfLists(response2.data);
            setIsLoading(false);
          });
      });
  }, [props]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  //---------------------------------------------
  const onSubmit = () => {
    axios
      .post(
        "http://localhost:3001/lists/addmediatolist",
        {
          listid: listid,
          MediaId: props.mediaId,
        },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        console.log(response.data);
      });
  };
  const handleChange = (e) => {
    console.log(e.target.value);
    setListId(e.target.value);
  };
  const handleOk = () => {
    //event gibi bir şey gelecek
    //const formData = formikRef.current.values;
    if (listid === "0") {
      alert("select a list");
    } else {
      onSubmit();
      props.setIsModalOpen(false);
      setOpen(true);
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
        title="Basic Modal"
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Lists</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={listid}
              label="Age"
              onChange={handleChange}
            >
              {listOfLists?.map((list) => {
                return <MenuItem value={list.id}>{list.listname}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
      </Modal>
    </>
  );
}

export default AddToListModal;
