import React from "react";
import { Jumbotron } from "react-bootstrap";
import "./App.css";
function Text(props) {
  const text = props.text.split("");
  const userInput = props.userInput;

  return (
    <div className="keystokes">
      <Jumbotron
        fluid
        style={{ margin: "5%", background: "white", color: "black" }}
      >
        <div style={{ margin: "10%", marginBottom: "5%" }}>
          {text.map((s, i) => {
            let color;
            if (i < userInput.length) {
              color = s === userInput[i] ? "green" : "red";
            }
            return (
              <span key={i} style={{ backgroundColor: color }}>
                {s}
              </span>
            );
          })}
        </div>
      </Jumbotron>
    </div>
  );
}

export default Text;
