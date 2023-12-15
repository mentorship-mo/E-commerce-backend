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
 *         description: Bearer token containing the refresh token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *        '200':
 *              description: New access token generated successfully
 *        '401':
 *              description: Unauthorized - Invalid or expired refresh token
 */

