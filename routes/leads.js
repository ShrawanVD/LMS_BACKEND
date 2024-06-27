import express from "express";
import "dotenv/config.js";
import Lead from "../models/Lead.js";
import MasterLead from "../models/Masterlead.js";

const router = express.Router();

// checking api
router.get("/", (req, res) => {
  res.status(200).send({
    msg: "lead APIs are working successfully",
  });
});

// Create a new lead
router.post("/create", async (req, res) => {
  const lead = new Lead({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    status: req.body.status || "not assigned",
    language: req.body.language,
    proficiencyLevel: req.body.proficiencyLevel,
    jobStatus: req.body.jobStatus,
    qualification: req.body.qualification,
    industry: req.body.industry,
    domain: req.body.domain,
    location: req.body.location,
    currentCTC: req.body.currentCTC,
    expectedCTC: req.body.expectedCTC,
    noticePeriod: req.body.noticePeriod,
    wfh: req.body.wfh,
    resumeLink: req.body.resumeLink,
    linkedinLink: req.body.linkedinLink,
    feedback: req.body.feedback,
    company: req.body.company,
    voiceNonVoice: req.body.voiceNonVoice,
    placedBy: req.body.placedBy,
  });

  try {
    const newLead = await lead.save();
    console.log("NewLead is: " + newLead);
    res.status(201).json(newLead);
  } catch (err) {
    console.error("Error saving lead:", err);
    res
      .status(500)
      .json({ message: "Failed to create lead", error: err.message });
  }
});

// GET all leads
router.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET lead by id
router.get("/leads/:id", async (req, res) => {
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
router.delete("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    console.log("Found lead:", lead); // Add this line for debugging

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.deleteOne();
    res.json({ message: "Lead deleted successfully" });
    console.log("Delete lead");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT particular lead
router.put("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const oldStatus = lead.status;

    // updating lead with new entries
    lead.name = req.body.name || lead.name;
    lead.email = req.body.email || lead.email;
    lead.phone = req.body.phone || lead.phone;
    lead.status = req.body.status || lead.status;
    lead.language = req.body.language || lead.language;
    lead.proficiencyLevel = req.body.proficiencyLevel || lead.proficiencyLevel;
    lead.jobStatus = req.body.jobStatus || lead.jobStatus;
    lead.qualification = req.body.qualification || lead.qualification;
    lead.industry = req.body.industry || lead.industry;
    lead.domain = req.body.domain || lead.domain;
    lead.location = req.body.location || lead.location;
    lead.currentCTC = req.body.currentCTC || lead.currentCTC;
    lead.expectedCTC = req.body.expectedCTC || lead.expectedCTC;
    lead.noticePeriod = req.body.noticePeriod || lead.noticePeriod;
    lead.wfh = req.body.wfh || lead.wfh;
    lead.resumeLink = req.body.resumeLink || lead.resumeLink;
    lead.linkedinLink = req.body.linkedinLink || lead.linkedinLink;
    lead.feedback = req.body.feedback || lead.feedback;
    lead.company = req.body.company || lead.company;
    lead.voiceNonVoice = req.body.voiceNonVoice || lead.voiceNonVoice;
    lead.placedBy = req.body.placedBy || lead.placedBy;

    // if status = done, delete from lead data and add into masterlead data
    if (lead.status === "Done" || "done" || "DONE" && oldStatus !== "done") {

      const masterLead = new MasterLead({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        language: lead.language,
        proficiencyLevel: lead.proficiencyLevel,
        jobStatus: lead.jobStatus,
        qualification: lead.qualification,
        industry: lead.industry,
        domain: lead.domain,
        location: lead.location,
        currentCTC: lead.currentCTC,
        expectedCTC: lead.expectedCTC,
        noticePeriod: lead.noticePeriod,
        wfh: lead.wfh,
        resumeLink: lead.resumeLink,
        linkedinLink: lead.linkedinLink,
        feedback: lead.feedback,
        company: lead.company,
        voiceNonVoice: lead.voiceNonVoice,
        placedBy: lead.placedBy
      });

      try {
        const savedMasterLead = await masterLead.save();
        await Lead.findByIdAndDelete(lead._id); // Delete the lead from the Lead collection
        return res.json({
          message:
            "Lead moved to master collection and deleted from lead collection",
          masterLead: savedMasterLead,
        });
      } catch (err) {
        console.log("error in transferring data into the masterlead");
        return res.status(500).json({
          message: "Error saving to master collection or deleting lead",
          error: err.message,
        });
      }
    }

    // if changes does not include change in status, keep it in lead data once updated
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
