// email-base component
import React, { FC, createElement, ComponentType } from "react";
import {
    Mjml,
    MjmlAll,
    MjmlAttributes,
    MjmlBody,
    MjmlBodyProps,
    MjmlBreakpoint,
    MjmlFont,
    MjmlHead,
    MjmlPreview,
    MjmlTitle,
    RequiredChildrenProps,
    render,
} from "mjml-react";
import { createTransport, SendMailOptions } from "nodemailer";

export const createEmailHtml = <P extends {}>(
    template: ComponentType<P>,
    props: P
): string => {
    const mjmlElement = createElement(template, props);
    const { html, errors } = render(mjmlElement);

    if (errors.length !== 0 ) {
        console.log("mjml error:\n", errors[0]);
    }

    return html;

};

export const EmailBase = ({
    breakpoint,
    children,
    title,
    preview,
    ...restBodyProps
}) => {

    const fontFamily = "Roboto";
    const fontHref = `http://fonts.googleapis.com/css?family=${fontFamily}:400,100,100`;

    return (
        <Mjml>
            <MjmlHead>
                <MjmlTitle>{title}</MjmlTitle>
                <MjmlPreview>{preview}</MjmlPreview>
                <MjmlFont name={fontFamily} href={fontHref} />
                <MjmlAttributes>
                    <MjmlAll fontFamily={fontFamily} fontSize={14} color="black" />
                </MjmlAttributes>
                {breakpoint && <MjmlBreakpoint width={breakpoint} />}
            </MjmlHead>
            <MjmlBody {...restBodyProps}>
                {children}
            </MjmlBody>
        </Mjml>
    );
};

export default EmailBase
