const express = require("express");
const { readJsonFile, writeJsonFile } = require("../utils/jsonStore");

const router = express.Router();

router.post("/bolna", async (req, res) => {
  try {
    const {
      bolna_call_id,
      status,
      outcome,
      transcript,
      duration_seconds,
      recording_url
    } = req.body;

    if (!bolna_call_id) {
      return res.status(400).json({ error: "bolna_call_id is required." });
    }

    const calls = await readJsonFile("calls.json");
    const contacts = await readJsonFile("contacts.json");
    const call = calls.find((item) => item.bolna_call_id === bolna_call_id);

    if (!call) {
      return res.status(404).json({ error: "Call not found for bolna_call_id." });
    }

    const finalOutcome = outcome || status || "completed";
    const updatedCalls = calls.map((item) =>
      item.bolna_call_id === bolna_call_id
        ? {
            ...item,
            status: status || "completed",
            outcome: finalOutcome,
            transcript: transcript || item.transcript,
            duration_seconds: Number(duration_seconds || item.duration_seconds || 0),
            recording_url: recording_url || item.recording_url,
            updated_at: new Date().toISOString()
          }
        : item
    );

    const statusMap = {
      confirmed: "confirmed",
      rescheduled: "rescheduled",
      no_answer: "no_answer"
    };
    const mappedStatus = statusMap[finalOutcome] || "called";
    const updatedContacts = contacts.map((item) =>
      item.id === call.contact_id ? { ...item, status: mappedStatus } : item
    );

    await writeJsonFile("calls.json", updatedCalls);
    await writeJsonFile("contacts.json", updatedContacts);

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to process webhook." });
  }
});

module.exports = router;
