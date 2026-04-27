const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function getContacts() {
  const res = await fetch(`${API_BASE_URL}/api/contacts`);
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}

export async function createContact(payload) {
  const res = await fetch(`${API_BASE_URL}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to create contact");
  return res.json();
}

export async function bulkCreateContacts(payload) {
  const res = await fetch(`${API_BASE_URL}/api/contacts/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to bulk add contacts");
  return res.json();
}

export async function getCalls() {
  const res = await fetch(`${API_BASE_URL}/api/calls`);
  if (!res.ok) throw new Error("Failed to fetch calls");
  return res.json();
}

export async function triggerCall(contactId) {
  const res = await fetch(`${API_BASE_URL}/api/calls/trigger/${contactId}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to trigger call");
  return res.json();
}
