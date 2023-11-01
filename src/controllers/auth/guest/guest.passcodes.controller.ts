import { Request, Response } from 'express';
import Router from 'express-promise-router';
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
    /**Express Router*/
    public router = Router();
    /**Cors Options*/
    private corsOptions = cors({
        origin: process.env.WEBURL,
        optionsSuccessStatus: 200
    });

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.pathGuestValidate, this.guestValidateAccount);
    }

    /**Public: Guest Confirms Account Validate Passcode*/
    public guestValidateAccount = async (req: Request, res: Response) => {
        switch (req.method) {
            case 'POST':
                try {
                    const data = req.body;
                    //console.log("data:", data);
                    const passcode = data._PASSCODE;
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
                        WHERE _PASSCODE = ${passcode}
                        RETURNING *;
                    `;
                    const guestResult = updateGuestPasscode[0];
                    //console.log("guestResult:", guestResult);

                    if (guestResult !== undefined) {
                        return res
                            .status(200)
                            .send({ message: 'Successful | Account Confirmed' });
                    }
                } catch {
                    return res.status(500).send({ error: 'Database Error' });
                }
                break;
            default:
                return res
                    .status(400)
                    .send({ error: `${req.method} Method Not Allowed` });
        }
    };

}

export default Guest_Routes_Passcodes;
