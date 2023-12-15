/**
 * @swagger
 * /update:
 *   put:
 *     summary: update user data [email - password]
 *     description: updated user data after Authentication
 *     tags:
 *          - User
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
 *        '200':
 *              description: user updated successfully
 *        '400':
 *              description: Bad request
 */

/**
 * @swagger
 * /resend-verification-email:
 *   put:
 *     summary: Resend verification email for user
 *     description: Resend the verification email to the user's registered email address.
 *     tags:
 *          - User
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
 *        '200':
 *              description: Email sent successfully
 *        '400':
 *              description: Bad request
 */

/**
 * @swagger
 * /login-with-otp:
 *   post:
 *     summary: Login with One-Time Password (OTP)
 *     description: Login using a one-time password for 2FA authentication " OTP authentication involves generating a unique password that is valid for a single login session or transaction, providing an extra layer of security compared to traditional password-based authentication methods. "
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
 *
 * @swagger
 * /forget-password:
 *      post:
 *              tags:
 *                  - Forget Password
 *              summary: Request a password reset
 *              description: Send a password reset email to the user's registered email address.
 *              requestBody:
 *               required: true
 *               content:
 *                 application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address associated with the user account.
 *                      required:
 *                          - email
 *              responses:
 *                    '200':
 *                       description: Password reset email sent successfully.
 *                    '404':
 *                     description: User not found or email address not registered.
 *
 */
/**
 *
 * @swagger
 * /forget-password:
 *      post:
 *              tags:
 *                  - Forget Password
 *              summary: Request a password reset
 *              description: Send a password reset email to the user's registered email address.
 *              requestBody:
 *               required: true
 *               content:
 *                 application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address associated with the user account.
 *                      required:
 *                          - email
 *              responses:
 *                    '200':
 *                       description: Password reset email sent successfully.
 *                    '404':
 *                     description: User not found or email address not registered.
 *
 */
