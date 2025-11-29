# ProfSensei - Anonymous Doubt Box 🎓

## Project Overview
**ProfSensei** is a simple anonymous doubt submission system for students. Students can submit questions without revealing their identity, and view the latest doubt submitted by the community.

## Project Team
- **Member 1 (You)**: Frontend Developer - HTML, CSS, JavaScript
- **Member 2**: Backend Developer - Database & API

---

## 📁 Project Structure

```
WhisperBoard/
│
├── index.html          # Main page - Submit Doubt Form
├── latest.html         # Secondary page - View Latest Doubt
├── style.css           # All styling for both pages
├── script.js           # JavaScript with API functions
└── README.md           # This file
```

---

## 🚀 Quick Start Guide

### Step 1: Setup Your Project
1. Download all files to your computer
2. Keep all files in the same folder (`WhisperBoard/`)
3. Open `script.js` in a text editor

### Step 2: Configure API Settings
In `script.js`, update these two constants:

```javascript
const API_URL = "YOUR_BACKEND_API_URL_HERE";  // Get this from Member 2
const API_KEY = "YOUR_API_KEY_HERE";          // Optional, if needed
```

**Example for Supabase:**
```javascript
const API_URL = "https://your-project.supabase.co/rest/v1/doubts";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### Step 3: Enable Authentication (if required)
If your backend needs an API key, uncomment these lines in `script.js`:

```javascript
const API_HEADERS = {
    "Content-Type": "application/json",
    "apikey": API_KEY,  // Uncomment this line
    "Authorization": `Bearer ${API_KEY}`,  // And this line if using Supabase
};
```

### Step 4: Run the Project
- **Option A**: Double-click `index.html` to open in browser
- **Option B**: Use VS Code Live Server extension
- **Option C**: Use any local server (Python, Node.js, etc.)

---

## 📄 File Descriptions

### 1. **index.html** - Main Form Page
- Contains the doubt submission form
- Two input fields: Subject and Question
- Submit button triggers `submitDoubt()` function
- Navigation to view latest doubts

**Key Features:**
- Form validation (required fields)
- Character limits (Subject: 100, Question: 1000)
- Success/error message display
- Responsive design for mobile

### 2. **latest.html** - Latest Doubt Display
- Shows the most recently submitted doubt
- Automatically fetches data when page loads
- Displays: Subject, Question, Timestamp
- Handles empty state (no doubts yet)

**Key Features:**
- Loading indicator while fetching
- Error handling for failed requests
- Retry button on error
- Back navigation to submit form

### 3. **style.css** - Complete Styling
- Modern, clean, professional design
- Purple gradient background
- Responsive layout (mobile-friendly)
- Smooth animations and transitions

**Style Sections:**
1. Reset & Base Styles
2. Container & Layout
3. Header Styles
4. Navigation Links
5. Form Elements
6. Buttons
7. Message Boxes
8. Loading Indicators
9. Doubt Display Card
10. Error Messages
11. Footer
12. Responsive Design (Mobile)

### 4. **script.js** - API Functions
Contains two main functions:

#### `submitDoubt(event)`
**Purpose:** Sends form data to backend

**Process:**
1. Prevents page reload
2. Gets form field values
3. Validates input
4. Creates JSON object
5. Sends POST request to API
6. Shows success/error message
7. Clears form on success

**Error Handling:**
- Empty fields
- Network errors
- Server errors
- API not configured

#### `fetchLatestDoubt()`
**Purpose:** Gets most recent doubt from backend

**Process:**
1. Shows loading indicator
2. Sends GET request to API
3. Parses response data
4. Displays doubt on page
5. Handles empty data
6. Shows error messages if needed

**Handles Multiple Response Formats:**
- Single object: `{ subject: "...", question: "..." }`
- Array: `[{ subject: "...", question: "..." }]`
- Nested: `{ data: { subject: "..." } }`

---

## 🔧 Backend Requirements for Member 2

### POST Endpoint (Submit Doubt)
**URL:** `/api/doubts` or similar

**Request Body:**
```json
{
    "subject": "Data Structures",
    "question": "What is the difference between Stack and Queue?"
}
```

**Response:**
```json
{
    "id": 1,
    "subject": "Data Structures",
    "question": "What is the difference between Stack and Queue?",
    "createdAt": "2025-11-29T10:30:00Z"
}
```

**HTTP Status Codes:**
- 200/201: Success
- 400: Bad request (validation error)
- 500: Server error

### GET Endpoint (Fetch Latest)
**URL:** `/api/doubts/latest` or with query params

**Response (with data):**
```json
{
    "id": 1,
    "subject": "Operating Systems",
    "question": "What is the difference between process and thread?",
    "createdAt": "2025-11-29T10:30:00Z"
}
```

**Response (no data):**
```json
[]
```
or
```json
{
    "data": null
}
```

**Important:**
- Return the most recent record (ORDER BY createdAt DESC, LIMIT 1)
- Enable CORS if frontend/backend on different domains
- Add input validation and sanitization

---

## 📱 Features

### Implemented Features ✅
1. ✅ Anonymous doubt submission form
2. ✅ Subject and Question input fields
3. ✅ Form validation (required fields, character limits)
4. ✅ POST request to backend API
5. ✅ Latest doubt display page
6. ✅ GET request to fetch latest record
7. ✅ Loading indicators
8. ✅ Error handling (network, server errors)
9. ✅ Success/error message display
10. ✅ Responsive mobile-friendly design
11. ✅ Navigation between pages
12. ✅ Timestamp formatting
13. ✅ Empty state handling (no doubts)
14. ✅ Comprehensive code comments

### Future Enhancements (Optional) 🚀
- Pagination to view all doubts
- Search functionality
- Filter by subject
- Admin panel to answer doubts
- Dark mode toggle
- Multiple language support

---

## 🎨 Customization Guide

### Change Color Scheme
In `style.css`, modify these gradient colors:

```css
/* Purple gradient (current) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Blue gradient alternative */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Green gradient alternative */
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

