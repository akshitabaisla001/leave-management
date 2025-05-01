
import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:  "baislaakshi10@gmail.com", 
      pass: "sysa kbtw ncqm spfv", 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP');
  }
};

export default sendEmail;
