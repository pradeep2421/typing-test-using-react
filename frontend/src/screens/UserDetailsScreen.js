import React, { useState } from "react";
import OtherUsers from "../components/OtherUsers";
import UserAccuracy from "../components/UserAccuracy";
import UserSpeed from "../components/UserSpeed";
import UserTimes from "../components/UserTimes";
import UserTyped from "../components/UserTyped";

const UserDetailsScreen = (props) => {
  const user = props.user;
  const given_test = user && user.speeds ? true : false;

  return (
    <div>
      <h1>User Details</h1>
      <div>user name -{user.info.user_name}</div>
      <div>first name -{user.info.first_name}</div>
      <div>last name -{user.info.last_name}</div>
      <div>email -{user.info.email}</div>
      <br />
      <br />

      {given_test ? (
        <div>
          <UserSpeed speed={user.speeds}></UserSpeed>
          <UserTyped characterTyped={user.tests}></UserTyped>
          <UserTimes testTimes={user.test_time}></UserTimes>
          <UserAccuracy testAccuracy={user.accuracys}></UserAccuracy>
          <OtherUsers otherUsers={user.other_users}></OtherUsers>
        </div>
      ) : (
        <div>
          <h1>No Test Given</h1>
        </div>
      )}
    </div>
  );
};

export default UserDetailsScreen;
