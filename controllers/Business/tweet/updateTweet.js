import handelAsyncFunction from "../../../utils/asyncFunctionHandler.js";
import tweetModel from "../../../models/tweet/tweetModel.js";
import CustomError from "../../../utils/customError.js";
import cleanUpCloud from "../../../utils/cleanUpCloud.js";
import businessModel from "../../../models/BusinessModels/business.js";

const updateTweet = handelAsyncFunction(async (req, res, next) => {
  const { tweetId, businessId } = req.params;
  const { action, replyId } = req.query;

  const tweet = await tweetModel.findById(tweetId);
  const business = await businessModel.findById(businessId);

  if (!business) {
    return next(
      new CustomError(404, `No business found with id ${businessId}`),
    );
  }

  if (!tweet) {
    return next(new CustomError(404, `No tweet found with id ${tweetId}`));
  }

  // Handle adding reply
  if (action === "addReply") {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return next(new CustomError(400, "Reply comment is required."));
    }

    if (comment.trim().length > 300) {
      return next(
        new CustomError(400, "Reply comment cannot exceed 300 characters."),
      );
    }

    const updatedTweet = await tweetModel
      .findByIdAndUpdate(
        tweetId,
        {
          $push: {
            replies: {
              userId: req.user._id,
              comment: comment.trim(),
              createdAt: new Date(),
            },
          },
        },
        { new: true, runValidators: true },
      )
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "email username profilePicture firstName lastName",
        },
      });

    return res.status(201).send({
      status: "success",
      message: "Reply added successfully.",
      data: updatedTweet,
    });
  }

  // Handle deleting reply
  if (action === "deleteReply") {
    if (!replyId) {
      return next(new CustomError(400, "Reply ID is required."));
    }

    const reply = tweet.replies.id(replyId);

    if (!reply) {
      return next(new CustomError(404, `No reply found with id ${replyId}`));
    }

    if (reply.userId.toString() !== req.user._id.toString()) {
      return next(new CustomError(403, "Only the reply owner can delete it."));
    }

    const updatedTweet = await tweetModel
      .findByIdAndUpdate(
        tweetId,
        { $pull: { replies: { _id: replyId } } },
        { new: true, runValidators: true },
      )
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "email username profilePicture firstName lastName",
        },
      });

    return res.status(200).send({
      status: "success",
      message: "Reply deleted successfully.",
      data: updatedTweet,
    });
  }

  const body = req.body;
  const updateQuery = {};

  // owner-only editable fields
  const ownerFields = ["tweet", "hashtags", "visibility", "removedMedia"];

  const isTryingOwnerEdit = ownerFields.some(
    (field) => body[field] !== undefined,
  );

  // centralized owner validation
  if (isTryingOwnerEdit) {
    if (business.owner.toString() !== req.user._id.toString()) {
      return next(
        new CustomError(403, "Only the owner can modify tweet content."),
      );
    }
  }

  // like toggle (open to users)
  if (body.like) {
    const hasLiked = tweet.likes.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    updateQuery.$pull ??= {};
    updateQuery.$addToSet ??= {};

    if (hasLiked) {
      updateQuery.$pull.likes = req.user._id;
    } else {
      updateQuery.$addToSet.likes = req.user._id;
    }
  }

  // tweet update
  if (typeof body.tweet === "string") {
    updateQuery.tweet = body.tweet.trim();
    updateQuery.edited = true;
  }

  // hashtags update
  if (Array.isArray(body.hashtags)) {
    updateQuery.hashtags = body.hashtags.map((tag) => tag.trim());
    updateQuery.edited = true;
  }

  // visibility update
  if (body.visibility) {
    const allowed = ["public", "followers"];

    if (!allowed.includes(body.visibility)) {
      return next(new CustomError(400, "Invalid visibility value."));
    }

    updateQuery.visibility = body.visibility;
    updateQuery.edited = true;
  }

  if (Object.keys(updateQuery).length === 0) {
    return next(new CustomError(400, "No valid fields provided to update."));
  }

  // Delete removed media from cloud

  if (Array.isArray(body.removedMedia) && body.removedMedia.length > 0) {
    await cleanUpCloud(body.removedMedia);
    updateQuery.$pull = {
      media: {
        url: { $in: body.removedMedia },
      },
    };
  }

  const updatedTweet = await tweetModel.findByIdAndUpdate(
    tweetId,
    updateQuery,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).send({
    status: "success",
    message: "Tweet updated successfully.",
    data: updatedTweet,
  });
});

export default updateTweet;
