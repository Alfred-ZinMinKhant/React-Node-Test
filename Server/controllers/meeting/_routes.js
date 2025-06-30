const express = require("express");
const router = express.Router();
const meeting = require("./meeting");
const auth = require("../../middelwares/auth");

// Define routes
router.post("/", auth, meeting.add);
router.get("/", auth, meeting.index);
router.get("/view/:id", auth, meeting.view);
router.delete("/delete/:id", auth, meeting.deleteData);
router.post("/deleteMany", auth, meeting.deleteMany);

module.exports = router;
