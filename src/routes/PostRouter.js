const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')
const { authMiddleware } = require('../middleware/authMiddleware')


router.post('/create', PostController.createPost)
router.put('/update/:id', PostController.updatePost)
router.delete('/delete/:id',  PostController.deletePost)
router.get('/getAll', PostController.getAllPosts)
router.get('/get-details/:id', PostController.getPostById)

module.exports = router