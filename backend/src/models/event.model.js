import mongoose ,{Schema} from "mongoose"

const eventschema=new Schema({
   
    name:{
        type :String,
        required:true,
        default:"",  
        trim:true,
    }
    ,
      description:{
        type :String,
        required:true,
        default:"",  
        trim:true,    },

        date:{
            type:Date,
            required:true,
            default:Date.now
        },
        ownerId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        isPublic:{
            type:Boolean,
            default:true
        },
        invitedUsers:[{
            type:Schema.Types.ObjectId,
            ref:"User"
        }],




},{timestamps:true}
)

const Event =mongoose.model("Event",eventschema)
export {Event};