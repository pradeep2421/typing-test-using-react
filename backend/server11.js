const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const { data } = require("./data");

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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dr@carys2306",
  database: "trial",
});

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
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.get("/api/paragraphs", (req, res) => {
  res.send(data.paragraphs);
});
app.post("/register", (req, res) => {
  const email = req.body.emailone;
  const password = req.body.passwordone;
  console.log(password);
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    db.query(
      "INSERT INTO users (email ,password) VALUES (?,?)",
      [email, hash],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
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
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggerStatus: true, user: req.session.user });
  } else {
    res.send({ loggerStatus: false });
  }
});

app.post("/login", (req, res) => {
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
          res.json({ auth: true, token: token, result: result });
        } else {
          res.json({ auth: false, token: token, message: "wrong password" });
        }
      });
    } else {
      res.json({ auth: false, token: token, message: "no user exists" });
    }
  });
});

app.listen("5000", () => {
  console.log("server is running .... on port 5000");
});
