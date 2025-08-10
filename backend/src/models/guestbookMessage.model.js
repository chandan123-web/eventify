import mongoose,{ Schema } from 'mongoose';

const guestSchema = new Schema({
    
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    

},{timestamps: true});

const GuestMessage = mongoose.model('GuestMessage', guestSchema);
export { GuestMessage };