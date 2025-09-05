const Post = require("../models/postModel")

exports.createPost = async (req, res) => {
    const { id } = req.user
    const { title, content, category } = req.body
    try {
        if (!title || !content) return res.status(400).json({ message: 'fields cannot be empty' })
        let postPicUrl = [];
        if (req.files && req.files.length > 0) {
            const results = await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.upload(file.path, { folder: 'Post Pictures' })
                )
            );
            await Promise.all(req.files.map(file => fs.unlink(file.path)));

            postPicUrl = results.map(result => ({ url: result.secure_url, public_id: result.public_id }));
        } else {
            postPicUrl = [{ url: "", public_id: "" }];
        }
        const post = new Post({ title, content, author: id, category, postPic: postPicUrl })
        await post.save()
        return res.status(201).json({ message: "post uploaded successfully", post })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

exports.getPost = async (req, res) => {
    const { id } = req.params
    try {
        const post = await Post.findById(id).populate("author", "name").populate("category", "name -_id").populate({ path: "comments", select: "author content createdAt", populate: { path: "author", select: "name -_id" } })
        if (!post) return res.status(404).json({ message: 'post not found' })
        return res.status(200).json({ message: "post retrieved successfully", post })

    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}

exports.getPosts = async (req, res) => {
    try {
        const post = await Post.find().populate("author", "name").populate("category", "name -_id").populate({ path: "comments", select: "author content createdAt", populate: { path: "author", select: "name -_id" } })
        if (!post) return res.status(404).json({ message: 'no post found' })
        return res.status(201).json({ message: "posts retrieved successfully", post })

    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}

exports.deletePost = async (req, res) => {
    const { id } = req.params
    try {
        const post = await Post.findByIdAndDelete(id)
        if (!post) return res.status(404).json({ message: 'post not found' })

        if (req.user.id !== post.author.toString()) { return res.status(400).json({ message: "no permission to delete this post" }) }
        return res.status(200).json({ message: "post deleted successfully", post })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.editPost = async (req, res) => {
    const { id } = req.params
    const { title, content } = req.body
    try {
        const post = await Post.findById(id) 
           if (req.files && req.files.length > 0) {
      await Promise.all(
        post.postPic.map(img => {
          if (img.public_id !== "") { 
            return cloudinary.uploader.destroy(img.public_id);
          }
        })
      );

      const results = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(file.path, { folder: "Post Pictures" })
        )
      );

      await Promise.all(req.files.map(file => fs.unlink(file.path)));

      post.postPic = results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id
      }));
    }
        if (!post) return res.status(404).json({ message: 'post not found' })
        if (title) post.title = title
        if (content) post.content = content
        await post.save()

        return res.status(200).json({ message: 'post updated successfully', data: post });

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
}

exports.getAllUserPost = async (req, res) => {
    const { userId } = req.params
    try {
        const posts = await Post.find({ author: userId }).populate("author", "name").populate("category", "name -_id")
        if (!posts || posts.length < 1) return res.status(400).json({ message: "this user has no posts" })
        return res.status(200).json({ success: "true", posts })
    } catch (error) {
        return res.status(500).json({ error: error.message });

    }

}