const Post = require("../models/postModel")

exports.createPost = async (req, res) => {
    const { id } = req.user
    const { title, content } = req.body
    try {
        if (!title || !content) return res.status(400).json({ message: 'fields cannot be empty' })
        const post = new Post({ title, content, author: id })
        await post.save()
        return res.status(201).json({ message: "post uploaded successfully", post })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

exports.getPost = async (req, res) => {
    const { id } = req.params
    try {
        const post = await Post.findById(id)
        if (!post) return res.status(404).json({ message: 'post not found' })
        return res.status(200).json({ message: "post retrieved successfully", post })

    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
}

exports.getPosts = async (req, res) => {
    try {
        const post = await Post.find()
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
        if (req.user.id !== post.author.tostring()) {return res.status(400).json({message:"no permission to delete this post"})}
        return res.status(200).json({ message: "post retrieved successfully", post })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.editPost= async(req,res)=>{
    const { id } = req.params
    const { title, content }=req.body
    try {
        const post = await Post.findById(id)
        if (!post) return res.status(404).json({ message: 'post not found' })
        if (title) post.title=title
        if (content) post.content=content
         await post.save()

        return res.status(200).json({message: 'post updated successfully', data: post });

    } catch (error) {
      return res.status(500).json({error: error.message });

    }
}