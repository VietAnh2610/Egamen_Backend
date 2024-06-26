const Post = require("../models/PostModel");
const PostService = require("../services/PostServices");

const createPost = async (req, res) => {

  try {
    const { title, content, author, describe, image } = req.body;

    if (!title || !content || !author || !describe) {
      return res.status(400).json({
        status: "ERR",
        message: "Title, content, and author are required fields",
      });
    }

    const response = await PostService.createPost(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
      const {limit, page, sort, filter } = req.query
    const response = await PostService.getAllPosts(Number(limit), Number(page) || 0, sort, filter);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updatePost = async (req, res) => {
  try {
      const PostId = req.params.id
      const data = req.body
      if (!PostId) {
          return res.status(200).json({
              status: 'ERR',
              message: 'The PostId is required'
          })
      }
      const response = await PostService.updatePost(PostId, data)
      return res.status(200).json(response)
  } catch (e) {
      return res.status(404).json({
          message: e
      })
  }
}


const deletePost = async (req, res) => {
  try {
    const PostId = req.params.id;
    const token = req.headers;


    if (!PostId) {
      return res.status(200).json({
        status: "ERR",
        message: "The postID is required",
      });
    }

    const response = await PostService.deletePost(PostId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getPostById = async (req, res) => {
  try {
      const PostId = req.params.id;
      if (!PostId) {
          return res.status(400).json({
              status: 'ERR',
              message: 'The postID is required'
          });
      }
      const response = await PostService.getPostById(PostId);
      return res.status(200).json(response);
  } catch (e) {
      console.error(e); 
      return res.status(500).json({
          message: 'Internal server error'
      });
  }
};
module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getPostById
};
