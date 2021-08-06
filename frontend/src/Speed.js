import React from "react";

function Speed(props) {
  if (props.symbols !== 0 && props.seconds !== 0) {
    const wpm = props.symbols / 5 / (props.seconds / 60);
    const roundwpm = Math.round(wpm);
    return <div>SPEED : {roundwpm} wpm </div>;
  }
  return null;
}
export default Speed;
