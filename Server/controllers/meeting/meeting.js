const Meetings = require("../../model/schema/meeting");
const mongoose = require("mongoose");

const add = async (req, res) => {
  try {
    console.log(req.user);
    const { agenda, dateTime, related, location, notes } = req.body;
    const createBy = req.user._id;

    if (!createBy) {
      return res.status(400).json({ message: "User  ID is required." });
    }
    const meeting = new Meetings({
      agenda,
      dateTime,
      related,
      location,
      notes,
      createBy,
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

const index = async (req, res) => {
  try {
    const meetings = await Meetings.find({ deleted: false })
      .populate("createBy")
      .populate("attendes")
      .populate("attendesLead");
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

const view = async (req, res) => {
  try {
    console.log("Fetching meeting with ID:", req.params.id); // Log the ID
    const meeting = await Meetings.findById(req.params.id)
      .populate("createBy")
      .populate("attendes")
      .populate("attendesLead");

    if (!meeting || meeting.deleted) {
      console.log("Meeting not found or deleted:", meeting); // Log the meeting
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error fetching meeting:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

const deleteData = async (req, res) => {
  try {
    const meeting = await Meetings.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.deleted = true;
    await meeting.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input: ids must be a non-empty array." });
    }

    // Check if all IDs are valid ObjectId
    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res
        .status(400)
        .json({ message: "Invalid input: one or more IDs are not valid." });
    }

    // Update many documents
    const result = await Meetings.updateMany(
      { _id: { $in: ids } },
      { deleted: true }
    );

    // Check if any documents were modified
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No meetings found to delete." });
    }

    // Return success response
    res.status(200).json({
      message: "Meetings successfully marked as deleted.",
      deletedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error in deleteMany:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
