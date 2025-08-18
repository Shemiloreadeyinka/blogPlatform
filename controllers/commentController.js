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
        post.commentCount += 1
        await comment.save()
        return res.status(200).json({ message: "comment successfully Uploaded", comment })

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
}

exports.removeComment = async (req, res) => {
    const { commentId } = req.params
    try {
        const comment = await Comment.findById(commentId)
        if (!comment) return res.status(404).json({ message: "this comment doesn't exist" })
        if (comment.author !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: "your'e not authorized to delete this comment" })
        const post=await Post.findById(comment.post)
            await comment.deleteOne()
            if(post){post.commentCount= Math.max(0,post.commentCount -1 );
                await post.save
            }
        return res.status(200).json({ message: "comment successfully deleted", comment })

    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
}
exports.editComment= async (req,res) => {
    const {commentId}= req.params
    const {content}= req.body
    try {
        let comment= Comment.findById(commentId)
        if (!comment) return res.status(404).json({ message: "this comment doesn't exist" })
        if (!content) return res.status(400).json({ message: "input edited comment" })
         comment.content=content
        comment.save()
        return res.status(200).json({ message: "comment successfully updated", comment })
            
        
    } catch (error) {
                return res.status(500).json({ error: error.message });

    }
}

exports.getAllCommentsByUser= async (req,res) => {
    const {userid}=req.params
    try {
        const comments= await Comment.find({author:userid}).populate('post','title').populate("author","name,email")
        if(!comments|| comments.length===0) return res.status(404).json({message:"no comments for this user"})
        return res. status(200).json({message:"comments retrieved successfully", comments})
    } catch (error) {
        
    }    
}
exports.getCommentUnderPost= async (req,res) => {
    const {postid}= req.params
    try {
        const comments= await Comment.find({post:postid}).populate('user','name email')
        return res.status(200).json({message:"comments Successfully retrieved", comments})
    } catch (error) {
                return res.status(500).json({ error: error.message });
    }

    
} 