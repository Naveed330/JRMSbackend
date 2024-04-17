import mongoose from 'mongoose';

const { Schema } = mongoose;

const unitSchema = new Schema({
    type: {
        type: String,
        enum: ['studio', '1BHK', '2BHK', '3BHK', 'penthouse','office'] 
    },
    occupied: {
        type: Boolean,
        default: false
    },
    premiseNo: String,
 
    unitRegNo: String,
    unitNo: String
});

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;
