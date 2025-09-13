import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import Message from "../../models/messageSchema.js";

const getMessages = handelAsyncFunction(async (req, res, next) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1; // default 1st page
  const limit = parseInt(req.query.limit) || 100; // default 100 messages

  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .populate("senderId", "name username profile")
    .populate("receiverId", "name username profile")
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(limit);

  if (!messages || messages.length === 0) {
    return next(new CustomError("No messages found", 404));
  }

  // Reverse to send oldest → newest (for better chat display)
  const orderedMessages = messages.reverse();

  res.status(200).json({
    success: true,
    count: orderedMessages.length,
    page,
    limit,
    data: orderedMessages
  });
});

export default getMessages;
