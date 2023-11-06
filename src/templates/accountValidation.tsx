// account validation
import { EmailBase } from "./_email";
import { MjmlColumn, MjmlSection, MjmlText, MjmlButton, MjmlImage } from "mjml-react";
import React, { FC } from "react";
import { createEmailHtml } from './_email';

export interface ValidationProps {
    email: string;
    passcode: string;
    url: string;
}

export const accountValidation: FC<ValidationProps> = ({
    email,
    passcode,
    url
}) => {

    const userEmail = email.split("@")[0];

    return (
        <EmailBase title="Account Confirmation" preview="" breakpoint="">
            <MjmlSection fullWidth textAlign="center">
                <MjmlColumn>
                    <MjmlText align="center" fontSize="36px" color="#2ca9bc">Welcome to Recodecamp!</MjmlText>
                    <MjmlImage src="cid:logo" width="100px" height="100px" padding="10px" align="center"/>
                    <MjmlText align="center">Hello {userEmail}. Please Confirm Your Account:</MjmlText>
                    <MjmlButton
                        padding="2px"
                        backgroundColor="#2ca9bc"
                        href={url}
                    >
                        Account Verification
                    </MjmlButton>
                </MjmlColumn>
            </MjmlSection>
        </EmailBase>
    );
};

export const mailOptionsAccountValidation = (email, passcode, url) => {
    const format = {
        from: `Recodecamp ${process.env.OAUTH_SENDER_EMAIL}`,
        to: email,
        subject: "Account Confirmation",
        attachments: [{
            filename: 'logo',
            path: __dirname + '/static/logo.jpg',
            cid: 'logo'
        }],
        html: createEmailHtml(accountValidation, {
            email,
            passcode,
            url
        })
    }
    return format
};

export default accountValidation
