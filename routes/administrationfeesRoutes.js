import express from 'express';
import AdministrationFee from '../models/administrationfeesModel.js';

const administrationfeeRouter = express.Router();

// Route to add administration fee data
administrationfeeRouter.post('/add-administration-fees', async (req, res) => {
    try {
        // Extract data from request body
        const {
            tenantId,
            contractIssuingFees,
            ejariFee,
            transferFees,
            terminationFees,
            contractExpiryFees,
            maintenanceSecurityDeposit,
            refundableGuarantee,
            lateRenewalFees,
            postponeChequeFees
        } = req.body;

        // Function to parse input value to number or return NaN if parsing fails
        const parseToNumber = value => {
            const parsedValue = parseFloat(value);
            return isNaN(parsedValue) ? undefined : parsedValue;
        };

        // Create a new AdministrationFee instance
        const administrationFee = new AdministrationFee({
            tenantId,
            contractIssuingFees: parseToNumber(contractIssuingFees),
            ejariFee: parseToNumber(ejariFee),
            transferFees: parseToNumber(transferFees),
            terminationFees: parseToNumber(terminationFees),
            contractExpiryFees: parseToNumber(contractExpiryFees),
            maintenanceSecurityDeposit: parseToNumber(maintenanceSecurityDeposit),
            refundableGuarantee: parseToNumber(refundableGuarantee),
            lateRenewalFees: parseToNumber(lateRenewalFees),
            postponeChequeFees: parseToNumber(postponeChequeFees)
        });

        // Save the administration fee data to the database
        const savedAdministrationFee = await administrationFee.save();

        res.status(201).json(savedAdministrationFee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Get all the adminstration Fees Record 
// Route to get all administration fee records and populate by tenantId
administrationfeeRouter.get('/all-administration-fees', async (req, res) => {
    try {
        const administrationFees = await AdministrationFee.find().populate('tenantId');
        res.status(200).json(administrationFees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Route to get administration fee records by tenantId
administrationfeeRouter.get('/administration-fees-by-tenant/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;

        const administrationFees = await AdministrationFee.find({ tenantId }).populate('tenantId');
        res.status(200).json(administrationFees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default administrationfeeRouter;
