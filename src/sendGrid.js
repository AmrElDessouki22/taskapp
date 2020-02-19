const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.GRID_KEY)
module.exports = sgMail