import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary'
import { PDFParse } from "pdf-parse";
import Creation from "../models/creations.js";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const {userId} = req.auth();
        const  {prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        const tokenMap = {
            800: 1500,
            1200: 2200,
            1600: 3000
        }

        if(plan !== 'premium' && free_usage >= 10) {
            return res.json({success: false, message: 'Your free limit has been reached — upgrade to Premium for unlimited use'})
        }

        const response = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [{
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: tokenMap[length] || 2000
        });

        const content = response.choices[0].message.content;

        await Creation.create({
            userId,
            prompt,
            content,
            creationType: 'article'
        })

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({success: true, content})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message}) 
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const  { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10) {
            return res.json({success: false, message: 'Your free limit has been reached — upgrade to Premium for unlimited use'})
        }

        const response = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [{
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000
        });
        const content = response.choices[0].message.content;

        await Creation.create({
            userId,
            prompt,
            content,
            creationType: 'blog-title'
        })

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({success: true, content})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})  
    }
}

export const generateImage = async (req, res) => {
    try {
        const {userId} = req.auth();
        const  {prompt, publish } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10) {
            return res.json({success: false, message: 'Your free limit has been reached — upgrade to Premium for unlimited use'})
        }

        const formData = new FormData()
        formData.append('prompt', prompt)
        const response = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`

        const {secure_url} = await cloudinary.uploader.upload(base64Image)

        await Creation.create({
            userId,
            prompt,
            content: secure_url,
            creationType: 'image',
            publish: publish ?? false
        })

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({success: true, content: secure_url})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const {userId} = req.auth();
        const  image = req.file;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10) {
            return res.json({success: false, message: 'Your free limit has been reached — upgrade to Premium for unlimited use'})
        }


        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        })

        await Creation.create({
            userId,
            prompt: 'Remove background from image',
            content: secure_url,
            creationType: 'image'
        })

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({success: true, content: secure_url})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const {userId} = req.auth();
        const  image = req.file;
        const { object } = req.body
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10) {
            return res.json({success: false, message: 'Your free limit has been reached — upgrade to Premium for unlimited use'})
        }


        const {public_id} = await cloudinary.uploader.upload(image.path)

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{
                effect: `gen_remove:${object}`
            }],
            resource_type: 'image'
        })

        await Creation.create({
            userId,
            prompt: `Remove ${object} from image`,
            content: imageUrl,
            creationType: 'image'
        })

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({success: true, content: imageUrl})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const resumeReview = async (req, res) => {
    try {
        const {userId} = req.auth();
        const  resume = req.file;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10) {
            return res.json({success: false, message: 'Your free limit has been reached — upgrade to Premium for unlimited use'})
        }

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({success: false, message: 'Resume file size should not exceed 5MB.'})
        }

        const parser = new PDFParse({ url: resume.path });
        const result = await parser.getText();

        const prompt = `Review the following resume and provide constructive feedback based on its strengths, weaknesses and areas of improvement. Resume Content:\n\n${result.text}`

        const response = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [{
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const content = response.choices[0].message.content; 

        await Creation.create({
            userId,
            prompt: 'Review the uploaded resume',
            content,
            creationType: 'resume-review'
        })

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({success: true, content: content})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}