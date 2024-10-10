const express = require("express");

const {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getDetailsCoursesByID,
} = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getDetailsCoursesByID);
router.put("/update/:id", updateCourseByID);

module.exports = router;
