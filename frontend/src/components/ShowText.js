import React, { useEffect, useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Speed from "../Speed";

import Axios from "axios";

import Text from "../Text";
import { useDispatch, useSelector } from "react-redux";
function ShowText(props) {
  let intervalId = useRef(null);

  const [text, settext] = useState(props.text);
  const [userInput, setuserInput] = useState("");
  const [previouslength, setPreviouslength] = useState(0);

  const [symbols, setsymbols] = useState(0);
  const [seconds, setseconds] = useState(0);
  const [previous_time, setPreviousTime] = useState(-0.15);
  const [start, setstart] = useState(false);
  const [end, setend] = useState(true);
  const [prev, setprev] = useState(0);
  let temp = [];
  for (let i = 0; i < 26; i++) temp[i] = 0;
  const [userinput_alphabets, setUserinput_alphabets] = useState(temp);
  const [speed_alphabets, setSpeed_alphabets] = useState(temp);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  function countlength(cur) {
    const text1 = text.replace(" ", "");

    return cur
      .replace(" ", "")
      .split("")
      .filter((s, i) => s === text1[i]).length;
  }

  function getIndex(current_index) {
    let alphabets = "abcdefghijklmnopqrstuvwxyz";
    let upper_alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < 26; i++) {
      if (alphabets[i] === current_index) return i;
    }
    for (let i = 0; i < 26; i++) {
      if (upper_alphabets[i] === current_index) return i;
    }
    return -1;
  }

  function alphabetSpeed(previous_time, current_text) {
    let last_index = current_text.length - 1;

    if (last_index > -1) {
      let current_alphabet = getIndex(current_text[last_index]);
      if (current_alphabet === -1) return;

      let current_speed =
        previous_time !== seconds
          ? Math.round(60 / (5 * (seconds - previous_time)))
          : 100;
      current_speed = current_speed + speed_alphabets[current_alphabet];
      setSpeed_alphabets([
        ...speed_alphabets.slice(0, current_alphabet),
        current_speed,
        ...speed_alphabets.slice(current_alphabet + 1),
      ]);
    }
  }

  function alphabetAccuracy(current_text) {
    let last_index = current_text.length - 1;
    if (last_index < 0) return;
    let current_alphabet = getIndex(current_text[last_index]);

    if (current_alphabet >= 0) {
      let current_frequency = userinput_alphabets[current_alphabet] + 1;

      setUserinput_alphabets([
        ...userinput_alphabets.slice(0, current_alphabet),
        current_frequency,
        ...userinput_alphabets.slice(current_alphabet + 1),
      ]);
    }
  }

  const handleuser = (e) => {
    const current_text = e.target.value;
    onselectstart();

    if (previouslength < current_text.length) {
      alphabetSpeed(previous_time, current_text);
      alphabetAccuracy(current_text);
    }

    setPreviousTime(seconds);
    setPreviouslength(current_text.length);

    onselectend(current_text);
    setuserInput(current_text);

    const symlength = countlength(current_text);
    setsymbols(symlength);
  };

  function resetUser() {
    setsymbols(0);
    setseconds(0);
    setend(false);
    setstart(false);
    setuserInput("");
  }

  function calculateAccuracy(text, cur) {
    let total = text.length;
    let correct = 0;
    let accuracy = Math.round((correct / total) * 100);

    return accuracy;
  }

  function onselectend(cur) {
    if (text.length === cur.length) {
      let accuracy = calculateAccuracy(text, cur);
      let average_speed = Math.round(text.length / 5 / (seconds / 60)) + 1;
      let temp = [];
      for (let i = 0; i < 26; i++) temp[i] = 0;
      for (let i = 0; i < text.length; i++) {
        let current_index = getIndex(text[i]);

        if (current_index > -1) {
          temp[current_index]++;
        }
      }

      if (symbols && userInfo) {
        Axios.defaults.withCredentials = true;

        Axios.post("http://localhost:5000/insertvalue", {
          email: userInfo.email,
          speed: average_speed,
          accuracy: accuracy,
          speed_alphabets: speed_alphabets,
          errors_alphabet: temp,
          userinput_alphabets: userinput_alphabets,
        }).then((response) => {
          console.log(response);
        });
      }
      setend(true);
      setstart(false);
      temp = [];
      for (let i = 0; i < 26; i++) temp[i] = 0;
      setSpeed_alphabets(temp);
      setUserinput_alphabets(temp);
      setprev(Math.round(average_speed));
      setsymbols(0);
      setseconds(0);
      clearInterval(intervalId.current);
      setPreviouslength(0);
      setPreviousTime(-0.15);
    }
  }
  function onselectstart() {
    if (!start) {
      setstart(true);
      intervalId.current = setInterval(() => {
        setseconds((seconds) => seconds + 0.01);
      }, 10);
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
