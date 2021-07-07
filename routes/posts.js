import express from 'express';

import {getPosts,createPost,updatePost,deletePost,likePost,getTrendingPosts} from '../controllers/posts.js'; //logic is defined in this file, so that writing many logics here doesn't make mushy
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/',getPosts);//localhost:5000/posts
router.get('/trending',getTrendingPosts);
router.post('/',auth,createPost);
router.patch('/:id',auth,updatePost);
router.delete('/:id',auth,deletePost);
router.patch('/:id/likepost',auth,likePost);
export default router;
