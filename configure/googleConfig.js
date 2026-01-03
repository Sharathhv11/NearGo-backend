import { google } from "googleapis";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  "postmessage"
);

export default oauth2client;
