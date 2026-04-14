import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const creationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creationType: {
        type: String,
        enum: ["article", "blog-title", "image", "resume-review"],
        required: true
    },
    publish: {
        type: Boolean,
        default: false
    },
    likes: {
        type: [String],
        default: []
    }
},{
    timestamps: true
})

const Creation = mongoose.model('creation', creationSchema)

export default Creation