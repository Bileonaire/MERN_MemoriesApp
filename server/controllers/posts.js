import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

function asyncHandler(cb, code){
    return async (req,res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            res.status(code).json({message: Error.message})
        }
    }
}

export const getPosts = asyncHandler(async (req, res)=>{
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
}, 404);

export const getPost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
}, 404);

export const createPost = asyncHandler(async (req, res)=> {
    const { title, message, selectedFile, creator, tags } = req.body;

    const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })
    await newPostMessage.save();
    res.status(201).json(newPostMessage );
}, 409);

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });

    res.json(updatedPost);
}

export default router;