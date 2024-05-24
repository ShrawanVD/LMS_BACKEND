import express from "express";
import "dotenv/config.js";
import Course from "../models/Courses.js";


const router = express.Router();

// checking api
router.get("/", (req, res) => {
    res.status(200).send({
      msg: "APIs are working successfully",
    });
  });

// Create a new course
router.post("/courses", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get course by id
router.get("/courses/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
