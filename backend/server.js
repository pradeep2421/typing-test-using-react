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
  database: "typing_test",
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
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const user_name = req.body.user_name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    db.query(
      "INSERT INTO user_info (first_name,last_name,email ,password,user_name) VALUES (?,?,?,?,?)",
      [first_name, last_name, email, hash, user_name],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(401).send({ message: "userName or email Already exists" });
          return;
        }

        db.query(
          "SELECT * from user_info WHERE email = ?",
          email,
          (err, result1) => {
            const userId = email;
            const token = jwt.sign({ userId }, "ourSecret", {
              expiresIn: 200,
            });
            //   console.log("correct Password");
            res.send({
              auth: true,
              token: token,
              user_id: result1[0].user_id,
              userName: result1[0].user_name,
            });
            return;
          }
        );

        //  console.log(result);
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

app.post("/details", (req, res) => {
  let user_id = req.body.userId;
  console.log(req.body);
  console.log(user_id);
  let user_info = [];
  let speeds = [];
  let accuracys = [];
  let tests = [];
  let test_time = [];

  db.query(
    "SELECT user_id,email,first_name,last_name,user_name FROM user_info WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });
      user_info = result[0];
    }
  );
  db.query(
    "SELECT * FROM user_speed WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });
      speeds = result[0];
    }
  );

  db.query(
    "SELECT * FROM user_accuracy WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });

      accuracys = result[0];
    }
  );

  db.query(
    "SELECT * FROM user_times WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });
      test_time = result[0];
    }
  );

  db.query(
    "SELECT * FROM user_tests WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });
      tests = result[0];
      res.send({
        info: user_info,
        speeds: speeds,
        accuracys: accuracys,
        tests: tests,
        test_time: test_time,
      });
    }
  );
});

