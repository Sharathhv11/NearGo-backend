import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import Relationship from "../../models/relationshipModel.js";
import Message from "../../models/messageModel.js";


const getConversations = handelAsyncFunction(async (req, res, next) => {
  const { userId } = req.params;

  // Find all accepted relationships for the user
  const conversations = await Relationship.find({
    status: "accepted",
    $or: [{ requester: userId }, { receiver: userId }]
  })
    .populate("requester", "name username profile")
    .populate("receiver", "name username profile");

  // Attach last message for preview
  const results = await Promise.all(
    conversations.map(async (conv) => {
      const lastMessage = await Message.findOne({ conversationId: conv._id })
        .sort({ createdAt: -1 })
        .lean();

      return { conversation: conv, lastMessage };
    })
  );

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

export default getConversations;