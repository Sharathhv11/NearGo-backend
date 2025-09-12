import {mongoose} from "mongoose";

const relationshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "blocked"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default  mongoose.model("Relationship", relationshipSchema);
