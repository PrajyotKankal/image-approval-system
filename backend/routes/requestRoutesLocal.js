const express = require('express');
const router = express.Router();
const Request = require('../models/requestModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { protectAdmin } = require('../middleware/authMiddleware');




// POST: Submit a new request
router.post('/', async (req, res) => {

  console.log('📥 Incoming POST /api/requests:', req.body);

  const { userEmail, images } = req.body;

  if (!userEmail || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const newRequest = new Request({ userEmail, images });
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request' });
  }
});

// GET: Get all requests (for admin)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ requestedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// PUT: Approve or reject a request
  router.put('/:id', protectAdmin, async (req, res) => {

  const { status } = req.body;

  const approvedBy = req.user?.username || req.body.approvedBy || 'Unknown';


  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    await Request.findByIdAndUpdate(req.params.id, { status, approvedBy });

    res.json({ message: `Request marked as ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request' });
  }
});




// GET: Export approved requests to Excel
router.get('/export', async (req, res) => {
  try {
    const approvedRequests = await Request.find({ status: 'approved' }).sort({ requestedAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Approvals');

    // Header row
    worksheet.addRow(['Approved For (User)', 'Approved Image(s)',  'Approval Date']);
    

    approvedRequests.forEach(req => {
      const imageNames = req.images.map(img => img.filename).join(', ');
      worksheet.addRow([
        req.userEmail,
        imageNames,
        new Date(req.requestedAt).toLocaleDateString()
      ]);
    });


    const filePath = path.join(__dirname, '../exports/approvals_report.xlsx');

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, 'approvals_report.xlsx');
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

module.exports = router;



