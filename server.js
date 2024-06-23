const express = require("express");
const session = require("express-session");
const cors = require("cors");
const redis = require("redis");
const connectRedis = require("connect-redis").default;
const bodyParser = require("body-parser");
const sequalize = require("./config/dbConnection");
const userRouter = require("./api/routes/user");
const PORT = 3000;

const app = express();

// Sync with SQL DB
sequalize
  .sync({ force: false })
  .then(() => {
    console.log("Tables synced");
  })
  .catch((err) => {
    console.log("Unable to sync tables...", err);
  });

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "redis-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 10, // session max age in miliseconds
    },
  })
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routers
app.use("/users", userRouter);

app.use((req, res, next) => {
  const err = new Error();
  err.message = "Not found";
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

// nodeRedisDemo();
app.listen(PORT);
