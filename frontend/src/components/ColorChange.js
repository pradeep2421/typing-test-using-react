import { Jumbotron } from "react-bootstrap";
import "../App.css";
function ColorChange(props) {
  const text = props.text.split("");
  let userInput = props.userInput;
  return (
    <div className="keystokes">
      <Jumbotron
        fluid
        style={{ margin: "5%", background: "white", color: "black" }}
      >
        <div style={{ margin: "10%", marginBottom: "5%" }}>
          {text.map((s, i) => {
            let color;
            if (i < userInput.length - 1 && userInput[i] === s) {
              color = "green";
            } else if (i < userInput.length && userInput[i] !== s) {
              color = "red";
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

export default ColorChange;
