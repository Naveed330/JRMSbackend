import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Maintenance from '../models/maintenanceModel.js';
import { isAdmin, isAuth, isSuperAdmin } from '../utils.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const maintenanceRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dn1oz4vt9',
    api_key: '376365558848471',
    api_secret: 'USb46ns9p4V7fAWMppTP54xiv00'
});

// Use CloudinaryStorage to configure multer for image upload
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});

const upload = multer({ storage });

// Middleware for Cloudinary image upload
const uploadToCloudinary = upload.single('image');

maintenanceRouter.post(
    '/addnewcost',
    isAuth, // Ensure user is authenticated
    uploadToCloudinary, // Middleware for image upload
    expressAsyncHandler(async (req, res) => {
        const { owner, property, floor, unit, maintenanceType, amount, date } = req.body;

        // Ensure that an image was uploaded
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload an image' });
        }

        const image = req.file.path;

        try {
            const newMaintenance = new Maintenance({
                owner,
                property,
                floor,
                unit,
                maintenanceType,
                amount,
                date,
                image
            });

            const maintenance = await newMaintenance.save();

            res.status(201).send({
                _id: maintenance._id,
                owner: maintenance.owner,
                property: maintenance.property,
                floor: maintenance.floor,
                unit: maintenance.unit,
                maintenanceType: maintenance.maintenanceType,
                amount: maintenance.amount,
                date: maintenance.date,
                image: maintenance.image
            });
        } catch (error) {
            console.error('Error adding maintenance cost:', error);
            res.status(500).send({ message: 'Error adding maintenance cost' });
        }
    })
);


// Get all maintenance records 
maintenanceRouter.get(
    '/all-maintenance-record',
    isAuth, isSuperAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const maintenances = await Maintenance.find({})
                .populate('owner', 'name')   // Populate owner with 'name' field from User model
                .populate('property', 'name') // Populate property with 'name' field from Property model
                .populate('floor', 'name')    // Populate floor with 'name' field from Floor model
                .populate('unit', 'unitNo type'); // Populate unit with 'unitNo' and 'type' fields from Unit model
            
            res.status(200).send(maintenances);
        } catch (error) {
            console.error('Error fetching maintenance records:', error);
            res.status(500).send({ message: 'Error fetching maintenance records' });
        }
    })
);

// Get all maintenance records by owner ID
maintenanceRouter.get(
    '/by-owner',
    isAuth, // Ensure user is authenticated
    expressAsyncHandler(async (req, res) => {
        const ownerId = req.query.ownerId; // Get ownerId from query parameters
 
        if (!ownerId) {
            return res.status(400).send({ message: 'Owner ID is required' });
        }

        try {
            const maintenances = await Maintenance.find({ owner: ownerId })
                .populate('owner', 'name')   // Populate owner with 'name' field from User model
                .populate('property', 'name') // Populate property with 'name' field from Property model
                .populate('floor', 'name')    // Populate floor with 'name' field from Floor model
                .populate('unit', 'unitNo type'); // Populate unit with 'unitNo' and 'type' fields from Unit model
            
            res.status(200).send(maintenances);
        } catch (error) {
            console.error('Error fetching maintenance records:', error);
            res.status(500).send({ message: 'Error fetching maintenance records' });
        }
    })
);

// Get all maintenance records by property ID
maintenanceRouter.get(
    '/by-property',
    isAuth, // Ensure user is authenticated
    expressAsyncHandler(async (req, res) => {
        const propertyId = req.query.propertyId; // Get propertyId from query parameters

        if (!propertyId) {
            return res.status(400).send({ message: 'Property ID is required' });
        }

        try {
            const maintenances = await Maintenance.find({ property: propertyId })
                .populate('owner', 'name')   // Populate owner with 'name' field from User model
                .populate('property', 'name') // Populate property with 'name' field from Property model
                .populate('floor', 'name')    // Populate floor with 'name' field from Floor model
                .populate('unit', 'unitNo type'); // Populate unit with 'unitNo' and 'type' fields from Unit model
            
            res.status(200).send(maintenances);
        } catch (error) {
            console.error('Error fetching maintenance records:', error);
            res.status(500).send({ message: 'Error fetching maintenance records' });
        }
    })
);




export default maintenanceRouter;
