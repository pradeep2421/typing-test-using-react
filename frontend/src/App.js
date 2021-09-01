import React, { useState } from "react";

import { BrowserRouter, Route } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./LoginScreen";
import ParagraphScreen from "./screens/ParagraphScreen";
import CustomTextScreen from "./screens/CustomTextScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signout } from "./actions/userActions";
import ProfileScreen from "./screens/ProfileScreen";
function App() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  //console.log(userInfo);
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              Type Faster
            </Link>
          </div>
          <div>
            <Link to="/custom">Customerize Text</Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.userName}
                  <i className="fa fa-caret-down"></i>{" "}
                </Link>
                <ul className="dropdown-content" style={{ color: "orange" }}>
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <Link to="#signout" onClick={signoutHandler}>
                    Sign Out
                  </Link>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Signin</Link>
            )}
          </div>
        </header>
        <main>
          <Route path="/paragraph/:id" component={ParagraphScreen}></Route>
          <Route path="/" component={HomeScreen} exact></Route>
          <Route path="/profile" component={ProfileScreen}></Route>
          <Route path="/signin" component={LoginScreen}></Route>
          <Route path="/custom/" component={CustomTextScreen}></Route>
          <Route path="/register" component={RegistrationScreen}></Route>
        </main>
        <footer className="row center">All right reserved</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
