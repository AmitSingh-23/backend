import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
    },
    video: {
        type: String,
        required: true,
        trim: true,
    },
        creator:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,

        },
        views:{
            type:number,
            default:0,
        }


    
});
videoSchema.plugin(mongoose.aggregatePaginate);
export default mongoose.model("Video", videoSchema);