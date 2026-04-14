import Creation from "../models/creations.js";

export const getUserCreations = async (req, res) => {
    try {
        
        const {userId} = req.auth();

        const creations = await Creation
        .find({userId})
        .sort({createdAt: -1})

        res.json({success: true, creations})

    } catch (error) {
        res.json({success: false, message: error.message}) 
    }
}

export const getPublishedCreations = async (req, res) => {
    try {
        const creations = await Creation
        .find({publish: true})
        .sort({createdAt: -1})

        res.json({success: true, creations})

    } catch (error) {
        res.json({success: false, message: error.message}) 
    }
}

export const toggleLikeCreations = async (req, res) => {
    try {
        
        const {userId} = req.auth();
        const {id} = req.body;

        const creation = await Creation.findById(id)

        if (!creation) {
            return res.json({success: false, message: 'Creation not found'})  
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;
        
        if (currentLikes.includes(userIdStr)) {
            creation.likes = creation.likes.filter(user => user !== userIdStr)
            message = 'Creation Unliked'
        } else {
            creation.likes.push(userIdStr);
            message = 'Creation Liked'
        }

        await creation.save();

        res.json({success: true, message})

    } catch (error) {
        res.json({success: false, message: error.message}) 
    }
}