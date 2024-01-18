import SibApiV3Sdk from 'sib-api-v3-sdk'
import jwt from "jsonwebtoken"
const defaultClient = SibApiV3Sdk.ApiClient.instance

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key']
<<<<<<< HEAD
apiKey.apiKey = "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"  
=======
apiKey.apiKey = process.env.SENDINBLUE_API_KEY 

>>>>>>> 7d7417865ec32b0ead17cc8e5388cb4d94ec3f3a

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()




export const sendVerificationEmail = (email: string  , templateID : number,verificationToken : string) => {
    sendSmtpEmail.templateId = templateID
    sendSmtpEmail.subject = 'Verification Link'
    sendSmtpEmail.sender = {
        name: 'e-c',
        email: 'e-c@e-c.com',
    }
    sendSmtpEmail.to = [{
        email: email,
        name: 'Receiver Name',
    }]
    sendSmtpEmail.params = {
        verificationToken: verificationToken,
        email: email
    }

    apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(function (data) {
            console.log('API called successfully. Returned data:', data)
        })
        .catch(function (error) {
            console.error('Error sending verification email:', error.message)
        })
}


export function verificationToken(id : String){
    return jwt.sign({ id: id }, 'secret', { expiresIn: '2m' })
}


  