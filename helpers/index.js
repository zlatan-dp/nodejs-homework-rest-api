const sendGrid = require("@sendgrid/mail");

const { SENDGRID_KEY } = process.env;

function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

async function sendMail({ to, subject, html }) {
  try {
    sendGrid.setApiKey(SENDGRID_KEY);
    const email = {
      to,
      from: "zlatandnepr@gmail.com",
      subject,
      html,
    };

    await sendGrid.send(email);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  tryCatchWrapper,
  sendMail,
};
