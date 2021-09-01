import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser } from "../actions/userActions";
import Loading from "../components/Loading";

import MessageBox from "../components/MessageBox";
import UserDetailsScreen from "./UserDetailsScreen";

export default function ProfileScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  // const [user_info, setUserInfo] = useState([]);
  // const [user_speed, setUserSpeed] = useState([]);
  // const [user_accuracy, setUserAccuracy] = useState([]);
  // const [user_test, setUserTest] = useState([]);
  // const [user_time, setUserTime] = useState([]);
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error } = userDetails;
  console.log(userDetails);
  console.log(user);
  console.log(loading);
  console.log(error);
  // if (user) {
  //   setUserInfo(user.info);
  //   setUserSpeed(user.speeds);
  //   setUserAccuracy(user.accuracys);
  //   setUserTest(user.tests);
  //   setUserTime(user.test_time);
  // }
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo) dispatch(detailsUser(userInfo.user_id));
    else {
      props.history.push(redirect);
    }
  }, [userInfo]);

  return (
    <div>
      {loading && <Loading></Loading>}
      {user && <UserDetailsScreen user={user}></UserDetailsScreen>}
    </div>
  );
}
