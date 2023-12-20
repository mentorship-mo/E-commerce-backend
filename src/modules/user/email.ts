// import sgMail from "@sendgrid/mail";

// DEPRECATED => WITH SENDGRID

// async function emailVerification(email: string, token: string): Promise<void> {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//   const verificationLink = `http://localhost:${process.env.PORT}/verify/${token}`;
//   const msg = {
//     to: email,
//     from: "mahmoud0122549@gmail.com", // Change to your verified sender
//     subject: "Ecommerce verification Email",
//     html: `<p style="font-size:2.25rem; font-weight:700;text-align:center;">Welcome to ZWEB (Zagazig Website Easy Build)</p>
//     <p style="font-size:1.5rem; font-weight:600;text-align:center;">To complete your registration and unlock the full benefits of our platform, please click the button below to verify your email address:</p>    
//     <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: block; border-radius: 5px;text-align:center;width:fit-content;margin:0 auto;">Verify Email</a>`,
//   };
//   try {
//     await sgMail.send(msg);
//   } catch (err) {
//     console.log("Internal Server Error");
//   }
// }

// export { emailVerification };


// # ------------------
// # Create a campaign\
// # ------------------
// # Include the Brevo library\
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// # Instantiate the client\
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = 'YOUR_API_V3_KEY';
var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
// # Define the campaign settings\
emailCampaigns.name = "Campaign sent via the API";
emailCampaigns.subject = "My subject";
emailCampaigns.sender = {"name": "From name", "email":"myfromemail@mycompany.com"};
emailCampaigns.type = "classic";
// # Content that will be sent\
htmlContent: 'Congratulations! You successfully sent this example campaign via the Brevo API.',
// # Select the recipients\
recipients: {listIds: [2, 7]},
// # Schedule the sending in one hour\
scheduledAt: '2018-01-01 00:00:01'
}
// # Make the call to the client\
apiInstance.createEmailCampaign(emailCampaigns).then(function(data) {
console.log('API called successfully. Returned data: ' + data);
}, function(error) {
console.error(error);
});