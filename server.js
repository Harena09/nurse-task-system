require('dotenv').config();
const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");


//routes
const authRoutes = require("./backend/routes/userauthRoutes");
const taskRoutes = require("./backend/routes/taskRoutes");
const patientRoutes = require("./backend/routes/patientRoutes");
const handoverRoutes = require("./backend/routes/handoverRoutes");
const moodTrackerRoutes = require("./backend/routes/moodtrackerRoutes");
const aiAssistantRoutes = require("./backend/routes/aiAssistantRoutes");
const profileRoutes = require("./backend/routes/profileRoutes");


const app = express();//for the backend
//middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public", "front-end")));


app.get("/tasks.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "front-end", "html", "tasks.html"));
});




// connect to mongo db 

//mongoose.connect('mongodb://localhost:27017/Database1')
 //   .then(() => {
 //       console.log('Connected to MongoDB');
 //   })
//    .catch((error) => {
  //      console.error('Error connecting to MongoDB:', error);
  //  });
 

const isProduction = process.env.NODE_ENV === "production";

const mongoURL = isProduction
  ? process.env.MONGO_URI
  : process.env.MONGO_LOCAL;

if (!mongoURL) {
  console.error("MongoDB connection string is missing!");
  process.exit(1);
}

mongoose.connect(mongoURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err));   
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);



app.use("/api/patients", patientRoutes);
app.use("/api/handover", handoverRoutes);
app.use("/api/moods", moodTrackerRoutes);
app.use("/api/ai", aiAssistantRoutes);
app.use("/api/profile", profileRoutes);



//default route for backend testing
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "public", "front-end", "html", "register.html"));
   // res.send("Hello! The backend is working!")
  //  console.log("working ka");

});




//default page error handler
app.use((req, res) => {
    res.status(404).send("404 Page Not Found")
    console.log("tsy mande avao");
});


//starting the server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
})


//load all models
require('./Models/users');
require('./Models/patients');
require('./Models/task');
require('./Models/handover');
require('./Models/Moodlog');