app.post("/insertvalue", (req, res) => {
  //part 1
  console.log(req.body);
  let s = "abcdefghijklmnopqrstuvwxyz";

  let current_time = req.body.total_time;
  let current_total_alphabets = req.body.total_alphabets;
  let current_time_alphabets = req.body.time_alphabets;
  let user_id = req.body.user_id;

  let current_text_alphabets = req.body.text_alphabets;
  let current_input_alphabets = req.body.userinput_alphabets;
  let current_total_errors = 0;
  let average_accuracy = 0;
  let average_speed = 0;
  let current_speed = 0;
  let lowest_speed = 0;
  let highest_speed = 0;
  let previous_total_time = 0;
  let previous_total_test = 0;
  let previous_total_character = 0;
  let previous_total_errors = 0;

  let previous_character_time = [];
  let previous_character_alphabets = [];
  let previous_character_errors = [];
  let previous_character_speed = [];
  let previous_character_accuracy = [];
  for (let i = 0; i < 26; i++) {
    previous_character_accuracy[i] = 100;
    previous_character_speed[i] = 0;
    previous_character_errors[i] = 1;
    previous_character_alphabets[i] = 0;
    previous_character_time[i] = 0;
  }

  db.query(
    "SELECT * FROM user_tests WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });
      if (result.length === 0) {
        db.query(
          "INSERT INTO user_tests (user_id,total_test,total_character,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            user_id,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else console.log(result);
          }
        );
        db.query(
          "INSERT INTO user_accuracy (user_id,average,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            user_id,
            0,
            0,
            0,
            0,
            0,
            0,
            0,

            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,

            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,

            0,
            0,
            0,
            0,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else console.log(result);
          }
        );
        db.query(
          "INSERT INTO user_speed (user_id,highest,lowest,average,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            user_id,
            0,
            500,
            0,
            0,
            0,
            0,
            0,
            0,

            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,

            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else console.log(result);
          }
        );

        db.query(
          "INSERT INTO user_times (user_id,total_time,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            user_id,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else console.log(result);
          }
        );

        db.query(
          "INSERT INTO user_errors (user_id,total_errors,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            user_id,

            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else console.log(result);
          }
        );
      }
    }
  );

  //part 2 extact values
  db.query(
    "SELECT * FROM user_tests WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });

      previous_total_test = result[0].total_test + 1;
      console.log("hello" + result[0].total_test + previous_total_test);
      previous_total_character = result[0].total_character;

      previous_character_alphabets[0] = result[0].a;
      previous_character_alphabets[1] = result[0].b;
      previous_character_alphabets[2] = result[0].c;
      previous_character_alphabets[3] = result[0].d;
      previous_character_alphabets[4] = result[0].e;
      previous_character_alphabets[5] = result[0].f;

      previous_character_alphabets[6] = result[0].g;
      previous_character_alphabets[7] = result[0].h;
      previous_character_alphabets[8] = result[0].i;
      previous_character_alphabets[9] = result[0].j;
      previous_character_alphabets[10] = result[0].k;
      previous_character_alphabets[11] = result[0].l;

      previous_character_alphabets[12] = result[0].m;
      previous_character_alphabets[13] = result[0].n;
      previous_character_alphabets[14] = result[0].o;
      previous_character_alphabets[15] = result[0].p;
      previous_character_alphabets[16] = result[0].q;
      previous_character_alphabets[17] = result[0].r;

      previous_character_alphabets[18] = result[0].s;
      previous_character_alphabets[19] = result[0].t;
      previous_character_alphabets[20] = result[0].u;
      previous_character_alphabets[21] = result[0].v;
      previous_character_alphabets[22] = result[0].w;
      previous_character_alphabets[23] = result[0].x;

      previous_character_alphabets[24] = result[0].y;
      previous_character_alphabets[25] = result[0].z;

      console.log(previous_character_alphabets);
    }
  );

  db.query(
    "SELECT * FROM user_errors WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });

      previous_total_errors = result[0].total_errors;

      previous_character_errors[0] = result[0].a;
      previous_character_errors[1] = result[0].b;
      previous_character_errors[2] = result[0].c;
      previous_character_errors[3] = result[0].d;
      previous_character_errors[4] = result[0].e;
      previous_character_errors[5] = result[0].f;

      previous_character_errors[6] = result[0].g;
      previous_character_errors[7] = result[0].h;
      previous_character_errors[8] = result[0].i;
      previous_character_errors[9] = result[0].j;
      previous_character_errors[10] = result[0].k;
      previous_character_errors[11] = result[0].l;

      previous_character_errors[12] = result[0].m;
      previous_character_errors[13] = result[0].n;
      previous_character_errors[14] = result[0].o;
      previous_character_errors[15] = result[0].p;
      previous_character_errors[16] = result[0].q;
      previous_character_errors[17] = result[0].r;

      previous_character_errors[18] = result[0].s;
      previous_character_errors[19] = result[0].t;
      previous_character_errors[20] = result[0].u;
      previous_character_errors[21] = result[0].v;
      previous_character_errors[22] = result[0].w;
      previous_character_errors[23] = result[0].x;

      previous_character_errors[24] = result[0].y;
      previous_character_errors[25] = result[0].z;

      console.log(previous_character_errors);
    }
  );

  db.query(
    "SELECT * FROM user_times WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });

      previous_total_time = result[0].total_time;

      previous_character_time[0] = result[0].a;
      previous_character_time[1] = result[0].b;
      previous_character_time[2] = result[0].c;
      previous_character_time[3] = result[0].d;
      previous_character_time[4] = result[0].e;
      previous_character_time[5] = result[0].f;

      previous_character_time[6] = result[0].g;
      previous_character_time[7] = result[0].h;
      previous_character_time[8] = result[0].i;
      previous_character_time[9] = result[0].j;
      previous_character_time[10] = result[0].k;
      previous_character_time[11] = result[0].l;

      previous_character_time[12] = result[0].m;
      previous_character_time[13] = result[0].n;
      previous_character_time[14] = result[0].o;
      previous_character_time[15] = result[0].p;
      previous_character_time[16] = result[0].q;
      previous_character_time[17] = result[0].r;

      previous_character_time[18] = result[0].s;
      previous_character_time[19] = result[0].t;
      previous_character_time[20] = result[0].u;
      previous_character_time[21] = result[0].v;
      previous_character_time[22] = result[0].w;
      previous_character_time[23] = result[0].x;

      previous_character_time[24] = result[0].y;
      previous_character_time[25] = result[0].z;

      console.log(previous_character_time);
    }
  );
  db.query(
    "SELECT * FROM user_speed WHERE user_id = ?",
    user_id,
    (err, result) => {
      if (err) res.send({ err: err });
      lowest_speed = result[0].lowest;
      highest_speed = result[0].highest;

      previous_total_time = previous_total_time + current_time;
      previous_total_character =
        previous_total_character + current_total_alphabets;

      current_speed = Math.round(
        (60 * current_total_alphabets) / ((current_time + 1) * 5)
      );
      lowest_speed = Math.min(lowest_speed, current_speed);
      highest_speed = Math.max(highest_speed, current_speed);
      average_speed = Math.round(
        (60 * previous_total_character) / ((previous_total_time + 1) * 5)
      );

      for (let i = 0; i < 26; i++) {
        previous_character_time[i] =
          previous_character_time[i] + current_time_alphabets[i];
        previous_character_alphabets[i] =
          previous_character_alphabets[i] + current_input_alphabets[i];
        previous_character_errors[i] =
          previous_character_errors[i] +
          Math.abs(current_input_alphabets[i] - current_text_alphabets[i]);
        current_total_errors =
          current_total_errors +
          Math.abs(current_text_alphabets[i] - current_input_alphabets[i]);
        if (previous_character_time[i] > 0) {
          previous_character_speed[i] =
            (60 * previous_character_alphabets[i]) /
            (5 * previous_character_time[i]);
        }
        if (previous_character_alphabets[i] > 0) {
          previous_character_accuracy[i] = Math.round(
            (100 *
              (previous_character_alphabets[i] -
                previous_character_errors[i])) /
              previous_character_alphabets[i]
          );
        }
      }
      // console.log("hello");
      // console.log(previous_character_alphabets, previous_character_errors);
      // console.log("bye");
      // console.log(current_total_errors);
      console.log("bye");
      console.log(previous_total_test);

      previous_total_errors = previous_total_errors + current_total_errors;

      average_accuracy = Math.round(
        (100 * (previous_total_character - previous_total_errors)) /
          (previous_total_character + 1)
      );
      //part 3 update values of all tables
      //user_times

      db.query(
        `UPDATE user_times SET total_time =${previous_total_time} ,a=${previous_character_time[0]} ,b =${previous_character_time[1]} ,c =${previous_character_time[2]} ,d=${previous_character_time[3]} ,e=${previous_character_time[4]} ,f=${previous_character_time[5]} , g=${previous_character_time[6]} , h=${previous_character_time[7]} ,i=${previous_character_time[8]} , j=${previous_character_time[9]} , k=${previous_character_time[10]} , l=${previous_character_time[11]} ,m=${previous_character_time[12]} , n=${previous_character_time[13]} , o=${previous_character_time[14]} ,p=${previous_character_time[15]}, q=${previous_character_time[16]},r=${previous_character_time[17]},s=${previous_character_time[18]},t=${previous_character_time[19]},u=${previous_character_time[20]},v=${previous_character_time[21]},w=${previous_character_time[22]},x=${previous_character_time[23]},y=${previous_character_time[24]},z=${previous_character_time[25]} WHERE user_id = '${user_id}' `
      );
      //user_errors
      db.query(
        `UPDATE user_errors SET total_errors =${previous_total_errors} ,a=${previous_character_errors[0]} ,b =${previous_character_errors[1]} ,c =${previous_character_errors[2]} ,d=${previous_character_errors[3]} ,e=${previous_character_errors[4]} ,f=${previous_character_errors[5]} , g=${previous_character_errors[6]} , h=${previous_character_errors[7]} ,i=${previous_character_errors[8]} , j=${previous_character_errors[9]} , k=${previous_character_errors[10]} , l=${previous_character_errors[11]} ,m=${previous_character_errors[12]} , n=${previous_character_errors[13]} , o=${previous_character_errors[14]} ,p=${previous_character_errors[15]}, q=${previous_character_errors[16]},r=${previous_character_errors[17]},s=${previous_character_errors[18]},t=${previous_character_errors[19]},u=${previous_character_errors[20]},v=${previous_character_errors[21]},w=${previous_character_errors[22]},x=${previous_character_errors[23]},y=${previous_character_errors[24]},z=${previous_character_errors[25]} WHERE user_id = '${user_id}' `
      );
      //user_speed
      db.query(
        `UPDATE user_speed SET highest =${highest_speed},lowest = ${lowest_speed},average = ${average_speed} ,a=${previous_character_speed[0]} ,b =${previous_character_speed[1]} ,c =${previous_character_speed[2]} ,d=${previous_character_speed[3]} ,e=${previous_character_speed[4]} ,f=${previous_character_speed[5]} , g=${previous_character_speed[6]} , h=${previous_character_speed[7]} ,i=${previous_character_speed[8]} , j=${previous_character_speed[9]} , k=${previous_character_speed[10]} , l=${previous_character_speed[11]} ,m=${previous_character_speed[12]} , n=${previous_character_speed[13]} , o=${previous_character_speed[14]} ,p=${previous_character_speed[15]}, q=${previous_character_speed[16]},r=${previous_character_speed[17]},s=${previous_character_speed[18]},t=${previous_character_speed[19]},u=${previous_character_speed[20]},v=${previous_character_speed[21]},w=${previous_character_speed[22]},x=${previous_character_speed[23]},y=${previous_character_speed[24]},z=${previous_character_speed[25]} WHERE user_id = '${user_id}' `
      );
      //user_accuracy
      db.query(
        `UPDATE user_accuracy SET average = ${average_accuracy} ,a=${previous_character_accuracy[0]} ,b =${previous_character_accuracy[1]} ,c =${previous_character_accuracy[2]} ,d=${previous_character_accuracy[3]} ,e=${previous_character_accuracy[4]} ,f=${previous_character_accuracy[5]} , g=${previous_character_accuracy[6]} , h=${previous_character_accuracy[7]} ,i=${previous_character_accuracy[8]} , j=${previous_character_accuracy[9]} , k=${previous_character_accuracy[10]} , l=${previous_character_accuracy[11]} ,m=${previous_character_accuracy[12]} , n=${previous_character_accuracy[13]} , o=${previous_character_accuracy[14]} ,p=${previous_character_accuracy[15]}, q=${previous_character_accuracy[16]},r=${previous_character_accuracy[17]},s=${previous_character_accuracy[18]},t=${previous_character_accuracy[19]},u=${previous_character_accuracy[20]},v=${previous_character_accuracy[21]},w=${previous_character_accuracy[22]},x=${previous_character_accuracy[23]},y=${previous_character_accuracy[24]},z=${previous_character_accuracy[25]} WHERE user_id = '${user_id}' `
      );
      //user_tests
      db.query(
        `UPDATE user_tests SET total_test = ${previous_total_test} ,total_character = ${previous_total_character},a =${previous_character_alphabets[0]} ,b =${previous_character_alphabets[1]} ,c =${previous_character_alphabets[2]} ,d=${previous_character_alphabets[3]} ,e=${previous_character_alphabets[4]} ,f=${previous_character_alphabets[5]} , g=${previous_character_alphabets[6]} , h=${previous_character_alphabets[7]} ,i=${previous_character_alphabets[8]} , j=${previous_character_alphabets[9]} , k=${previous_character_alphabets[10]} , l=${previous_character_alphabets[11]} ,m=${previous_character_alphabets[12]} , n=${previous_character_alphabets[13]} , o=${previous_character_alphabets[14]} ,p=${previous_character_alphabets[15]}, q=${previous_character_alphabets[16]},r=${previous_character_alphabets[17]},s=${previous_character_alphabets[18]},t=${previous_character_alphabets[19]},u=${previous_character_alphabets[20]},v=${previous_character_alphabets[21]},w=${previous_character_alphabets[22]},x=${previous_character_alphabets[23]},y=${previous_character_alphabets[24]},z=${previous_character_alphabets[25]} WHERE user_id = '${user_id}' `
      );
    }
  );

  res.send("hello");
  // const email = req.body.email;
  // const speed = req.body.speed;
  // console.log(req.body);
  // const accuracy = req.body.accuarcy;
  // console.log(typeof speed, typeof accuarcy);
  // let aveaccuarcy = 0;
  // let avespeed = 0;
  // let numtests = 1;
  // console.log(speed, email);
  // db.query("SELECT * from speedTest WHERE email = ?", email, (err, result) => {
  //   if (err) res.send({ err: err });
  //   if (result.length == 0) {
  //     db.query(
  //       "INSERT INTO speedTest (email ,speed ,numtests ,accuarcy) VALUES (?,?,?,?)",
  //       [email, speed, numtests, accuarcy],
  //       (err, result) => {
  //         if (err) {
  //           console.log(err);
  //         } else console.log(result);
  //       }
  //     );
  //   } else {
  //     numtests = result[0].numtests + 1;
  //     avespeed = result[0].speed;
  //     aveaccuarcy = result[0].accuarcy;
  //   }
  //   avespeed = Math.round((speed + (numtests - 1) * avespeed) / numtests);
  //   aveaccuarcy = Math.round(
  //     (accuarcy + (numtests - 1) * aveaccuarcy) / numtests
  //   );
  //   db.query(
  //     `UPDATE speedTest SET speed =${avespeed} ,numtests =${numtests} ,accuarcy =${aveaccuarcy} WHERE email = '${email}' `
  //   );
  // });
});

app.post("/api/users/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * from user_info WHERE email = ? ", email, (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const userId = result[0].email;
          const token = jwt.sign({ userId }, "ourSecret", {
            expiresIn: 200,
          });
          req.session.user = result;
          res.json({
            auth: true,
            token: token,
            user_id: result[0].user_id,
            userName: result[0].user_name,
          });
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
