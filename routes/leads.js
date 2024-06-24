import express from "express";
import "dotenv/config.js";
import Lead from "../models/Lead.js";
import MasterLead from '../models/Masterlead.js';

const router = express.Router();

// checking api
router.get("/", (req, res) => {
  res.status(200).send({
    msg: "lead APIs are working successfully",
  });
});

// Create a new lead
router.post('/leads', async (req, res) => {
  const lead = new Lead({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    currctc: req.body.currctc,
    expctc: req.body.expctc,
    noticeper: req.body.noticeper,
    date: req.body.date || new Date(),
    status: req.body.status || "not assigned",
    additionalFields: req.body.additionalFields || {}
  });
  
  try {
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all leads
router.get('/leads', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET lead by id
router.get('/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE lead by id
router.delete('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.remove();
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const oldStatus = lead.status;
    lead.name = req.body.name || lead.name;
    lead.email = req.body.email || lead.email;
    lead.phone = req.body.phone || lead.phone;
    lead.location = req.body.location || lead.location;
    lead.currctc = req.body.currctc || lead.currctc;
    lead.expctc = req.body.expctc || lead.expctc;
    lead.noticeper = req.body.noticeper || lead.noticeper;
    lead.phone = req.body.phone || lead.phone;
    lead.date = req.body.date || lead.date;
    lead.status = req.body.status || lead.status;
    lead.additionalFields = req.body.additionalFields || lead.additionalFields;

    if (lead.status === "done" && oldStatus !== "done") {
      const masterLead = new MasterLead({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        location: lead.location,
        currctc: lead.currctc,
        expctc: lead.expctc,
        noticeper: lead.noticeper,
        date: lead.date,
        status: lead.status,
        additionalFields: lead.additionalFields
      });

      try {
        const savedMasterLead = await masterLead.save();
        await Lead.findByIdAndDelete(lead._id); // Delete the lead from the Lead collection
        return res.json({ message: 'Lead moved to master collection and deleted from lead collection', masterLead: savedMasterLead });
      } catch (err) {
        return res.status(500).json({ message: 'Error saving to master collection or deleting lead', error: err.message });
      }
    }

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}); 


export default router;
