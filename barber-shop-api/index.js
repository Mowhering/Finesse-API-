const { DataSource } = require("typeorm");
const jwt = require("jsonwebtoken");

const express = require("express");
const {
  RegisterUser,
  Login,
  SchedulePost,
  ScheduleGet,
  UpdateUser,
} = require("./services/barber-shop.service");
require("dotenv").config();

const dataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234@",
  database: "barber",
  entities: ["./entities/*.js"],
  logging: true,
  synchronize: true,
});

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

function authenticate(req, res, next) {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const app = express();
app.use(express.json());

app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  return Login(email, password, response, dataSource);
});

app.post("/register-user", (request, response) => {
  const { name, password, email, phone } = request.body;
  return RegisterUser(name, password, email, phone, response, dataSource);
});

app.post("/update-user", (request, response) => {
  const { name, password, email, phone } = request.body;
  return UpdateUser(name, password, email, phone, response, dataSource);
});

app.get("/schedules", authenticate, async (_, response) => {
  const ret = await ScheduleGet(dataSource);
  return response.send(ret);
});

app.post("/schedules", authenticate, (request, response) => {
  const { name, time, service } = request.body;
  return SchedulePost(name, time, service, response, dataSource);
});

app.listen(process.env.PORT, () => {
  console.log(`Server has been started on port ${process.env.PORT}`);
});
