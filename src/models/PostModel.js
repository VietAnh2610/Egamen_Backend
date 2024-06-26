const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    describe: { type: String, required: false },
    author: { type: String, required: false },
    image: [{ type: String, required: true }],
    content: { type: String, required: false },
    // Các trường khác...
  },
   {
    timestamps: true,
   }
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;