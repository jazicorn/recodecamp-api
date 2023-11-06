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
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as dotenv from 'dotenv';
dotenv.config();

class Guest_Routes_Passcodes {
    /**Public: Guest Registers Passcode*/
    public pathGuestValidate = '/guest/validate/account';
    /**Public: Create Guest*/
    public pathGuestPasscode = '/guest/validate/passcode';
    /**Express Router*/
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.pathGuestValidate, this.guestValidateAccount);
        this.router.post(this.pathGuestPasscode, this.guestPasscode);
    }

    /**Public: Guest Passcode*/
    public guestPasscode = async (req: Request, res: Response) => {
        switch(req.method) {
            case('POST'):
                try {
                    const data = req.body;
                    //console.log("passcodeRequestEmail:", data._EMAIL);

                    /**Retrieve Guest */
                    // Check Email in database
                    const getGuest = await sql`SELECT _EMAIL, _PASSCODE, _PASSCODE_CONFIRMED FROM _GUEST WHERE _EMAIL = ${data._EMAIL}`;
                    const results = getGuest[0];
                    //console.log("guestResult:", results);

                    return res.status(200).send(results);

                } catch {
                    return res.status(500).send({ error: "Database Connection Error" });
                }
                break
            default:
                return res.status(405).send({ error: `${req.method} Method Not Allowed` });
        }
    };

    /**Public: Guest Confirms Account Validate Passcode*/
    public guestValidateAccount = async (req: Request, res: Response) => {
        switch (req.method) {
            case 'POST':
                try {
                    const info = req.body;
                    //console.log("data:", data);
                    const passcode = info._PASSCODE;
                    const date = new Date();
                    //console.log(date);
                    /** Update Confirmed to true */
                    const guestValid = await sql`
                        SELECT *
                        FROM _GUEST
                        WHERE _PASSCODE = ${passcode};
                    `;
                    //console.log("guestValid:", guestValid);
                    if( guestValid === undefined ) {
                        return res
                            .status(400)
                            .send({ error: `Guest Not Found` });
                    }

                    /**Validate Guest Data */
                    // Check Guest IP Address
                    const guestIP = req.socket.remoteAddress;

                    // complex queries | https://github.com/porsager/postgres
                    /** Update Confirmed to true */
                    const updateGuestPasscodeConfirmed = await sql`
                        UPDATE _GUEST
                        SET _PASSCODE_CONFIRMED = true
                        WHERE _PASSCODE = ${passcode};
                    `;
                    //console.log("updateGuestPasscode:", updateGuestPasscodeConfirmed[0]);
                    const updateGuestDate = await sql`
                        UPDATE _GUEST
                        SET _UPDATED_AT = ${date}
                        WHERE _PASSCODE = ${passcode};
                    `;

                    const newId = uuidv4();
                    const updateGuestPasscode = await sql`
                        UPDATE _GUEST
                        SET _PASSCODE = ${newId}
                        WHERE _PASSCODE = ${passcode};
                    `;
                    /** Update User */
                    const guestValidUpdated = await sql`
                        SELECT _PASSCODE_CONFIRMED
                        FROM _GUEST
                        WHERE _PASSCODE = ${newId};
                    `;
                    const guestResult = guestValidUpdated[0];
                    //console.log("guestResult:", guestValidUpdated);
                    //console.log("guestResult._PASSCODE_CONFIRMED:", guestResult._passcode_confirmed);

                    if (guestResult !== undefined) {
                        return res
                            .status(200)
                            .send({ data: guestValidUpdated[0]});
                    }
                } catch {
                    return res.status(500).send({ error: 'Database Error' });
                }
                break;
            default:
                return res
                    .status(405)
                    .send({ error: `${req.method} Method Not Allowed` });
        }
    };
}

export default Guest_Routes_Passcodes;
