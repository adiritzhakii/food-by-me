import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";


/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments managing API
*/

/**
* @swagger
* /comments:
*   get:
*     summary: Retrieve a list of comments
*     tags: [Comments]
*     responses:
*       200:
*         description: A list of comments
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Comment'
*/
router.get("/", commentsController.getAll.bind(commentsController));

/**
* @swagger
* /comments/{id}:
*   get:
*     summary: Retrieve a single comment by ID
*     tags: [Comments]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The comment ID
*     responses:
*       200:
*         description: A single comment
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Comment'
*       404:
*         description: Comment not found
*/
router.get("/:id", (req, res) => {
    commentsController.getById(req, res);
});

/**
* @swagger
* /comments:
*   post:
*     summary: Create a new comment
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Comment'
*     responses:
*       201:
*         description: The created comment
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Comment'
*       400:
*         description: Bad request
*/
router.post("/", authMiddleware, commentsController.create.bind(commentsController));

/**
* @swagger
* /comments/{id}:
*   delete:
*     summary: Delete a comment by ID
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The comment ID
*     responses:
*       200:
*         description: Comment deleted
*       404:
*         description: Comment not found
*/
router.delete("/:id", authMiddleware, commentsController.deleteItem.bind(commentsController));

export default router;