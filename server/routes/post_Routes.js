const express = require('express');

const router = express.Router();
const Post = require('../model/Post');
const authenticate = require('../middleware/middleware')

router.post('/posts', authenticate, async(req,res)=>{
    console.log('inside posts route of posting image');
    const{body,image} = req.body;
    if(!body||!image){
        return res.send({error:'fill the complete details'});
    }
    console.log(body+" "+image+" "+req.user._id);

    try{
        const newPost = new Post({
            body,
            photo:image,
            postedBy:req.user._id,
        })
        const savedPost = await newPost.save();
        console.log(savedPost);
        res.status(201).send(savedPost); 
 
    }catch(error){
        return res.status(400).send({message: error})
    }
})

router.get('/allposts',authenticate, async (req, res) => {
    console.log("all post");
    try {
        const posts = await Post.find().populate('postedBy').exec();
        console.log(posts);
        res.status(200).json(posts.reverse());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/posts/:userId',authenticate,async(req,res)=>{
    console.log("/posts/:userId" + req.params.userId);
    try{
        const userId = req.params.userId;
        const posts = await Post.find({postedBy: userId,photo:{ $exists: true, $ne: null}})
        .populate('postedBy', '_id name')
        .exec();
        console.log(posts);
        res.status(200).json(posts);
    
        }catch(error){
        res.status(400).json({message: error});
    }
    
})


router.put('/saveLike', authenticate, async (req, res) => {
    const { userId, postId } = req.body;
    console.log('savelike' + userId);

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked this post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'User already liked the post' });
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $push: { likes: userId }
        }, { new: true });

        if (!updatedPost) {
            return res.status(401).json({ message: 'User not found or Post not updated' });
        }

        return res.status(200).json({ message: 'Like is added' });

    } catch (error) {
        console.error('Error saving like:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/saveunLike', authenticate, async (req, res) => {
    const { userId, postId } = req.body;
    console.log('saveunlike' + userId);

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already unliked this post
        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: 'User has not liked the post' });
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $pull: { likes: userId }
        }, { new: true });

        if (!updatedPost) {
            return res.status(401).json({ message: 'User not found or Post not updated' });
        }

        return res.status(200).json({ message: 'Like is removed' });

    } catch (error) {
        console.error('Error saving unlike:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.post('/addComment',authenticate, async (req, res) => {
    console.log('inside addcomment api');
    const { comment, postId } = req.body; 
    console.log(req.user._id);
    
    console.log(comment + " " + postId);
  
    if (!comment || !postId) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
  
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { comments: { comment, postedBy: req.user._id } }
        },
        { new: true }
      );
  
      res.status(201).json({ message: 'Comment added successfully', updatedPost });
    } catch (error) {
      console.error('Error in addComment route', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  


  router.get('/commentData/:postId',authenticate, async (req, res) => {
    const postId = req.params.postId;
  
    try {
      // Retrieve the post with comments and populate 'postedBy' in each comment
      const postWithComments = await Post.findById(postId)
        .populate({
          path: 'comments.postedBy',
          select: '_id name photo',
        })
        .exec();
  
      if (!postWithComments) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      console.log('Post with Comments:', postWithComments);
  
      // Extract and send only the comments
      const comments = postWithComments.comments || [];
  
      console.log('Comments:', comments);
  
      res.json(comments);
    } catch (error) {
      console.error('Error in commentData route', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  
  



module.exports = router;