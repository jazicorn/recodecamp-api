import { Request, Response } from 'express';
import Router from 'express-promise-router';
import cors from 'cors';
import { z } from "zod";
import path from 'path';
import multer from 'multer';
import fs from 'fs';
const nodemailer = require("nodemailer");
import { v4 as uuidv4 } from 'uuid';
import { Guest } from '../../../classes/guest';
import { _Guest } from  '../../../types/types.guest';
import sql from '../../../config/db';
import { createTransporter, attachmentUpload, Storage } from '../../../middleware/nodemailer';
import { createEmailHtml } from '../../../templates/_email';
import { accountValidation, mailOptionsAccountValidation } from '../../../templates/accountValidation';
import { accountWelcome } from '../../../templates/accountWelcome';
import * as dotenv from 'dotenv';
dotenv.config();

class Guest_Routes_Passcodes {
    /**Public: Guest Confirms Account Passcode*/
    public pathGuestConfirmAccount= '/guest/confirm/account';
    /**Public: Guest Confirms Account Validate Passcode*/
    public pathGuestValidateAccount= '/guest/validate/account';
    /**Public: Guest Verify Account Passcode*/
    public pathGuestVerifyAccount= '/guest/verify/account';
    /**Public: Reset Password Passcode*/
    public pathGuestPasswordReset = '/guest/password/reset';
    /**Express Router*/
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.pathGuestConfirmAccount, this.guestConfirmAccount);
        this.router.post(this.pathGuestValidateAccount, this.guestValidateAccount);
        this.router.post(this.pathGuestVerifyAccount, this.guestVerifyAccount);
        this.router.post(this.pathGuestPasswordReset, this.guestPasswordReset);
    }

    /**Public: Guest Confirms Account Registration*/
    public guestConfirmAccount = async (req: Request, res: Response) => {
        switch(req.method) {
            case('POST'):
                const data = req.body;
                //console.log("data", data);
                const email = data.email;
                const passcode = data.passcode;
                const url = `${process.env.WEBURL}/auth/account/confirm/${passcode}`;

                // Mail options
                const mailOptions  = mailOptionsAccountValidation(email, passcode, url);

                try {
                    // Get response from the createTransport
                    let emailTransporter = await createTransporter();
                    //console.log(emailTransporter)

                    //console.log("mailoptions:\n", mailOptions)
                    // Send email
                    emailTransporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            // failed block
                            console.log("Error | Email Confirmation Not Sent:\n" + error);
                            return res.status(400).send({ error: "Email Confirmation Error" });
                        } else {
                            // Success block
                            console.log("Email sent: " + info.response);
                            return res.status(200).send({ message: "Email Confirmation Sent"});
                        }
                    });

                } catch (error) {
                    return  res.status(500).send({ error: "Something went wrong"});
                }
                break
            default:
                return res.status(400).send({ error: `${req.method} Method Not Allowed` });
        };
    };

    /**Public: Guest Confirms Account Validate Passcode*/
    public guestValidateAccount = async (req: Request, res: Response) => {
        switch(req.method) {
            case('POST'):
                try {
                    const data = req.body;
                    //console.log("data:", data);
                    const passcode = data._PASSCODE;
                    const date = new Date();
                    //console.log(date);

                    /**Validate Guest Data */
                    // Check Guest IP Address
                    const guestIP = req.socket.remoteAddress;
                    //console.log("guestIP:", guestIP);
                    const validIP = z.string().ip(guestIP);

                    if(!validIP) {
                        return res.status(400).send({ error: "User Invalid IP Address" });
                    }

                    // complex queries | https://github.com/porsager/postgres
                    /** Update Confirmed to true */
                    const updateGuestPasscodeConfirmed = await sql`
                        UPDATE _GUEST
                        SET _PASSCODE_CONFIRMED = true
                        WHERE _PASSCODE = ${passcode};
                    `;
                    //console.log("updateGuestPasscode:", updateGuestPasscode);
                    const updateGuestDate = await sql`
                        UPDATE _GUEST
                        SET _UPDATED_AT = ${date}
                        WHERE _PASSCODE = ${passcode};
                    `;

                    const newId = uuidv4();
                    const updateGuestPasscode = await sql`
                        UPDATE _GUEST
                        SET _PASSCODE = ${newId}
                        WHERE _PASSCODE = ${passcode}
                        RETURNING *;
                    `;
                    const guestResult = updateGuestPasscode[0];
                    //console.log("guestResult:", guestResult);


                    if( guestResult !== undefined) {
                        return res.status(200).send({ message: "Successful | Account Confirmed"});
                    }
                } catch {
                    return res.status(500).send({ error: "Database Error" });
                }
                break
            default:
                return res.status(400).send({ error: `${req.method} Method Not Allowed` });
        };
    };

    /**Public: Guest Verify Passcode*/
    public guestVerifyAccount = async (req: Request, res: Response) => {
        switch(req.method) {
            case('POST'):
                try {
                    return res.status(200).send({ message: "success"});
                } catch (error) {
                    return  res.status(500).send({ error: "Something went wrong"});
                }
                break
            default:
                return res.status(400).send({ error: `${req.method} Method Not Allowed` });
        };
    };

    /**Public: Guest Password Reset*/
    public guestPasswordReset = async (req: Request, res: Response) => {
        switch(req.method) {
            case('POST'):
                try {
                    return res.status(200).send({ message: "success"});
                } catch (error) {
                    return  res.status(500).send({ error: "Something went wrong"});
                }
                break
            default:
                return res.status(400).send({ error: `${req.method} Method Not Allowed` });
        };
    };
}

export default Guest_Routes_Passcodes;
