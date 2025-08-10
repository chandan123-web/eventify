import mongoose,{ Schema } from 'mongoose';

const mediaSchema = new Schema({
   eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true
   },
   file:{
      type: String,
      required: true
   },

   uploaderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   tags:[{
      type: String,
      required: true
   }],
   uploadDate:{
        type: Date,
        default: Date.now
   },
   isApproved: {
      type: Boolean,
      default: false
   }


},{timestamps: true});

export const Media = mongoose.model('Media', mediaSchema);