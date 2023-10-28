// email to new account holders
import { EmailBase } from "./_email";
import { MjmlColumn, MjmlSection, MjmlText } from "mjml-react";
import React, { FC } from "react";
import { createEmailHtml } from './_email';

export interface HelloEmailProps {
    firstName: string;
    lastName: string;
}

export const accountWelcome: FC<HelloEmailProps> = ({
    firstName,
    lastName
}) => {

    return (
        <EmailBase title="Hello!" preview="Hello from David Lee!">
            <MjmlSection>
                <MjmlColumn>
                    <MjmlText>Hello {fullName}</MjmlText>
                </MjmlColumn>
            </MjmlSection>
        </EmailBase>
    );
};

export const mailOptionsAccountWelcome = (email, passcode, url) => {
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

export default accountWelcome
