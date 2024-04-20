// Import necessary modules
import express from 'express';
import Tenant from '../models/tenantModel.js';
import Unit from '../models/unitModel.js'; // Assuming there's a Unit model
import { isAuth, isSuperAdmin } from '../utils.js'; // Assuming only isAuth and isSuperAdmin are needed

// Create a router
const tenantRouter = express.Router();
tenantRouter.post('/addtenant', isAuth, isSuperAdmin, async (req, res) => {
    try {
        const {
            name,
            email,
            contact,
            nid,
            licenseno,
            companyname,
            passport,
            address,
            ownerId,
            property,
            floorId,
            unitId,
            propertyType,
            contractInfo,
            status,
        } = req.body;

        // Check if any required fields are missing
        const requiredFields = [ 'contact', 'ownerId', 'property', 'floorId', 'unitId', 'propertyType', 'contractInfo'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Field '${field}' is required` });
            }
        }

        // Set paidAmount to 0 if not provided
        if (!contractInfo.paidAmount) {
            contractInfo.paidAmount = 0;
        }

        // Find the last tenant to get the last contract number
        const lastTenant = await Tenant.findOne({}, {}, { sort: { 'createdAt' : -1 } });

        let lastContractNo = 0;
        if (lastTenant && lastTenant.contractNo) {
            lastContractNo = parseInt(lastTenant.contractNo.split('-')[1], 10);
        }

        // Increment the last contract number by 1
        const newContractNo = `JG-${lastContractNo + 1}`;

        // Create a new tenant instance with the new contract number
        const newTenant = new Tenant({
            name,
            email,
            contact,
            nid,
            licenseno,
            companyname,
            passport,
            address,
            ownerId,
            property,
            floorId,
            unitId,
            propertyType,
            contractInfo,
            status,
            contractNo: newContractNo,  // Assign the new contract number
        });

        // Save the new tenant to the database
        const savedTenant = await newTenant.save();

        // Update the corresponding units to mark them as occupied
        for (const id of unitId) {
            await Unit.findByIdAndUpdate(id, { occupied: true }, { new: true });
        }

        // Send a success response
        res.status(201).json(savedTenant);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all tenants and populate by owner, apartments, floor, and units
tenantRouter.get('/alltenants', async (req, res) => {
    try {
        const tenants = await Tenant.find({})
            .populate('ownerId', 'name email nationality emid contact') // Populate owner with only name
            .populate('property') // Populate property with only name
            .populate('floorId', 'name') // Populate floor with only number
            .populate('unitId'); // Populate unit with only number

        res.status(200).json(tenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to get details of a single tenant by ID and populate by owner, apartments, floor, and units
tenantRouter.get('/tenant/:id', async (req, res) => {
    const tenantId = req.params.id; // Get tenant ID from URL parameter

    try {
        const tenant = await Tenant.findById(tenantId)
            .populate('ownerId', 'name email nationality emid contact') // Populate owner with only name
            .populate('property') // Populate property with only name
            .populate('floorId', 'name') // Populate floor with only number
            .populate('unitId'); // Populate unit with only number

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.status(200).json(tenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

 
// Route to get all tenants of an owner by ownerId
tenantRouter.get('/tenants-by-owner/:ownerId', async (req, res) => {
    const ownerId = req.params.ownerId; // Get ownerId from URL parameter

    try {
        const tenants = await Tenant.find({ ownerId })
            .populate('ownerId', 'name email nationality emid contact') // Populate owner with specified fields
            .populate('property') // Populate property with only name
            .populate('floorId', 'name') // Populate floor with only number
            .populate('unitId'); // Populate unit with only number

        res.status(200).json(tenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to update payment information for a specific tenant and PDC
tenantRouter.put('/:tenantId/pdc/:pdcId/payments', async (req, res) => {
    try {
        const { tenantId, pdcId } = req.params;
        const { paymentmethod, paymentstatus, amount, date,  checkorinvoice } = req.body;

        // Find the tenant by ID
        const tenant = await Tenant.findById(tenantId);

        // Find the PDC by ID
        const pdcIndex = tenant.contractInfo.pdc.findIndex(pdc => pdc._id.toString() === pdcId);
        if (pdcIndex === -1) {
            return res.status(404).json({ error: 'PDC not found' });
        }

        // Calculate new paidAmount
        const newPaidAmount = (Number(tenant.contractInfo.paidAmount) || 0) + Number(amount);

        // Update payment details
        tenant.contractInfo.payment.push({ paymentmethod, paymentstatus, amount, date ,checkorinvoice });
        tenant.contractInfo.paidAmount = newPaidAmount;

        // Remove the PDC
        tenant.contractInfo.pdc.splice(pdcIndex, 1);

        // Save the updated tenant
        await tenant.save();

        res.status(200).json({ message: 'Payment information updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Export the router
export default tenantRouter;