### Change Font
In `style.css`, update the font family:

```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

Replace with Google Fonts or other system fonts.

---

## 🧪 Testing

### Test Without Backend
Use these browser console commands to test functions:

```javascript
// Test submit (will show API not configured error)
submitDoubt(new Event('submit'));

// Test fetch (will show API not configured error)
fetchLatestDoubt();
```

### Test With Mock API
Use services like:
- **JSONPlaceholder** (free mock API)
- **Mockapi.io** (create custom endpoints)
- **Postman Mock Server**

---

## 🐛 Troubleshooting

### Issue: "API URL not configured"
**Solution:** Update `API_URL` in `script.js` with the actual backend endpoint.

### Issue: CORS Error
**Solution:** Backend must enable CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

### Issue: Form not submitting
**Solution:** 
1. Check console for errors (F12 → Console)
2. Verify API_URL is correct
3. Check internet connection
4. Verify backend is running

### Issue: Latest doubt not loading
**Solution:**
1. Verify GET endpoint URL
2. Check if data exists in database
3. Check console for network errors
4. Verify response format matches expected structure

---

## 📚 Learning Resources

### HTML Forms
- [MDN Web Docs - Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)

### CSS Flexbox
- [CSS Tricks - Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### JavaScript Fetch API
- [MDN Web Docs - Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Async/Await
- [JavaScript.info - Async/Await](https://javascript.info/async-await)

---

## 🎯 Presentation Tips for Class

### What to Explain:
1. **Project Purpose**: Anonymous platform for students to ask questions
2. **Your Role**: Built the frontend (UI/forms/API calls)
3. **Technologies Used**: HTML5, CSS3, JavaScript (ES6+)
4. **Key Features**: Form validation, API integration, responsive design
5. **Code Walkthrough**: Show `submitDoubt()` and `fetchLatestDoubt()` functions

### Demo Flow:
1. Show `index.html` - explain form fields
2. Submit a test doubt (if backend ready)
3. Navigate to `latest.html` to show the submitted doubt
4. Open DevTools (F12) to show console logs
5. Explain error handling (disconnect internet, try submit)

### Bonus Points:
- Show responsive design (resize browser window)
- Explain API integration concept
- Show code comments and documentation
- Discuss security (no personal data collected)

---

## 📞 Support & Contact

### For Member 1 (You):
- Focus on frontend functionality
- Test UI/UX thoroughly
- Document any issues for Member 2

### For Member 2 (Backend):
- Provide API endpoint URLs
- Share API documentation
- Test endpoints with tools like Postman
- Ensure proper error responses

---

## ✅ Pre-Submission Checklist

Before submitting your project, verify:

- [ ] All files are in the same folder
- [ ] `API_URL` is configured in `script.js`
- [ ] Form submits successfully (or shows proper error)
- [ ] Latest doubt page loads and displays data
- [ ] UI looks good on mobile devices
- [ ] No console errors (open F12 → Console)
- [ ] Code comments are clear and helpful
- [ ] README.md is included
- [ ] Both pages have proper navigation
- [ ] Loading indicators work correctly
- [ ] Error messages display properly

---

## 📝 Demo Data Examples

### Example Doubt 1:
- **Subject:** Data Structures
- **Question:** Can you explain the difference between Stack and Queue with real-world examples?

### Example Doubt 2:
- **Subject:** Operating Systems
- **Question:** What is the difference between process and thread? Why do we need threads?

### Example Doubt 3:
- **Subject:** Web Development
- **Question:** How does CORS work and why do we get CORS errors in browsers?

---

## 🎓 Project Learning Outcomes

After completing this project, you will understand:

1. ✅ How to create HTML forms
2. ✅ Form validation techniques
3. ✅ CSS styling and responsive design
4. ✅ JavaScript event handling
5. ✅ Asynchronous programming (async/await)
6. ✅ Fetch API for HTTP requests
7. ✅ JSON data format
8. ✅ Error handling in JavaScript
9. ✅ DOM manipulation
10. ✅ Frontend-backend integration concepts

---

## 📄 License & Credits

This project is created for educational purposes.

**Created by:** Member 1 (Frontend)  
**Project:** ProfSensei - Anonymous Doubt Box  
**Date:** November 2025

---

## 🚀 Good Luck with Your Presentation!

Remember to:
- Test everything before the demo
- Prepare backup slides if needed
- Explain your code clearly
- Be ready for questions
- Show confidence in your work

**You've got this! 💪**
