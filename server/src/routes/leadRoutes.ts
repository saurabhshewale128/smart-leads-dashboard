import express from "express";
import Lead from "../models/Lead";

const router = express.Router();


// GET All Leads
router.get("/", async (req, res) => {

  try {

    const leads = await Lead.find();

    res.json(leads);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
});


// CREATE Lead
router.post("/", async (req, res) => {

  try {

    const { name, email, status, source } = req.body;

    const newLead = new Lead({
      name,
      email,
      status,
      source,
    });

    await newLead.save();

    res.status(201).json({
      message: "Lead Created Successfully",
      newLead,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create lead",
    });
  }
});


// UPDATE Lead
router.put("/:id", async (req, res) => {

  try {

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Lead Updated Successfully",
      updatedLead,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update lead",
    });
  }
});


// DELETE Lead
router.delete("/:id", async (req, res) => {

  try {

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      message: "Lead Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete lead",
    });
  }
});

export default router;