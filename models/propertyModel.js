import mongoose from 'mongoose';

const { Schema } = mongoose;

const propertySchema = new Schema({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: async function (userId) {
                const User = mongoose.model('User');
                const user = await User.findById(userId);
                return user && user.role === 'owner';
            },
            message: 'User does not have owner role.'
        }
    },
    cname: String,
    ccontact: String,
    cemail: String, 
    address: String,
    contactinfo: String,
    propertyImage: String,
    status: {
        type: String,
        enum: ['enable', 'disable'],
        default: 'enable'
    },
    propertyType: {
        type: String,
        enum: ['apartments']
    },
    municipality: String, // Add Municipality field
    zone: String, // Add Zone field
    sector: String, // Add Sector field
    roadName: String, // Add Road Name field
    plotNo: String, // Add Plot No field
    plotAddress: String, // Add Plot Address field
    onwaniAddress: String, // Add Onwani Address field
    propertyNo: String, // Add Property No field
    propertyRegistrationNo: String, // Add Property Registration No field
    floors: [{
        type: Schema.Types.ObjectId,
        ref: 'Floor'
    }],
    // Added missing comma here
    city: String,
    area: String,
    bondtype: String,
    bondno: String,
    bonddate: String,
    govermentalno: String,
    pilotno: String,
    buildingname: String,
    nameandstreet: String,
    propertytype: String,
    description: String,
    propertyno:String,
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
