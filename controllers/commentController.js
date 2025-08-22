const Comment = require('../models/commentModel')
const Post = require('../models/postModel')

exports.addComment = async (req, res) => {
    const { id } = req.user
    const { postId } = req.params
    const { content } = req.body
    try {
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: "post not found" })
        const comment = new Comment({
            author: id,
            post: postId,
            content: content
        })
        await comment.save()
        post.comments.push(comment._id)

        post.commentCount += 1
        await post.save()

        return res.status(200).json({ message: "comment successfully Uploaded", comment })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message })


    }
}

exports.removeComment = async (req, res) => {
    const { commentId } = req.params
    try {
        const comment = await Comment.findById(commentId)
        if (!comment) return res.status(404).json({ message: "this comment doesn't exist" })
        if (comment.author.toString()  !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: "you're not authorized to delete this comment" })
        const post = await Post.findById(comment.post)
        await comment.deleteOne()
        if (post) {
            post.comments = post.comments.filter(id => id.toString() !== commentId)

            post.commentCount = Math.max(0, post.commentCount - 1);
            await post.save()
        }
        return res.status(200).json({ message: "comment successfully deleted", comment })

    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message })

    }
}
exports.editComment = async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body
    try {
        let comment = await Comment.findById(commentId)
        if (!comment) return res.status(404).json({ message: "this comment doesn't exist" })
        if (!content) return res.status(400).json({ message: "input edited comment" })
        comment.content = content
        await comment.save()
        return res.status(200).json({ message: "comment successfully updated", comment })


    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message })

    }
}

exports.getAllCommentsByUser = async (req, res) => {
    const { userId } = req.params
    try {
        const comments = await Comment.find({ author: userId }).populate('post', 'title').populate("author", "name,email")
        if (!comments || comments.length === 0) return res.status(404).json({ message: "no comments for this user" })
        return res.status(200).json({ message: "comments retrieved successfully", comments })
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message })

    }
}
exports.getCommentUnderPost = async (req, res) => {
    const { postId } = req.params
    try {
        const comments = await Comment.find({ post: postId }).populate('author', 'name email')
        return res.status(200).json({ message: "comments Successfully retrieved", comments })
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message })
    }


} 