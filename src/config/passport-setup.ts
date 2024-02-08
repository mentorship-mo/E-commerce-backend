import {  PassportStatic } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
dotenv.config()
import { UserService } from '../modules/user/user.service'
import { db } from '../modules/user/user.repo'
const configurePassport = (passport: PassportStatic) => {
    const userService = new UserService(db);
passport.use(
    new GoogleStrategy(
        {
            clientID : process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET! ,
            callbackURL: '/v1/user/google/redirect',
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
            console.log('here');
           userService.authenticationGoogle(profile, done)
        }
    )
)
}
export default configurePassport