const formData = require('form-data');
const Mailgun = require('mailgun.js');

const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

const sendWelcomeEmail = async (email, name) => {
  const messageData = {
    from: 'Oleh Filonchuk <oifilonchuk@gmail.com>',
    to: email,
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}!`,
  };

  try {
    client.messages.create(DOMAIN, messageData);
  } catch (e) {
    console.error(err);
  }
};

const sendByeEmail = (email, name) => {
  const messageData = {
    from: 'Oleh Filonchuk <oifilonchuk@gmail.com>',
    to: email,
    subject: 'Thanks for being with us!',
    text: `Sorry to see you go, ${name}!`,
  };

  try {
    client.messages.create(DOMAIN, messageData);
  } catch (e) {
    console.error(err);
  }
};

module.exports = { sendWelcomeEmail, sendByeEmail };
