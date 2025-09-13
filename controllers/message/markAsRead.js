
import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import Message from "../../models/messageModel.js";

const markAsRead = handelAsyncFunction(async (req, res, next) => {
  const { conversationId } = req.params;
  const { userId } = req.body; // user marking as read

  await Message.updateMany(
    { conversationId, receiverId: userId, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as read"
  });
});

export default markAsRead;