import { clerkClient } from "@clerk/express";

//Middleware to userid, and if it has premium plan


export const auth = async (req, res, next) => {
    try {

        const authData = await req.auth();

        // Check if token exists
        if (!authData || !authData.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
        }

        const {userId, has} = authData;
        const hasPremiumPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId)

        const metadata = user.privateMetadata || {};

        let free_usage = metadata.free_usage || 0;
        let last_reset = metadata.last_reset || null;

        // Reset usage if new day
        const today = new Date().toDateString();

        if (last_reset !== today) {
        free_usage = 0;

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
            ...metadata,
            free_usage: 0,
            last_reset: today,
            },
        });
        }

        if (!hasPremiumPlan) {
            req.free_usage = free_usage;
        } else {
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free'
        next();

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

