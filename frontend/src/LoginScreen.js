import React, { useEffect, useState } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import "./App.css";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "./actions/userActions";
import Loading from "./components/Loading";
import MessageBox from "./components/MessageBox";

function LoginScreen(props) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };
  useEffect(() => {
    if (userInfo && userInfo.email) {
      props.history.push(redirect);
    }
  }, [userInfo]);
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          {loading && <Loading></Loading>}
          {error && <MessageBox>{error}</MessageBox>}
          <Form>
            <Row>
              <Form.Group as={Row} controlId="formEmail">
                <h1 style={{ display: "block" }}>Login</h1>
                <Form.Label column sm={2}>
                  Email
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="email"
                    placeholder="tryit@gmail.com"
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
            </Row>
            <Form.Group as={Row} controlId="formPassword">
              <Form.Label column sm={2}>
                Password
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="password"
                  placeholder="password"
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                />
              </Col>
            </Form.Group>
            <Button variant="success" type="button" onClick={submitHandler}>
              Signin
            </Button>
            New User?{" "}
            <Link to={`/register?redirect=${redirect}`}>
              Create Your Register
            </Link>
          </Form>
        </Container>
      </header>
    </div>
  );
}

export default LoginScreen;
