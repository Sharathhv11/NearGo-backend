import express from "express";
import authorize from "../controllers/authorization.js";
import sendRequest from "../controllers/relationship/sendRequest.js";
import respondToRequest from "../controllers/relationship/respond.js";
import getPendingRequests from "../controllers/relationship/pendingList.js";
import getAcceptedRelationships from "../controllers/relationship/acceptList.js";
import getBlockedRelationships from "../controllers/relationship/blockedList.js";


const relationshipRouter = express.Router();

// Send a new relationship (chat) request
relationshipRouter.post("/request",authorize, sendRequest);

// Accept / Reject / Block a request
relationshipRouter.patch("/:id",authorize,respondToRequest);

// List all pending requests for a user
relationshipRouter.get("/pending/:userId",authorize, getPendingRequests);

// List all accepted (active) relationships for a user
relationshipRouter.get("/accepted/:userId",authorize, getAcceptedRelationships);


// List all Blocked relationships by a user
relationshipRouter.get("/blocked/:userId",authorize, getBlockedRelationships);

export default relationshipRouter;
