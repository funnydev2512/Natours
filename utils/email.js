const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome()

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Danh Hoang <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid( it's not work not use!! 209 lessons)
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  //Send the actual email
  async send(template, subject) {
    //1) Render HTML based on the template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    //3)Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!!!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'This reset token is valid for 10 minutes!!!'
    );
  }
};

// const sendEmail = async (options) => {
//   //2)Define email options
//   // const mailOptions = {
//   //   from: 'Danh Hoang <sherlock2512@gmail.com>',
//   //   to: options.email,
//   //   subject: options.subject,
//   //   text: options.message,
//   //   //html
//   // };
//   //3) Send the email
//   await transporter.sendEmail(mailOptions);
// };
// module.exports = sendEmail;
