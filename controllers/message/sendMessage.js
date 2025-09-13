import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import Message from "../../models/messageSchema.js";
import Relationship from "../../models/relationshipSchema.js";

const sendMessage = handelAsyncFunction(async (req, res, next) => {
  const { conversationId, senderId, receiverId, message } = req.body;

  if (!conversationId || !senderId || !receiverId || !message) {
    return next(new CustomError("conversationId, senderId, receiverId and message are required", 400));
  }

  // Ensure the relationship is accepted
  const relationship = await Relationship.findById(conversationId);
  if (!relationship || relationship.status !== "accepted") {
    return next(new CustomError("Conversation not available or not accepted", 403));
  }

  const newMessage = await Message.create({ conversationId, senderId, receiverId, message });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: newMessage
  });
});

export default sendMessage;
