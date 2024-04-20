import mongoose from 'mongoose';

const { Schema } = mongoose;

const tenantSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    contact: String,
    nid: String,
    licenseno: String,
    companyname: String,
    passport: String,
    address: String,
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: [{
        type: Schema.Types.ObjectId,
        ref: 'Property'
    }],
    floorId: {
        type: Schema.Types.ObjectId,
        ref: 'Floor'
    },
    unitId: [{
        type: Schema.Types.ObjectId,
        ref: 'Unit'
    }],  // Change to an array of ObjectId
    propertyType: {
        type: String,
        enum: ['apartments'],
        required: true
    },
    contractInfo: {
        startingDate: {
            type: Date,
            required: true
        },
        securitydeposite: String,
        graceperiod: String,
        numberofoccupants: String,
        Waterandelecbill: {
            type: String,
            enum: ['owner', 'tenant']
        },
        pet: Boolean,
        usage: {
            type: String,
            enum: ['commercial', 'residential']
        },
        monthsDuration: {
            type: Number,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalContractAmount: {
            type: Number,
            required: true
        },
        VAT: {
            type: Number,
        },
        otherCost: Number,
        parking: Boolean,
        parkingValue: Number,
        discount: Number,
        finalAmount: {
            type: Number,
            required: true
        },
        paidAmount: Number,
        bank: String,
        totalChecks: Number,
        pdc: [{
            checkNumber: String,
            bank: String,
            date: Date,
            amount: Number,
        }],
        payment: [{
            paymentmethod: String,
            paymentstatus: String,
            amount: Number,
            checkorinvoice: String,
            date: Date,
        }]
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    contractNo: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
