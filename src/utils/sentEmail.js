import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

export const transport = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,

    auth:{
        user: config.smtpApi.smtpUser,
        pass: config.smtpApi.smtpPass
    }
})
