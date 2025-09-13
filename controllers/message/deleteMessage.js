import handelAsyncFunction from "../../utils/handelAsyncFunction.js";
import CustomError from "../utils/CustomError.js";
import Message from "../../models/messageModel.js";

const deleteMessage = handelAsyncFunction(async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user.id; // from authorize middleware

  const message = await Message.findById(messageId);
  if (!message) {
    return next(new CustomError("Message not found", 404));
  }

  // Only sender can delete their message
  if (message.senderId.toString() !== userId) {
    return next(new CustomError("You can only delete your own messages", 403));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully"
  });
});

export default deleteMessage;
