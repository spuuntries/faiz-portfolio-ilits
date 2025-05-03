require("dotenv").config();
const procenv = process.env,
  express = require("express"),
  app = express(),
  fs = require("fs"),
  morgan = require("morgan"),
  slowDown = require("express-slow-down"),
  path = require("path");

app.enable("trust proxy");
app.use(morgan("combined"));

const mainSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10,
  delayMs: 500,
});
app.use("/", mainSlowDown, express.static("static"));
app.use("/assets", express.static("assets"));

app.get("/projects", (req, res) => {
  try {
    const projects = JSON.parse(
      fs.readFileSync(path.join(__dirname, "projects.json")).toString()
    );
    res.send(projects);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    res.status(500).send("Error reading projects data");
  }
});

app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(procenv.PORT, () => {
  console.log(`${new Date()}: listening on port ${procenv.PORT}`);
});
