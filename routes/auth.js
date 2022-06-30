const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {

  let userCheck = await User.findOne({email: req.body.email});

  if(userCheck) {
    res.status(400).send("Email already exists!");
  } else {
    const newUser = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET
      ).toString(),
    });

    try {
      const savedUser = await newUser.save();

      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // !user && res.status(404).json("Wrong Credentials");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // originalPassword !== req.body.password &&
    //   res.status(404).json("Wrong Credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true
    // }).status(200).json({...others});

    res.status(200).json({...others, accessToken});
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
