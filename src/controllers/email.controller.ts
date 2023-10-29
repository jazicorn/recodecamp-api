import { Request, Response } from 'express';
import Router from 'express-promise-router';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { createTransporter, attachmentUpload, Storage } from '../middleware/nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

class Email {
    public pathEmailForm = '/email/form';
    public pathEmailSend = '/email/send';
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.pathEmailForm, this.emailForm);
        this.router.post(this.pathEmailSend, this.emailSend);
    }

    public emailForm = async (req: Request, res: Response) => {
        switch(req.method) {
            case('GET'):
                try {
                    return res.status(200).sendFile('index.html');
                } catch {
                    return res.status(500).send({ error: "Something went wrong"});
                }
                break
            default:
                return res.status(400).send({ error: `${req.method} Method Not Allowed` });
        };
    };

    // Post route to handle retrieving data from HTML form to server
    public emailSend = async (req: Request, res: Response) => {
        switch(req.method) {
            case('POST'):
                //console.log("req.body:\n", req.body)
                // Pulling out the form data from the request body
                const recipient = req.body.email;
                const mailSubject = req.body.subject;
                const mailBody = req.body.message;

                // Mail options
                const mailOptions = {
                    from: process.env.OAUTH_SENDER_EMAIL,
                    to: recipient,
                    subject: mailSubject,
                    text: mailBody,
                };

                try {
                    // Get response from the createTransport
                    let emailTransporter = await createTransporter();
                    //console.log(emailTransporter)

                    //console.log("mailoptions:\n", mailOptions)
                    // Send email
                    emailTransporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            // failed block
                            console.log("Email Not Sent | Error:\n" + error);
                            return res.redirect("/error.html");
                        } else {
                            // Success block
                            console.log("Email sent: " + info.response);
                            return res.redirect("/success.html");
                        }
                    });
                } catch (error) {
                    return  res.status(500).send({ error: "Something went wrong"});
                }
                break
            default:
                return res.status(400).send({ error: `${req.method} Method Not Allowed` });
        }
    }
}

export default Email;
