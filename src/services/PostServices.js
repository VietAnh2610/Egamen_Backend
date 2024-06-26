const Post = require("../models/PostModel");

const createPost = (newPost) => {
  return new Promise(async (resolve, reject) => {
    const { title, content,author , describe , image} = newPost;

    try {
      const checkPost = await Post.findOne({ title: title });

      if (checkPost !== null) {
        resolve({
          status: "ERR",
          message: "A post with the same title already exists",
        });
      }

      const createdPost = await Post.create({
        title,
        content,
        author,
        describe,
        image
        
      });

      if (createdPost) {
        resolve({
          status: "OK",
          message: "Post created successfully",
          data: createdPost,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Failed to create post",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllPosts = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};
      if (filter) {
        const label = filter[0];
        query[label] = { '$regex': filter[1], '$options': 'i' };
      }

      let PostQuery = Post.find(query).limit(limit).skip(limit * page);

      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        PostQuery = PostQuery.sort(objectSort);
      } else {
        PostQuery = PostQuery.sort({ createdAt: -1 }); // Sắp xếp theo createdAt giảm dần
      }

      const allPost = await PostQuery;
      const totalPost = await Post.countDocuments(query);

      resolve({
        status: "OK",
        message: "List Post",
        data: allPost,
        total: totalPost,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalPost / limit),
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message
      });
    }
  });
};

const updatePost = (id, data) => {
  
  return new Promise(async (resolve, reject) => {
    try {
      const checkPost = await Post.findOne({
        _id: id,
      });
      if (checkPost === null) {
        resolve({
          status: "ERR",
          message: "The post is not defined",
        });
      }

      const updatedPost = await Post.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedPost,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deletePost = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPost = await Post.findOne({ _id: id });

      if (checkPost === null) {
        resolve({
          status: "ERR",
          message: "the post is not defined",
        });
      }
      await Post.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete Post SUCCESS ",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getPostById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findOne({ _id: id });
      if (post === null) {
        resolve({
          status: "ERR",
          message: "the post is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: post,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getPostById

};
