const nodemailer = require('nodemailer');
const config = require('./config');
const logging = require('./logging');
const NAMESPACE = 'Email Helper';

const transport = nodemailer.createTransport({
  host: config.email.host,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  logger: true,
});

module.exports = sendMail = async (options) => {
  try {
    const emailOptions = {
      from: `GetParty <no-reply@getparty.app>`,
      to: options.user.email,
      subject: options.subject,
      html: options.html,
    };

    const sendMail = await transport.sendMail(emailOptions);
    return sendMail;
  } catch (error) {
    return logging.error(NAMESPACE, 'sendPersonalEmail Method', error);
  }
};
