require("dotenv").config()
const procenv = process.env,
  express = require("express"),
  app = express(),
  fs = require("fs"),
  morgan = require("morgan"),
  slowDown = require("express-slow-down");

app.enable("trust proxy");
app.use(morgan("combined"));

const mainSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10,
  delayMs: 500,
});
app.use("/", mainSlowDown, express.static("static"));
app.use("/assets", express.static("static"));

app.get("/projects", (req, res) => {
  res.json(JSON.parse(fs.readFileSync("projects.json").toString()));
});

app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(procenv.PORT, () => {
  console.log(`${new Date()}: listening on port ${procenv.PORT}`);
});
