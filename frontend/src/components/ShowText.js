import React, { useEffect, useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Speed from "../Speed";

import Axios from "axios";

import Text from "../Text";
function ShowText(props) {
  let intervalId = useRef(null);

  let finalEmail = props.finalEmail;

  const [text, settext] = useState(props.text);
  const [userInput, setuserInput] = useState("");

  const [typekeys, setTypekeys] = useState(0);

  const [symbols, setsymbols] = useState(0);
  const [seconds, setseconds] = useState(0);

  const [start, setstart] = useState(false);
  const [end, setend] = useState(true);
  const [prev, setprev] = useState(0);

  function countlength(cur) {
    const text1 = text.replace(" ", "");

    return cur
      .replace(" ", "")
      .split("")
      .filter((s, i) => s === text1[i]).length;
  }

  const handleuser = (e) => {
    const temp = e.target.value;
    setTypekeys((typekeys) => typekeys + 1);
    onselectstart();
    onselectend(temp);
    setuserInput(temp);
    const symlength = countlength(temp);
    setsymbols(symlength);
  };

  function resetUser() {
    setTypekeys(0);
    setsymbols(0);
    setseconds(0);
    setend(false);
    setstart(false);
    setuserInput("");
  }
  function onselectend(cur) {
    if (text === cur) {
      let accuracy = Math.round(
        (symbols / (typekeys - (typekeys - symbols) / 2)) * 100
      );
      console.log(accuracy, symbols, typekeys);
      if (symbols && finalEmail !== "") {
        Axios.defaults.withCredentials = true;

        Axios.post("http://localhost:5000/insertvalue", {
          email: finalEmail,
          speed: Math.round(symbols / 5 / (seconds / 60)) + 1,
          accuarcy: accuracy,
        }).then((response) => {
          console.log(response);
        });
      }
      setend(true);
      setstart(false);
      setTypekeys(0);
      setprev(Math.round(symbols / 5 / (seconds / 60)) + 1);
      setsymbols(0);
      setseconds(0);
      clearInterval(intervalId.current);
    }
  }
  function onselectstart() {
    if (!start) {
      setstart(true);
      intervalId.current = setInterval(() => {
        setseconds((seconds) => seconds + 0.1);
      }, 100);
    }
  }
  useEffect(() => {
    setend(true);
    settext(props.text);
  }, [props.text]);
  return (
    <div>
      <Container className="paragraph">
        <div>{prev > 0 && <div>Average Speed :{prev} WPM</div>}</div>
        <Text text={text} userInput={userInput}></Text>
        <textarea
          value={userInput}
          className="textarea"
          placeholder="typing area"
          onChange={handleuser}
          readOnly={end}
          autoFocus={true}
        ></textarea>
        <div className="speed">
          <div style={{ marginRight: 20, color: "red" }}>
            <Speed symbols={symbols} seconds={seconds}></Speed>
            <h1>{symbols} </h1>
            <h1>{Math.round(seconds)}</h1>
          </div>
          <Button
            type="button"
            onClick={() => {
              console.log("bright day");
              resetUser();
            }}
          >
            Reset
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ShowText;
