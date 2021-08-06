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
  const [email, setemail] = useState("prad@kfjfkdj");
  const [password, setpassword] = useState("2323fdf");
  // const [name, setname] = useState("") ;

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;
  const dispatch = useDispatch();
  const registerHandler = (e) => {
    e.preventDefault();
    dispatch(register(email, password));
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
        <Container>
          <Form>
            <Row>
              <Form.Group as={Row} controlId="formEmail">
                <h1>Registration</h1>
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
