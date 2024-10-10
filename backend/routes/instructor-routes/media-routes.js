const express = require("express");

const multer = require("multer");

const {
  uploadMediaToCloudinary,
  deleteMEdiaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();
const upload = multer({ dest: "upload/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploadling file",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest id is required",
      });
    }

    await deleteMEdiaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Assest deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error delete",
    });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    log;
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );
    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    res.status(500).json({
      success: false,
      message: "Error in bulk upload file",
    });
  }
});

module.exports = router;
