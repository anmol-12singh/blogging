const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000; // when we will deploy this app then it may be possible that port 8000 is not available on someone else's cloud so to tackle with it we will learn to use .env
mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then((e) => console.log("Mongodb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser);
app.use(checkForAuthenticationCookie("token")); //our middleware

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});
app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is started at PORT:${PORT}`);
});
