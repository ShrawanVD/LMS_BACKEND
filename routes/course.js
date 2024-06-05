import express from "express";
import "dotenv/config.js";
import Lesson from "../models/Courses.js";


const router = express.Router();

// checking api
router.get("/", (req, res) => {
    res.status(200).send({
      msg: "APIs are working successfully",
    });
  });

// Create a new lesson
router.post('/lessons', async (req, res) => {
  const lesson = new Lesson({
    language: req.body.language,
    level: req.body.level,
    lessonNumber: req.body.lessonNumber,
    lessonTitle: req.body.lessonTitle,
    videos: req.body.videos
  });
  
  try {
    const newLesson = await lesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all lessons
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get course by id
// router.get("/courses/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//       const course = await Course.findById(id);
//       if (!course) {
//         return res.status(404).json({ message: "Course not found" });
//       }
//       res.status(200).json(course);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

  // PUT update a lesson
router.put('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    lesson.language = req.body.language || lesson.language;
    lesson.level = req.body.level || lesson.level;
    lesson.lessonNumber = req.body.lessonNumber || lesson.lessonNumber;
    lesson.lessonTitle = req.body.lessonTitle || lesson.lessonTitle;
    lesson.videos = req.body.videos || lesson.videos;

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get the lesson and video by passing the language name
router.get('/lessons/:language', async (req, res) => {
  const { language } = req.params;

  try {
    const lessons = await Lesson.find({ language })
      .sort({ lessonNumber: 1 }) // Sort by lessonNumber in ascending order
      .select('lessonNumber lessonTitle videos'); // Select specific fields

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error });
  }
});

export default router;
