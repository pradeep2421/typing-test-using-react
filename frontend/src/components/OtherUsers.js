import React from "react";

const OtherUsers = (props) => {
  let otherUsers = props.otherUsers;
  return (
    <div>
      <h1>Comparison With Other Users</h1>
      <div>Lowest Speed is Faster Than {otherUsers[0]}% Users</div>
      <div>Average Speed is Faster Than {otherUsers[1]}% Users</div>
      <div>Highest Speed is Faster Than {otherUsers[2]}% Users</div>
      <div>Accuracy is Faster Than {otherUsers[3]}% Users</div>
    </div>
  );
};

export default OtherUsers;
