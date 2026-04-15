

const express = require("express");
const router = express.Router();
const User = require("../../Models/users"); 

//add a new task
router.post("/register", async (req, res) => {
  const { fullname, role, email, password } = req.body;

  try {
    const existingemail = await User.findOne({ email });
    if (existingemail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ fullname, role, email, password });
    await user.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    //check if user has registered
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
       console.log(`user: ${user.fullname}, ${user.role}, Welcome `);


   return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        role: user.role,
        email: user.email
      }
    })


  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
