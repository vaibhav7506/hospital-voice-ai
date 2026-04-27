const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readJsonFile, writeJsonFile } = require("../utils/jsonStore");

const router = express.Router();

async function triggerBolnaCall(contact) {
  const apiUrl = process.env.BOLNA_API_URL;
  const apiKey = process.env.BOLNA_API_KEY;
  const agentId = process.env.BOLNA_AGENT_ID;

  if (!apiUrl || !apiKey || !agentId) {
    return {
      bolna_call_id: `mock-${uuidv4()}`,
      provider: "mock",
      status: "in-progress"
    };
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      agent_id: agentId,
      phone_number: contact.phone_number,
      variables: {
        patient_name: contact.patient_name,
        doctor_name: contact.doctor_name,
        appointment_date: contact.appointment_date
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Bolna API failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return {
    bolna_call_id: data.call_id || data.id || `bolna-${uuidv4()}`,
    provider: "bolna",
    status: data.status || "in-progress"
  };
}

router.get("/", async (_req, res) => {
  try {
    const calls = await readJsonFile("calls.json");
    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch calls." });
  }
});

router.post("/trigger/:id", async (req, res) => {
  try {
    const contactId = req.params.id;
    const contacts = await readJsonFile("contacts.json");
    const calls = await readJsonFile("calls.json");
    const contact = contacts.find((item) => item.id === contactId);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    const bolnaResponse = await triggerBolnaCall(contact);

    const newCall = {
      id: uuidv4(),
      contact_id: contact.id,
      patient_name: contact.patient_name,
      phone_number: contact.phone_number,
      bolna_call_id: bolnaResponse.bolna_call_id,
      status: "in-progress",
      outcome: "pending",
      transcript: "",
      duration_seconds: 0,
      recording_url: "",
      provider: bolnaResponse.provider,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    calls.push(newCall);
    await writeJsonFile("calls.json", calls);

    const updatedContacts = contacts.map((item) =>
      item.id === contact.id ? { ...item, status: "called" } : item
    );
    await writeJsonFile("contacts.json", updatedContacts);

    res.status(201).json({
      message: "Call triggered successfully.",
      call: newCall
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to trigger call." });
  }
});

module.exports = router;
