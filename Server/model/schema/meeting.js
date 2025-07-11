const mongoose = require("mongoose");

const meetingHistory = new mongoose.Schema({
  agenda: { type: String, required: true },
  attendes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contacts",
    },
  ],
  attendesLead: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leads",
    },
  ],
  location: String,
  related: String,
  dateTime: String,
  notes: String,
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Meetings", meetingHistory, "Meetings");
