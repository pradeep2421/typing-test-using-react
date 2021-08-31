const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const { data } = require("./data");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

//JWT
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "email",
    secret: "tryharder",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

//create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dr@carys2306",
  database: "trial",
});

//connect
db.connect((err) => {
  if (err) {
    console.log("there is some error");
  }
  console.log("MySql connected....");
});

app.get("/api/paragraph/:id", (req, res) => {
  const paragraph = data.paragraphs.find((x) => x._id === req.params.id);
  if (paragraph) {
    res.send(paragraph);
  } else {
    console.log(paragraph);
    res.status(404).send({ message: "Paragraph Not Found" });
  }
});
app.get("/api/paragraphs", (req, res) => {
  res.send(data.paragraphs);
});

//Registration
app.post("/api/users/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(password);
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    db.query(
      "INSERT INTO users (email ,password) VALUES (?,?)",
      [email, hash],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(401).send({ message: "userName Already exists" });
          return;
        }
        console.log(result);
        const userId = email;
        const token = jwt.sign({ userId }, "ourSecret", {
          expiresIn: 200,
        });
        req.session.user = result;
        console.log(req.session.user);
        console.log("correct Password");
        res.send({ auth: true, token: token, email: email });
        return;
      }
    );
  });
});
//authenticate
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("You don't have any token");
  } else {
    jwt.verify(token, "ourSecret", (err, decoded) => {
      if (err) {
        res.json({
          auth: false,
          message: "you are not allowed to get the information!",
        });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
};

app.get("/isauth", verifyJWT, (req, res) => {
  res.send("You will get everything you ask!");
});

//login
app.get("/api/users/signin", (req, res) => {
  if (req.session.user) {
    res.send({ loggerStatus: true, user: req.session.user });
  } else {
    res.send({ loggerStatus: false });
  }
});
app.get("/details", (req, res) => {
  console.log("welcome");
  res.send({ name: "name", email: "apgpd@gma" });
});
app.post("/insertvalue", (req, res) => {
  const email = req.body.email;
  const speed = req.body.speed;
  console.log(req.body);
  const accuarcy = req.body.accuarcy;
  console.log(typeof speed, typeof accuarcy);
  let aveaccuarcy = 0;
  let avespeed = 0;
  let numtests = 1;
  console.log(speed, email);
  db.query("SELECT * from speedTest WHERE email = ?", email, (err, result) => {
    if (err) res.send({ err: err });
    if (result.length == 0) {
      db.query(
        "INSERT INTO speedTest (email ,speed ,numtests ,accuarcy) VALUES (?,?,?,?)",
        [email, speed, numtests, accuarcy],
        (err, result) => {
          if (err) {
            console.log(err);
          } else console.log(result);
        }
      );
    } else {
      numtests = result[0].numtests + 1;
      avespeed = result[0].speed;
      aveaccuarcy = result[0].accuarcy;
    }
    avespeed = Math.round((speed + (numtests - 1) * avespeed) / numtests);
    aveaccuarcy = Math.round(
      (accuarcy + (numtests - 1) * aveaccuarcy) / numtests
    );
    db.query(
      `UPDATE speedTest SET speed =${avespeed} ,numtests =${numtests} ,accuarcy =${aveaccuarcy} WHERE email = '${email}' `
    );
  });
});
app.post("/api/users/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * from users WHERE email = ?", email, (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const userId = result[0].email;
          const token = jwt.sign({ userId }, "ourSecret", {
            expiresIn: 200,
          });
          req.session.user = result;
          console.log(req.session.user);
          console.log("correct Password");
          res.json({ auth: true, token: token, email: result[0].email });
          return;
        } else {
          res.status(401).send({ message: "wrong password" });
        }
      });
    } else {
      res.status(401).send({ message: "no user Exists" });
    }
  });
});

//select

app.listen("5000", () => {
  console.log("server is running .... on port 5000");
});
