/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update user data [email - password]
 *     description: Updated user data after Authentication
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: user@example.com
 *             password: newPassword123
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /resend-verification-email:
 *   put:
 *     summary: Resend verification email for user
 *     description: Resend the verification email to the user's registered email address.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: user@example.com
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *       '400':
 *         description: Bad request
 */
/**
 * @swagger
 * /enable-2fa-request:
 *   post:
 *     summary: Request to enable Two-Factor Authentication (2FA)
 *     description: Request to enable 2FA for a user account
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 2FA request sent successfully
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /enable-2fa:
 *   post:
 *     summary: Enable Two-Factor Authentication (2FA)
 *     description: Enable Two-Factor Authentication (2FA)
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: Verification Code
 *         description: Verification code for enabling 2FA
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               description: The verification code for enabling 2FA
 *     responses:
 *       '200':
 *         description: 2FA enabled successfully
 *       '400':
 *         description: Bad request or invalid verification code
 */

/**
 * @swagger
 * /login-with-otp:
 *   post:
 *     summary: Login with One-Time Password (OTP)
 *     description: Login using a one-time password for 2FA authentication. OTP authentication involves generating a unique password that is valid for a single login session or transaction, providing an extra layer of security compared to traditional password-based authentication methods.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: OTP Credentials
 *         description: OTP credentials for login
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The email address of the user
 *             otp:
 *               type: string
 *               description: The one-time password for login
 *     responses:
 *       '200':
 *         description: Login successful
 *       '401':
 *         description: Unauthorized - Invalid OTP or authentication failure
 *       '400':
 *         description: Bad request
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: The refresh token is used to generate a new access token. Typically, if the access token has an expiration date, once it expires, the user would have to authenticate again to obtain an access token. It may also be necessary to generate a new access token when you want to access a resource that has not been accessed before.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: New access token generated successfully
 *       '401':
 *         description: Unauthorized - Invalid or expired refresh token
 */
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user data by token
 *     description: Retrieve user data based on the provided authentication token from cookies.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: Cookies
 *         name: accessToken
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID
 *                     name:
 *                       type: string
 *                       description: The user's name
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     image:
 *                       type: string
 *                       description: The user's profile image URL
 *       '401':
 *         description: Unauthorized - Token is missing or invalid
 *       '500':
 *         description: Internal Server Error
 */
