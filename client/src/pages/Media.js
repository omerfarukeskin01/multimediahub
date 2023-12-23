import React from "react";

function Media(props) {
  return (
    <li>
      <p>{props.MediaNametext}</p>
      <img props={props.MediaImages} />
    </li>
  );
}

export default Media;
