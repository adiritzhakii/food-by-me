import express from "express";
const router = express.Router();
import authController, { authMiddleware, editProfile, getProfile, getUserById, loginOAuthHandler, registerOAuthHandler, setAvatar } from "../controllers/auth_controller";
import { createImage } from "../middleware/upload-image";


/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         name: 'Alice'
 *         email: 'alice@gmail.com'
 *         password: '123456'
 *     UserDB:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - avatar
 *         - refreshToken
 *       properties:
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         avatar:
 *           type: string
 *           description: The user picture, can be url or path in server
 *         refreshToken:
 *           type: array
 *           items:
 *             type: string
 *           description: List of refreshTokens
 *       example:
 *         name: 'Alice'
 *         email: 'alice@gmail.com'
 *         avatar: 'https://www.google.com'
 *         refreshToken: ["asd", "qwer"]
 *     providerSchema:
 *       type: string
 *       enum:
 *         - Local
 *         - Google
 *       description: The provider schema
 */

/**
* @swagger
* /api/auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post("/register", authController.register);



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns JWT tokens
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 _id:
 *                   type: string
 *                   example: 60d0fe4f5311236168a109ca
 *       '400':
 *         description: Invalid input or wrong email or password
 *       '500':
 *         description: Internal server error
 */
router.post("/login", authController.login);


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out a user by invalidating the refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               provider:
 *                 type: string
 *                 example: Local
 *     responses:
 *       '200':
 *         description: Successful logout
 *       '400':
 *         description: Invalid refresh token
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh JWT tokens
 *     description: Refreshes the access token using the refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       '200':
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '400':
 *         description: Invalid refresh token
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post("/refresh", authController.refresh);


/**
 * @swagger
 * /api/auth/oauth-register:
 *   post:
 *     summary: Register a new user via OAuth Google
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 example: 
 *     responses:
 *       200:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid OAuth credential"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while registering the user via OAuth"
 */
// Route to handle Google OAuth login/register
router.post('/oauth-register', registerOAuthHandler);

/**
 * @swagger
 * /api/auth/oauth-login:
 *   post:
 *     summary: Login a user via OAuth Google
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               crednitail:
 *                 type: string
 *                 example: 
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid OAuth crednitail"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while logging in the user via OAuth"
 */

router.post('/oauth-login', loginOAuthHandler)

/**
 * @swagger
 * /api/auth/getUserById/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *         example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDB'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid user ID"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while retrieving the user"
 */
router.get('/getUserById/:id', authMiddleware, getUserById);

/**
 * @swagger
 * /api/auth/getProfile:
 *   get:
 *     summary: Get profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provider
 *         schema:
 *           $ref: '#/components/schemas/providerSchema'
 *         required: true
 *         example: Local
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDB'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/getProfile', authMiddleware, getProfile);

/**
 * @swagger
 * /api/auth/setAvatar:
 *   post:
 *     summary: Upload image and set new Avatar
 *     tags:
 *       - Auth
 *     parameters:
 *     - name: provider
 *       in: query
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/providerSchema'
 *         example: Local
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                  type: string
 *                  format: binary
 *                  description: "The image file to set as the new avatar"
 *     responses:
 *       200:
 *         description: Successfully set the new avatar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar set successfully"
 *       400:
 *         description: Bad request, possibly missing the required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing image or invalid provider"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while processing the avatar upload"
 */
router.post('/setAvatar', authMiddleware, createImage, setAvatar)


/**
 * @swagger
 * /api/auth/editProfile:
 *   post:
 *     summary: Edit name and avatar properties
 *     tags:
 *       - Auth
 *     parameters:
 *     - name: provider
 *       in: query
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/providerSchema'
 *         example: Local
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  description: "Updated name for user"
 *               avatar:
 *                  type: string
 *                  description: "URL for avatar image"
 *     responses:
 *       200:
 *         description: Successfully set properties for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Avatar and name set successfully"
 *                 email:
 *                   type: string
 *                 avatar:
 *                   type: string
 *       400:
 *         description: Bad request, possibly missing the required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing property or invalid provider"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while processing the avatar upload"
 */
router.post('/editProfile', authMiddleware, editProfile)

export default router;