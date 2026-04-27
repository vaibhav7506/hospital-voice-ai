const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readJsonFile, writeJsonFile } = require("../utils/jsonStore");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const contacts = await readJsonFile("contacts.json");
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { patient_name, phone_number, doctor_name, appointment_date } = req.body;

    if (!patient_name || !phone_number) {
      return res.status(400).json({ error: "patient_name and phone_number are required." });
    }

    const contacts = await readJsonFile("contacts.json");
    const newContact = {
      id: uuidv4(),
      patient_name,
      phone_number,
      doctor_name: doctor_name || "",
      appointment_date: appointment_date || "",
      status: "pending",
      created_at: new Date().toISOString()
    };

    contacts.push(newContact);
    await writeJsonFile("contacts.json", contacts);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Failed to add contact." });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { contacts: incomingContacts } = req.body;

    if (!Array.isArray(incomingContacts) || incomingContacts.length === 0) {
      return res.status(400).json({ error: "contacts must be a non-empty array." });
    }

    const contacts = await readJsonFile("contacts.json");
    const preparedContacts = incomingContacts
      .filter((row) => row.patient_name && row.phone_number)
      .map((row) => ({
        id: uuidv4(),
        patient_name: row.patient_name,
        phone_number: row.phone_number,
        doctor_name: row.doctor_name || "",
        appointment_date: row.appointment_date || "",
        status: "pending",
        created_at: new Date().toISOString()
      }));

    contacts.push(...preparedContacts);
    await writeJsonFile("contacts.json", contacts);

    res.status(201).json({
      inserted: preparedContacts.length,
      contacts: preparedContacts
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add bulk contacts." });
  }
});

module.exports = router;
