import express from "express";
import authorize from "../controllers/authorization.js";
import sendMessage from "../controllers/message/sendMessage.js";
import getMessages from "../controllers/message/getmessages.js";

const messageRouter = express.Router();

// Send a new message in a conversation
messageRouter.post("/", authorize, sendMessage);

// Get all messages in a conversation
messageRouter.get("/:conversationId", authorize, getMessages);

// Get all conversations (chat list) of a user
messageRouter.get("/conversations/:userId", authorize, (req,res)=>res.send("hello"));

// Mark messages as read in a conversation
messageRouter.patch("/read/:conversationId", authorize, (req,res)=>res.send("hello"));

// Delete a specific message (optional feature)
messageRouter.delete("/:messageId", authorize, (req,res)=>res.send("hello"));


export default messageRouter;