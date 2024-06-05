import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const LessonSchema = new Schema({
  language: { type: String, required: true },
  level: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  lessonTitle: { type: String, required: true },
  videos: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true }
    }
  ]
});
  
//   const Course = mongoose.model("Course", CourseSchema);
export default model("Course", LessonSchema);
