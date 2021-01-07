import PostMessage from '../models/postMessage.js';

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


export const createPost = asyncHandler(async (req, res)=> {
    const { title, message, selectedFile, creator, tags } = req.body;

    const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })
    await newPostMessage.save();
    res.status(201).json(newPostMessage );
}, 409);
