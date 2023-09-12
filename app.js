const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const router = require("./router/index.js");
const config = require("config");
const PORT = config.get("port") ?? 8080;
const cheerio = require("cheerio");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);



const start = () => {
  if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.resolve(__dirname, "client")));
  
    const indexPath = path.join(__dirname, "client", "index.html");
  
    app.get("*", (req, res) => {
      console.log("+")
      res.sendFile(indexPath);
    });
  } else {
    app.use(express.static(path.resolve(__dirname, "static")));
  }
  app.listen(PORT, () => {
    console.log(`Server has been started at port ${PORT}`);
  });
};

start();
