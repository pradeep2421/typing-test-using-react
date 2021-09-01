import React, { useEffect, useState } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import "../App.css";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../actions/userActions";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { register } from "../actions/userActions";

function RegistrationScreen(props) {
  const [error1, setError1] = useState(null);
  const [userName, setUserName] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setemail] = useState("prad@kfjfkdj");
  const [password, setpassword] = useState("2323fdf");
  const [confirm_password, setconfirmpassword] = useState("2323fdf");
  // const [name, setname] = useState("") ;

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;
  const dispatch = useDispatch();
  const registerHandler = (e) => {
    e.preventDefault();
    if (confirm_password === password) {
      dispatch(register(userName, first_name, last_name, email, password));
      setError1(null);
    } else {
      setError1("password doesn't match");
    }
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [userInfo]);
  return (
    <div className="App">
      <header className="App-header">
        {loading && <Loading></Loading>}
        {error && <MessageBox>{error}</MessageBox>}
        {error1 && <MessageBox>{error1}</MessageBox>}
        <Container>
          <h1>Registration</h1>
          <Form>
            <Row>
              <Form.Group as={Row} controlId="formuserName">
                <Form.Label column sm={2}>
                  userName
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    placeholder="abcd12"
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Row} controlId="formFirstName">
                <Form.Label column sm={2}>
                  First Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    placeholder="abccd"
                    onChange={(e) => {
                      setFirst_name(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Row} controlId="formLastName">
                <Form.Label column sm={2}>
                  Last Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    placeholder="abcd"
                    onChange={(e) => {
                      setLast_name(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Row} controlId="formEmail">
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
            <Row>
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
            </Row>

            <Row>
              <Form.Group as={Row} controlId="formConfirmPassword">
                <Form.Label column sm={2}>
                  Confirm Password
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="password"
                    placeholder="confirm password"
                    onChange={(e) => {
                      setconfirmpassword(e.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
            </Row>

            <Button variant="success" type="submit" onClick={registerHandler}>
              submit
            </Button>
            <div>
              Already have an account?{" "}
              <Link to={`/signin?redirect=${redirect}`}>Sign in</Link>
            </div>
          </Form>
        </Container>
      </header>
    </div>
  );
}

export default RegistrationScreen;
