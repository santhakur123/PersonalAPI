const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Profile = require("./models/Profile");

const app = express();
app.use(express.json());
app.use(cors());

const dbURL=process.env.MONGO_URI;
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


const EnterProfile = async () => {
  const exist = await Profile.findOne();
  if (!exist) {
    const profile = new Profile({
      name: "Harsh Thakur",
      email: "hsthakur644@gmail.com",
      education: "B.Tech in Electronics and Communication Engineering, IIIT Kalyani (2022-2026)",
      skills: [
        "Java", "Spring Boot", "Spring REST", "Spring Data", "Spring Security", "Spring Reactive",
        "Node.js", "Express.js", "React.js", "Redux", "MongoDB", "MySQL",
        "HTML", "CSS", "JavaScript", "Python",
        "Java Swing", "OOP", "MVC Design", "DSA", "Algorithm Analysis", "Git", "Maven", "Gradle"
      ],
      projects: [
        {
          title: "Hunter2Lost  Travel Website",
          description: "Full-stack travel platform with Google Maps API integration for route planning and geocoding.",
          links: [
            "https://travel-website-j1gr.onrender.com/listings",
            "https://github.com/santhakur123/"
          ]
        },
        {
          title: "Stock  Investment Dashboard Platform",
          description: "MERN stack dashboard with secure authentication, dynamic Chart.js visualizations, and real-time data.",
          links: [
            "https://stock-3-0x3g.onrender.com",
            "https://github.com/santhakur123/stock-dashboard"
          ]
        },
        {
          title: "YE-SUN  E-Commerce Platform",
          description: "React + Redux + Stripe API based e-commerce site with secure payments and session persistence.",
          links: [
            "https://e-commerceapp-mz2y.onrender.com",
            "https://github.com/santhakur123/ye-sun-ecommerce"
          ]
        },
        {
          title: "Student Tracker API (In Progress)",
          description: "Spring Boot + MySQL API with JWT-based authentication for managing student performance data.",
          links: ["https://github.com/santhakur123/student-tracker"]
        },
        {
          title: "Flappy Bird Java Desktop Game",
          description: "Java Swing desktop game implementing game loop, collision detection, animations, and score tracking.",
          links: ["https://github.com/santhakur123/Flappy_bird_game"]
        }
      ],
      work: [
        "Software Development Intern (Offer) NULLCLASS (MERN stack-based development internship)"
      ],
      links: {
        github: "https://github.com/santhakur123",
        linkedin: "https://linkedin.com/in/harsh-thakur",  
           
        leetcode: "https://leetcode.com/u/santhaur/"
      }
    });

    await profile.save();
    console.log("Profile Enter ");
  }
};
EnterProfile();



app.get("/health", (req, res) => res.status(200).send("OK"));

app.get("/profile", async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile);
});

app.post("/profile", async (req, res) => {
  const profile = new Profile(req.body);
  await profile.save();
  res.json(profile);
});

app.put("/profile", async (req, res) => {
  const profile = await Profile.findOneAndUpdate({}, req.body, { new: true });
  res.json(profile);
});


app.get("/projects", async (req, res) => {
  const { skill } = req.query;
  const profile = await Profile.findOne();
  if (!skill) return res.json(profile.projects);
  const filtered = profile.projects.filter(p =>
    profile.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  );
  res.json(filtered);
});

app.get("/skills/top", async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile.skills.slice(0, 3));
});


app.get("/search", async (req, res) => {
  const { q } = req.query;
  const profile = await Profile.findOne();
  const results = {
    skills: profile.skills.filter(s => s.toLowerCase().includes(q.toLowerCase())),
    projects: profile.projects.filter(p => p.title.toLowerCase().includes(q.toLowerCase()))
  };
  res.json(results);
});


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
