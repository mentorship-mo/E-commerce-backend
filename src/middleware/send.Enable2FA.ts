import SibApiV3Sdk from 'sib-api-v3-sdk'
import jwt from "jsonwebtoken"
const defaultClient = SibApiV3Sdk.ApiClient.instance

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_API_KEY_2FA 


const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()



export const sendRequstEnable2FA = (email: string  , templateID : number, enable2FAToken: string) => {
    sendSmtpEmail.templateId = templateID
    sendSmtpEmail.subject = 'Enable 2FA By Email'
    sendSmtpEmail.sender = {
        name: 'EShopper',
        email: 'lamiaaselim1896@gmail.com',
    }
    sendSmtpEmail.to = [{
        email: email,
        name: 'Receiver Name',
    }]
    sendSmtpEmail.params = {
        enable2FAToken: enable2FAToken,
        email: email
    }

    apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(function (data) {
            console.log('API called successfully. Returned data:', data)
        })
        .catch(function (error) {
            console.error('Error sending enable2FA request:', error.message)
        })
}

export function enable2FAToken(id : String){
    return jwt.sign({ id: id }, 'secret', { expiresIn: '10m' })
}