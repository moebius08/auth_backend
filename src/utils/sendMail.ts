import resend from "../config/resend";
import { email, appEnv } from "../constants/env";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () =>
    appEnv === "development" ? "onboarding@resend.dev" : email;

const getToEmail = (to: string) =>
    appEnv === "development" ? "delivered@resend.dev" : to;

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });