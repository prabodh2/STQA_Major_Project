const express = require('express');
const EnquiryModel = require('../models/enquiry.model');
const { authmiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Create a new enquiry
router.post('/', async (req, res) => {
    try {
        const enquiry = new EnquiryModel(req.body);
        await enquiry.save();
        res.status(201).json({
            message: 'Enquiry submitted successfully',
            enquiry
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error submitting enquiry',
            error: error.message
        });
    }
});

// Get all enquiries (protected route for admin)
router.get('/', authmiddleware, async (req, res) => {
    try {
        const enquiries = await EnquiryModel.find()
            .sort({ createdAt: -1 });
        res.status(200).json(enquiries);
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching enquiries',
            error: error.message
        });
    }
});

// Update enquiry status (protected route for admin)
router.patch('/:id', authmiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const enquiry = await EnquiryModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        
        res.status(200).json({
            message: 'Enquiry status updated successfully',
            enquiry
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating enquiry status',
            error: error.message
        });
    }
});

module.exports = router;
