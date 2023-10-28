import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies._ACCESS_TOKEN;

  if (!token) {
    return res.status(403).send({ error: "A token is required for authentication" });
  }
  try {
    return next();
  } catch (err) {
    return res.status(401).send({ error: "Invalid Token" });
  }

};

export default verifyToken;
