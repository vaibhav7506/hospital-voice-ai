import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  bulkCreateContacts,
  createContact,
  getContacts,
  triggerCall
} from "../api";

const emptyForm = {
  patient_name: "",
  phone_number: "",
  doctor_name: "",
  appointment_date: ""
};

export default function Contacts() {
  const [form, setForm] = useState(emptyForm);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      setContacts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onAddContact = async (event) => {
    event.preventDefault();
    
    // Basic validation
    if (!form.patient_name.trim() || !form.phone_number.trim()) {
      alert("Patient name and phone number are required!");
      return;
    }
    
    try {
      const newContact = await createContact(form);
      console.log("Contact added successfully:", newContact);
      
      // Reset form
      setForm(emptyForm);
      
      // Reload contacts
      await loadContacts();
      
      // Show success feedback
      setUploadStatus(`Successfully added ${form.patient_name}!`);
      setTimeout(() => setUploadStatus(""), 3000);
      
    } catch (error) {
      console.error("Failed to add contact:", error);
      setUploadStatus("Failed to add patient. Please try again.");
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const onCsvUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus("Processing...");
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const normalized = (result.data || []).map((row) => ({
            patient_name: row.patient_name || row.name || "",
            phone_number: row.phone_number || row.phone || "",
            doctor_name: row.doctor_name || "",
            appointment_date: row.appointment_date || ""
          })).filter(contact => contact.patient_name && contact.phone_number);

          await bulkCreateContacts({ contacts: normalized });
          setUploadStatus(`Successfully imported ${normalized.length} contacts`);
          await loadContacts();
          
          // Clear upload status after 3 seconds
          setTimeout(() => setUploadStatus(""), 3000);
        } catch (error) {
          setUploadStatus("Failed to import contacts");
          console.error("CSV import error:", error);
        }
      }
    });
  };

  const onTriggerCall = async (contactId) => {
    setBusyIds((prev) => [...prev, contactId]);
    try {
      await triggerCall(contactId);
      await loadContacts();
    } catch (error) {
      console.error("Failed to trigger call:", error);
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== contactId));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed": return "status-confirmed";
      case "rescheduled": return "status-rescheduled";
      case "no_answer": return "status-no-answer";
      case "called": return "status-called";
      case "pending": return "status-pending";
      default: return "status-pending";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading contacts...
      </div>
    );
  }

  return (
    <section>
      <div className="page-header">
        <h2>Patient Management</h2>
        <p className="page-subtitle">Add and manage patient contacts for appointment reminders</p>
      </div>

      <div className="content-grid">
        <div className="card add-contact-form">
          <h3>Add New Patient</h3>
          <form onSubmit={onAddContact}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="patient_name">Patient Name *</label>
                <input
                  id="patient_name"
                  name="patient_name"
                  placeholder="Enter patient name"
                  value={form.patient_name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone_number">Phone Number *</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone_number}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="doctor_name">Doctor Name</label>
                <input
                  id="doctor_name"
                  name="doctor_name"
                  placeholder="Enter doctor name"
                  value={form.doctor_name}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="appointment_date">Appointment Date</label>
                <input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  value={form.appointment_date}
                  onChange={onChange}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              <span>➕</span>
              Add Patient
            </button>
          </form>
          
          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.includes('Failed') ? 'error' : 'success'}`}>
              {uploadStatus}
            </div>
          )}
        </div>

        <div className="card bulk-upload">
          <h3>Bulk Import Patients</h3>
          <div className="upload-area">
            <div className="upload-instructions">
              <p><strong>CSV Format:</strong></p>
              <p>patient_name, phone_number, doctor_name, appointment_date</p>
              <p className="text-sm text-gray-500">First two columns are required</p>
            </div>
            <div className="upload-input">
              <label htmlFor="csvUpload" className="upload-label">
                <span className="upload-icon">📁</span>
                <span>Choose CSV File</span>
              </label>
              <input 
                id="csvUpload" 
                type="file" 
                accept=".csv" 
                onChange={onCsvUpload}
                className="hidden"
              />
            </div>
            {uploadStatus && (
              <div className={`upload-status ${uploadStatus.includes('Failed') ? 'error' : 'success'}`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card contacts-table">
        <div className="table-header">
          <h3>Patient Directory ({contacts.length})</h3>
          <div className="table-actions">
            <button onClick={loadContacts} className="btn-secondary">
              <span>🔄</span>
              Refresh
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone Number</th>
                <th>Doctor</th>
                <th>Appointment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500">
                    No patients found. Add your first patient above.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="font-semibold">{contact.patient_name}</td>
                    <td>{contact.phone_number}</td>
                    <td>{contact.doctor_name || <span className="text-gray-400">Not assigned</span>}</td>
                    <td>{contact.appointment_date || <span className="text-gray-400">Not scheduled</span>}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(contact.status)}`}>
                        {formatStatus(contact.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => onTriggerCall(contact.id)}
                        disabled={busyIds.includes(contact.id) || contact.status === "confirmed"}
                        className={`btn-${contact.status === "confirmed" ? "secondary" : "success"} ${busyIds.includes(contact.id) ? "loading" : ""}`}
                      >
                        {busyIds.includes(contact.id) ? (
                          <>
                            <div className="spinner-small"></div>
                            Calling...
                          </>
                        ) : contact.status === "confirmed" ? (
                          <>
                            <span>✅</span>
                            Confirmed
                          </>
                        ) : (
                          <>
                            <span>📞</span>
                            Call Now
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
