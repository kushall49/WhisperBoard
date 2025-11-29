# WhisperBoard Backend API

Backend server for **WhisperBoard** - An anonymous doubt submission system connecting students and teachers.

## 🚀 Features

- **Anonymous Doubt Submission**: Students can submit doubts without revealing identity
- **Teacher Dashboard**: Teachers can view and answer doubts
- **RESTful API**: Clean REST endpoints for all operations
- **Firebase Firestore**: Cloud-based NoSQL database
- **CORS Enabled**: Frontend integration support
- **Validation**: Input validation and error handling
- **Security**: Helmet.js security headers

---

## 📁 Project Structure

```
backend/
├── config/
│   └── firestore.js          # Firebase configuration
├── routes/
│   ├── doubts.js             # Doubt CRUD operations
│   └── teacher.js            # Teacher authentication
├── middleware/
├── index.js                  # Express server entry point
├── package.json              # Dependencies
├── .env                      # Environment variables (create this)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── firestore.rules           # Firestore security rules
└── README.md                 # This file
```

---

## 🛠️ Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Firebase Project** - [Create one](https://console.firebase.google.com/)
- **Git** (optional, for version control)

---

## 📋 Setup Instructions

### Step 1: Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Follow the setup wizard

2. **Enable Firestore Database**
   - In Firebase Console, go to **Build** → **Firestore Database**
   - Click "Create database"
   - Start in **Test mode** (we'll add rules later)
   - Choose a location (e.g., us-central)

3. **Generate Service Account Key**
   - Go to **Project Settings** (gear icon) → **Service Accounts**
   - Click **"Generate New Private Key"**
   - Download the JSON file (keep it secure!)

4. **Get Firebase Credentials**
   - From the downloaded JSON file, extract:
     - `project_id`
     - `private_key_id`
     - `private_key`
     - `client_email`
     - `client_id`
     - `client_x509_cert_url`

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your Firebase credentials:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com

   PORT=5000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500
   DEMO_TEACHER_PASSWORD=teacher123
   ```

   ⚠️ **Important**: Keep the private key in quotes and preserve `\n` line breaks

### Step 4: Deploy Firestore Security Rules

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Accept default files or use `firestore.rules`

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Step 5: Run the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | API health status |
| POST | `/api/doubts` | Submit a new doubt |
| GET | `/api/doubts` | Get all doubts |
| GET | `/api/doubts?teacher=NAME` | Get doubts by teacher |
| GET | `/api/doubts/:id` | Get specific doubt |
| POST | `/api/doubts/:id/answer` | Submit answer |
| GET | `/api/doubts/stats/summary` | Get statistics |
| POST | `/api/teacher/login` | Teacher login |

For detailed API documentation and Postman testing, see [POSTMAN_TESTING.md](./POSTMAN_TESTING.md)

---

## 🔒 Security

### Environment Variables
- Never commit `.env` file to Git
- Use `.env.example` as a template
- Keep Firebase private key secure

### Firestore Rules
- Current rules allow anonymous read/write for development
- Update `firestore.rules` for production security
- Deploy rules: `firebase deploy --only firestore:rules`

### CORS
- Configure `ALLOWED_ORIGINS` in `.env`
- Whitelist only trusted domains in production

---

## 🧪 Testing

### Manual Testing with Postman
See [POSTMAN_TESTING.md](./POSTMAN_TESTING.md) for detailed test cases.

### Quick Test
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Submit a doubt
curl -X POST http://localhost:5000/api/doubts \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Database Systems",
    "courseCode": "CS301",
    "teacher": "Dr. Smith",
    "question": "What is the difference between SQL and NoSQL databases?"
  }'
```

---

## 📦 Dependencies

### Production
- **express**: Web framework
- **firebase-admin**: Firebase Admin SDK
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Security headers
- **morgan**: HTTP request logger

### Development
- **nodemon**: Auto-restart on file changes

---

## 🚀 Deployment

### Deploy to Heroku

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create whisperboard-api`
4. **Set environment variables**:
   ```bash
   heroku config:set FIREBASE_PROJECT_ID=your-project-id
   heroku config:set FIREBASE_PRIVATE_KEY="your-private-key"
   # ... set all other variables
   ```
5. **Deploy**: `git push heroku main`

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

### Deploy to Google Cloud Run

1. Build container: `gcloud builds submit --tag gcr.io/PROJECT-ID/whisperboard`
2. Deploy: `gcloud run deploy --image gcr.io/PROJECT-ID/whisperboard`

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-123` |
| `FIREBASE_PRIVATE_KEY` | Service account private key | `-----BEGIN PRIVATE KEY-----...` |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `firebase-adminsdk@...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `http://localhost:3000,...` |
| `DEMO_TEACHER_PASSWORD` | Demo teacher password | `teacher123` |

---

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install
```

### "Firebase Admin not initialized"
- Check `.env` file exists
- Verify all Firebase credentials are correct
- Ensure private key has proper line breaks (`\n`)

### "CORS Error" from Frontend
- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart server after changing `.env`

### "Port already in use"
- Change `PORT` in `.env`
- Or kill existing process: `lsof -ti:5000 | xargs kill -9`

---

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Express.js Documentation](https://expressjs.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [POSTMAN_TESTING.md](./POSTMAN_TESTING.md) - API testing guide
- [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) - Database schema

---

## 👥 Team

- **Member 1**: Frontend Development
- **Member 2**: Backend Development (Firebase + Express)

---

## 📄 License

MIT License - feel free to use this project for learning purposes.

---

## 🆘 Support

If you encounter any issues:
1. Check this README thoroughly
2. Review error logs in terminal
3. Verify Firebase credentials
4. Check Firestore rules are deployed
5. Ensure all dependencies are installed

---

**Happy Coding! 🎉**
