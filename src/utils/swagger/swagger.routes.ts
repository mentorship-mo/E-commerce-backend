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
 *     description: is a specific type of multi-factor authentication (MFA) that requires two forms of identification (also referred to as authentication factors) to grant access to a resource or data. These factors include the traditional method of authentication like username/email and password – plus something you have – like a smartphone – to approve the requests.
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