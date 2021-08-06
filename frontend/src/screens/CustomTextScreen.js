import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import CustomText from "../CustomText";

import ShowText from "../components/ShowText";
function CustomTextScreen(props) {
  let finalEmail = "";

  const [text, settext] = useState("Hello");

  return (
    <div className="App">
      <Link to="/">Back To Home</Link>
      <CustomText changeText={settext}></CustomText>
      <ShowText text={text} finalEmail={finalEmail}></ShowText>
    </div>
  );
}

export default CustomTextScreen;
