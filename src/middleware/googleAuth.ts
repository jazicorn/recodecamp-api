// Article | https://unclebigbay.com/build-an-email-application-using-node-js-express-js-with-gmail-and-nodemailer-all-in-one-article
import * as dotenv from 'dotenv';
dotenv.config();

// Nodemailer
import nodemailer from "nodemailer";

// Googleapis
import { google } from "googleapis";
// Pull out OAuth from googleapis
const OAuth2 = google.auth.OAuth2;

// Import multer
import multer from "multer";

// Multer file storage
export const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./attachments");
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

// Middleware to get attachments
export const attachmentUpload = multer({
  storage: Storage,
}).single("attachment");

export const createTransporter = async () => {
// 1
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

// 2
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        //console.log(err)
        reject("Failed to create access token :( " + err);
      }
      resolve(token);
    });
  });

// 3
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.OAUTH_SENDER_EMAIL,
      accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

// 4
  return transporter;
};

export default createTransporter;
