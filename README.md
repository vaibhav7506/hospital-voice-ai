# 🏥 MediCall CRM - Healthcare Communication System

A professional healthcare CRM system designed to reduce patient no-shows through automated appointment reminders powered by Bolna AI.

## 🌟 Features

### 📊 **Dashboard Analytics**
- Real-time patient statistics and call metrics
- Appointment confirmation rates and outcomes
- Auto-refreshing data with manual refresh controls
- Beautiful visual charts and progress indicators
- Key performance metrics tracking

### 👥 **Patient Management**
- Add individual patients with detailed information
- Bulk CSV import for patient data
- Patient status tracking (Pending, Confirmed, Rescheduled, No Answer)
- Searchable patient directory
- Professional data table with status badges

### 📞 **Call Automation**
- One-click call triggering for patients
- Real-time call status updates
- Call transcripts and recording links
- Call history and analytics
- Integration with Bolna AI voice agents

### 🎨 **Professional UI/UX**
- Modern, healthcare-focused design
- Responsive layout for all devices
- Enhanced hover effects and micro-interactions
- Loading states and error handling
- Accessibility-focused interface

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Bolna API key and Agent ID
- Git for cloning

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bolna-healthcare-crm
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   **Backend (.env):**
   ```env
   PORT=5000
   FRONTEND_ORIGIN=http://localhost:5173
   BOLNA_API_URL=https://api.bolna.dev/v1
   BOLNA_API_KEY=your_bolna_api_key_here
   BOLNA_AGENT_ID=your_agent_id_here
   ```
   
   **Frontend (.env):**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

5. **Start the Application**
   
   **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   
   **Start Frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📋 Usage Guide

### Adding Patients

1. **Individual Patient:**
   - Navigate to "Patients" page
   - Fill in patient details (Name and Phone are required)
   - Click "Add Patient"

2. **Bulk Import:**
   - Prepare CSV file with columns: `patient_name, phone_number, doctor_name, appointment_date`
   - Use the "Bulk Import" feature to upload the file
   - System will validate and import all valid records

### Making Calls

1. **Single Call:**
   - Go to Patients page
   - Find the patient in the directory
   - Click "Call Now" button
   - Monitor call status in real-time

2. **Monitoring Calls:**
   - Visit "Call Logs" page
   - View call history, transcripts, and recordings
   - Auto-refresh updates call status every 10 seconds

### Dashboard Analytics

- View real-time statistics on patient confirmations
- Monitor call success rates
- Track appointment outcomes
- Use refresh controls for manual updates

## 🔧 Configuration

### Bolna AI Integration

To enable real calls:

1. **Get Bolna API Credentials:**
   - Sign up at [Bolna AI](https://bolna.dev)
   - Create a voice agent for appointment reminders
   - Note your API key and Agent ID

2. **Configure Environment:**
   - Add credentials to backend `.env` file
   - Restart the backend server

3. **Test Integration:**
   - Add a test patient
   - Trigger a call to verify API connectivity

### CSV Import Format

```csv
patient_name,phone_number,doctor_name,appointment_date
John Doe,+1234567890,Dr. Smith,2024-01-15
Jane Smith,+0987654321,Dr. Johnson,2024-01-16
```

**Required Fields:**
- `patient_name` - Patient's full name
- `phone_number` - Contact phone number with country code

**Optional Fields:**
- `doctor_name` - Assigned doctor
- `appointment_date` - Scheduled appointment date

## 🏗️ Architecture

### Backend (Node.js + Express)
```
backend/
├── index.js              # Main server entry point
├── routes/
│   ├── contacts.js        # Patient management endpoints
│   ├── calls.js          # Call triggering and management
│   └── webhook.js       # Bolna webhook handlers
├── utils/
│   └── jsonStore.js     # JSON file storage utilities
├── data/
│   ├── contacts.json     # Patient data storage
│   └── calls.json       # Call history storage
└── package.json
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx   # Navigation component
│   ├── pages/
│   │   ├── Dashboard.jsx  # Analytics dashboard
│   │   ├── Contacts.jsx   # Patient management
│   │   └── CallLogs.jsx   # Call history
│   ├── api.js            # API client functions
│   ├── styles.css        # Global styles
│   └── App.jsx           # Main application component
├── index.html
└── package.json
```

## 📊 API Endpoints

### Contacts
- `GET /api/contacts` - List all patients
- `POST /api/contacts` - Add new patient
- `POST /api/contacts/bulk` - Bulk import patients

### Calls
- `GET /api/calls` - List all calls
- `POST /api/calls/trigger/:id` - Trigger call for patient

### Webhooks
- `POST /api/webhook/bolna` - Receive Bolna call updates

### Health
- `GET /health` - Server health check

## 🎯 Business Impact

### Problem Solved
- **Patient No-Shows**: Reduces missed appointments through automated reminders
- **Staff Efficiency**: Eliminates manual calling processes
- **Patient Experience**: Professional, timely communication

### Key Metrics
- **Confirmation Rate**: Track appointment confirmation percentage
- **Call Success Rate**: Monitor successful patient contacts
- **Rescheduling**: Capture patients who need new appointments
- **ROI Measurement**: Quantify time and cost savings

## 🔒 Security Considerations

- API keys should be kept secure and not committed to version control
- Patient data is stored locally in JSON files (production should use database)
- CORS is configured for frontend origin only
- Input validation on all API endpoints

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
FRONTEND_ORIGIN=https://your-domain.com
BOLNA_API_URL=https://api.bolna.dev/v1
BOLNA_API_KEY=production_api_key
BOLNA_AGENT_ID=production_agent_id
```

### Database Migration
For production use, replace JSON file storage with:
- PostgreSQL for patient data
- Redis for session management
- Proper backup and recovery systems

### Monitoring
- Implement application logging
- Set up health check monitoring
- Monitor API rate limits with Bolna
- Track business metrics and KPIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting guide below
- Review Bolna AI documentation for API issues

## 🔧 Troubleshooting

### Common Issues

**Calls not triggering:**
- Verify Bolna API credentials in `.env`
- Check backend server logs for API errors
- Ensure frontend can reach backend API

**Patients not appearing:**
- Check browser console for errors
- Verify backend is running on port 5000
- Check CORS configuration

**CSV import failing:**
- Ensure CSV has correct headers
- Check for special characters in data
- Verify file encoding is UTF-8

### Development Tips

- Use browser DevTools to monitor API calls
- Check network tab for failed requests
- Enable verbose logging in development mode
- Test with mock data before using real API

---

**Built with ❤️ for healthcare providers**
