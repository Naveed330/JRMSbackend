import mongoose from 'mongoose';

const { Schema } = mongoose;

const floorSchema = new Schema({
    name: String,
    units: [{
        type: Schema.Types.ObjectId,
        ref: 'Unit'
    }]
});

const Floor = mongoose.model('Floor', floorSchema);

export default Floor;
