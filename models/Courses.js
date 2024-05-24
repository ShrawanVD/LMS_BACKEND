import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const ModuleSchema = new Schema({
    title: String,
    content: String,
  });
  
  const ChapterSchema = new Schema({
    title: String,
    modules: [ModuleSchema],
  });
  
  const CourseSchema = new Schema({
    title: String,
    thumbnail: String,
    duration: String,
    chapters: [ChapterSchema],
  });
  
//   const Course = mongoose.model("Course", CourseSchema);
export default model("Course", CourseSchema);
