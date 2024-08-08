const { Router } = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { createTokenForUser } = require("../services/authentication");

const router = Router();

router.get("/signIn", (req, res) => {
  return res.render("signIn");
});

router.get("/signUp", (req, res) => {
  return res.render("signUp");
});

router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  //const user = await User.matchPassword(email,password);

  //console.log('User',user);
  //return res.redirect("/");
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Wrong Credentials");
    }
    const token = createTokenForUser(user);
    console.log(token);
    //return token;
    //return res.status(200).send("User signedIn successfullly");
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    //console.error(err);
    return res.render("signIn", {
      error: "Invalid credentials",
    });
    //return res.status(500).send("Error signing In");
  }
});

//app.use(express.urlencoded({extended:false}));

router.post("/signUp", async (req, res) => {
  const { fullName, email, password } = req.body; //frontend se milega isliye req.body
  // await User.create({
  //     fullName,
  //     email,
  //     password,
  // })

  // return res.redirect('/'); //redirect to homepage
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    //res.status(201).send('User registered successfully');
    return res.redirect("/");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error registering user");
  }
});

module.exports = router;
