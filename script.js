/*
============================================
JAVASCRIPT FOR PROFSENSEI - ANONYMOUS DOUBT BOX
============================================
INSTRUCTIONS:
1. Replace API_URL with the actual backend endpoint provided by Member 2
2. Replace API_KEY if your backend requires authentication
3. This file contains two main functions:
   - submitDoubt(): Sends form data to backend (POST request)
   - fetchLatestDoubt(): Gets the most recent doubt from backend (GET request)
4. Error handling is included for network issues
5. User feedback is provided via message boxes and loading indicators
============================================
*/

/* ========================================
   CONFIGURATION - UPDATE THESE VALUES
   ======================================== */

// TODO: Replace this with the actual backend API URL from Member 2
// Example: "https://your-project.supabase.co/rest/v1/doubts"
const API_URL = "http://localhost:5000/api/doubts";

// TODO: If your backend requires an API key, add it here
// Example for Supabase: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const API_KEY = "YOUR_API_KEY_HERE";

// API Headers configuration
// These headers are sent with every API request
const API_HEADERS = {
    "Content-Type": "application/json",
    // Uncomment the line below if API key is required:
    // "apikey": API_KEY,
    // For Supabase, you might also need:
    // "Authorization": `Bearer ${API_KEY}`,
};

/* ========================================
   FUNCTION 1: SUBMIT DOUBT
   ======================================== */

/**
 * submitDoubt()
 * 
 * Purpose: This function handles the form submission when a student asks a doubt
 * 
 * Flow:
 * 1. Prevents default form submission (so page doesn't reload)
 * 2. Gets values from Subject and Question fields
 * 3. Validates that fields are not empty
 * 4. Creates a JSON object with the data
 * 5. Sends POST request to backend API
 * 6. Shows success or error message to user
 * 7. Clears the form if successful
 * 
 * @param {Event} event - The form submit event
 */
async function submitDoubt(event) {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
    
    console.log("Submit button clicked - starting doubt submission process");
    
    // Get the form element
    const form = document.getElementById("doubtForm");
    
    // Get the values from all form fields
    const subject = document.getElementById("subject").value.trim();
    const courseCode = document.getElementById("courseCode").value.trim();
    const teacher = document.getElementById("teacher").value.trim();
    const question = document.getElementById("question").value.trim();
    
    // Get the submit button to disable it during submission
    const submitBtn = document.getElementById("submitBtn");
    
    // Get the message box to display feedback
    const messageBox = document.getElementById("messageBox");
    
    // Validate that all fields have content
    if (!subject || !courseCode || !teacher || !question) {
        showMessage("Please fill in all fields!", "error");
        console.error("Validation failed: Empty fields detected");
        return;
    }
    
    console.log("Form validation passed.");
    console.log("Subject:", subject);
    console.log("Course Code:", courseCode);
    console.log("Teacher:", teacher);
    console.log("Question:", question);
    
    // Check if API URL is configured
    if (API_URL === "YOUR_BACKEND_API_URL_HERE") {
        showMessage("⚠️ API URL not configured! Please update script.js with the backend URL.", "error");
        console.error("API URL not configured in script.js");
        return;
    }
    
    // Create the data object to send to backend
    // This matches the expected format from your backend
    const doubtData = {
        subject: subject,
        courseCode: courseCode,
        teacher: teacher,
        question: question
        // Note: Backend should automatically add createdAt timestamp
    };
    
    console.log("Doubt data prepared:", doubtData);
    
    // Disable the submit button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    
    // Clear any previous messages
    messageBox.className = "message-box";
    messageBox.textContent = "";
    
    try {
        console.log("Sending POST request to:", API_URL);
        
        // Send POST request to backend API
        const response = await fetch(API_URL, {
            method: "POST", // HTTP method for creating new records
            headers: API_HEADERS, // Headers defined at the top of this file
            body: JSON.stringify(doubtData) // Convert JavaScript object to JSON string
        });
        
        console.log("Response status:", response.status);
        
        // Check if the request was successful
        if (response.ok) {
            // Parse the JSON response from backend
            const result = await response.json();
            console.log("Success! Backend response:", result);
            
            // Show success message to user
            showMessage("✅ Your doubt has been submitted successfully!", "success");
            
            // Clear the form fields
            form.reset();
            
            // Optional: Redirect to latest.html after 2 seconds
            // Uncomment the lines below if you want auto-redirect:
            // setTimeout(() => {
            //     window.location.href = "latest.html";
            // }, 2000);
            
        } else {
            // Handle HTTP error responses (4xx, 5xx)
            const errorData = await response.json().catch(() => ({}));
            console.error("Server error:", response.status, errorData);
            
            showMessage(`❌ Failed to submit doubt. Server error: ${response.status}`, "error");
        }
        
    } catch (error) {
        // Handle network errors (no internet, server down, etc.)
        console.error("Network error during submission:", error);
        
        showMessage("❌ Network error! Please check your internet connection and try again.", "error");
    } finally {
        // Re-enable the submit button regardless of success or failure
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Doubt";
    }
}

/* ========================================
   FUNCTION 2: FETCH LATEST DOUBT
   ======================================== */

/**
 * fetchLatestDoubt()
 * 
 * Purpose: This function retrieves the most recent doubt from the backend
 * 
 * Flow:
 * 1. Shows a loading indicator
 * 2. Sends GET request to backend API
 * 3. Receives the latest doubt data (or empty if no doubts exist)
 * 4. Displays the doubt information on the page
 * 5. Handles errors if the request fails
 * 
 * Expected backend response format:
 * {
 *   "id": 123,
 *   "subject": "Physics",
 *   "question": "What is Newton's first law?",
 *   "createdAt": "2025-11-29T10:30:00Z"
 * }
 */
async function fetchLatestDoubt() {
    console.log("Fetching latest doubt from backend...");
    
    // Get all the display elements
    const loadingIndicator = document.getElementById("loadingIndicator");
    const doubtCard = document.getElementById("doubtCard");
    const noDataMessage = document.getElementById("noDataMessage");
    const errorMessage = document.getElementById("errorMessage");
    
    // Show loading, hide everything else
    loadingIndicator.style.display = "block";
    doubtCard.style.display = "none";
    noDataMessage.style.display = "none";
    errorMessage.style.display = "none";
    
    // Check if API URL is configured
    if (API_URL === "YOUR_BACKEND_API_URL_HERE") {
        console.error("API URL not configured");
        loadingIndicator.style.display = "none";
        errorMessage.style.display = "block";
        errorMessage.innerHTML = "<p>⚠️ API URL not configured! Please update script.js with the backend URL.</p>";
        return;
    }
    
    try {
        console.log("Sending GET request to:", API_URL);
        
        // Send GET request to backend
        // Note: You might need to modify the URL to get only the latest record
        // For example: API_URL + "?order=createdAt.desc&limit=1"
        // Or: API_URL + "/latest"
        // Discuss with Member 2 for the exact endpoint
        const response = await fetch(API_URL, {
            method: "GET", // HTTP method for retrieving data
            headers: API_HEADERS // Headers defined at the top
        });
        
        console.log("Response status:", response.status);
        
        // Check if request was successful
        if (response.ok) {
            // Parse the JSON response
            const data = await response.json();
            console.log("Data received from backend:", data);
            
            // Handle different response formats
            // Your backend might return:
            // 1. A single object: { subject: "...", question: "..." }
            // 2. An array with one item: [{ subject: "...", question: "..." }]
            // 3. An object with data property: { data: { subject: "..." } }
            
            let latestDoubt = null;
            
            // Check if data is an array
            if (Array.isArray(data)) {
                latestDoubt = data.length > 0 ? data[0] : null;
            }
            // Check if data has a 'data' property
            else if (data && data.data) {
                latestDoubt = data.data;
            }
            // Assume it's a direct object
            else if (data && data.subject) {
                latestDoubt = data;
            }
            
            // If we found a doubt, display it
            if (latestDoubt && latestDoubt.subject) {
                console.log("Displaying latest doubt:", latestDoubt);
                
                // Hide loading, show doubt card
                loadingIndicator.style.display = "none";
                doubtCard.style.display = "block";
                
                // Populate the card with doubt data
                document.getElementById("doubtSubject").textContent = latestDoubt.subject;
                document.getElementById("doubtCourseCode").textContent = latestDoubt.courseCode || latestDoubt.course_code || "N/A";
                document.getElementById("doubtTeacher").textContent = latestDoubt.teacher || "N/A";
                document.getElementById("doubtQuestion").textContent = latestDoubt.question;
                
                // Format the timestamp to be human-readable
                const timestamp = latestDoubt.createdAt || latestDoubt.created_at || latestDoubt.timestamp;
                if (timestamp) {
                    const date = new Date(timestamp);
                    const formattedDate = date.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    document.getElementById("doubtTime").textContent = formattedDate;
                } else {
                    document.getElementById("doubtTime").textContent = "Recently";
                }
                
            } else {
                // No doubts found in database
                console.log("No doubts found in database");
                
                loadingIndicator.style.display = "none";
                noDataMessage.style.display = "block";
            }
            
        } else {
            // Handle HTTP error responses
            console.error("Server error:", response.status);
            
            loadingIndicator.style.display = "none";
            errorMessage.style.display = "block";
        }
        
    } catch (error) {
        // Handle network errors
        console.error("Network error while fetching doubt:", error);
        
        loadingIndicator.style.display = "none";
        errorMessage.style.display = "block";
    }
}

/* ========================================
   HELPER FUNCTION: SHOW MESSAGE
   ======================================== */

/**
 * showMessage()
 * 
 * Purpose: Display success or error messages to the user
 * 
 * @param {string} message - The message text to display
 * @param {string} type - Either "success" or "error"
 */
function showMessage(message, type) {
    const messageBox = document.getElementById("messageBox");
    
    // Set the message content
    messageBox.textContent = message;
    
    // Set the appropriate CSS class for styling
    messageBox.className = `message-box ${type}`;
    
    // Auto-hide the message after 5 seconds
    setTimeout(() => {
        messageBox.className = "message-box";
        messageBox.textContent = "";
    }, 5000);
}

/* ========================================
   DEMO DATA & TESTING
   ======================================== */

/*
For testing without a backend, you can use this mock data:

DEMO DATA STRUCTURE:

Submit Doubt (POST):
{
    "subject": "Data Structures",
    "courseCode": "CS201",
    "teacher": "Dr. Sharma",
    "question": "Can you explain the difference between Stack and Queue?"
}

Expected Response:
{
    "id": 1,
    "subject": "Data Structures",
    "courseCode": "CS201",
    "teacher": "Dr. Sharma",
    "question": "Can you explain the difference between Stack and Queue?",
    "createdAt": "2025-11-29T10:30:00Z"
}

Fetch Latest (GET):
Returns the most recent doubt in the same format as above.

COMMON BACKEND ENDPOINTS:

Supabase:
- POST: https://your-project.supabase.co/rest/v1/doubts
- GET: https://your-project.supabase.co/rest/v1/doubts?order=createdAt.desc&limit=1

Firebase:
- POST: https://your-project.firebaseio.com/doubts.json
- GET: https://your-project.firebaseio.com/doubts.json?orderBy="$key"&limitToLast=1

Custom Backend:
- POST: https://your-api.com/api/doubts
- GET: https://your-api.com/api/doubts/latest
*/

/* ========================================
   ADDITIONAL NOTES FOR MEMBER 2 (BACKEND)
   ======================================== 

1. POST Endpoint for submitting doubts:
   - Accept: { subject: string, courseCode: string, teacher: string, question: string }
   - Return: { id: number, subject: string, courseCode: string, teacher: string, question: string, createdAt: timestamp }
   
2. GET Endpoint for fetching latest doubt:
   - No request body needed
   - Return: The most recent doubt record sorted by createdAt DESC
   - If no records: Return empty array [] or { data: null }

3. Enable CORS if frontend and backend are on different domains

4. Consider adding:
   - Input validation
   - Rate limiting
   - Character limits (subject: 100, question: 1000)
   - SQL injection protection
*/

/* ========================================
   STUDENT VIEW DOUBTS FUNCTIONS
   ======================================== */

/**
 * loadStudentDoubts()
 * 
 * Purpose: Load all doubts for student viewing
 * Students can see all doubts with their answers if available
 */
async function loadStudentDoubts() {
    console.log("Loading doubts for student view...");
    
    const loadingIndicator = document.getElementById("loadingStudentDoubts");
    const doubtsList = document.getElementById("studentDoubtsList");
    const noDoubtsMessage = document.getElementById("noStudentDoubtsMessage");
    const errorMessage = document.getElementById("errorStudentDoubts");
    
    // Show loading, hide everything else
    if (loadingIndicator) loadingIndicator.style.display = "block";
    if (doubtsList) doubtsList.innerHTML = "";
    if (noDoubtsMessage) noDoubtsMessage.style.display = "none";
    if (errorMessage) errorMessage.style.display = "none";
    
    // Check if API URL is configured
    if (API_URL === "YOUR_BACKEND_API_URL_HERE") {
        console.error("API URL not configured");
        if (loadingIndicator) loadingIndicator.style.display = "none";
        if (errorMessage) {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = "<p>⚠️ API URL not configured! Please update script.js with the backend URL.</p>";
        }
        return;
    }
    
    try {
        // Get filter values
        const filterSubject = document.getElementById("filterSubject");
        const filterStatus = document.getElementById("filterStatus");
        const selectedSubject = filterSubject ? filterSubject.value : "all";
        const selectedStatus = filterStatus ? filterStatus.value : "all";
        
        console.log("Fetching doubts from:", API_URL);
        
        const response = await fetch(API_URL, {
            method: "GET",
            headers: API_HEADERS
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log("Doubts received:", data);
            
            // Handle different response formats
            let doubts = Array.isArray(data) ? data : (data.data || []);
            
            // Apply filters on frontend
            if (selectedSubject !== "all") {
                doubts = doubts.filter(doubt => doubt.subject === selectedSubject);
            }
            if (selectedStatus !== "all") {
                doubts = doubts.filter(doubt => {
                    const status = doubt.status || (doubt.answer ? "answered" : "pending");
                    return status === selectedStatus;
                });
            }
            
            if (loadingIndicator) loadingIndicator.style.display = "none";
            
            if (doubts.length > 0) {
                displayStudentDoubts(doubts);
            } else {
                if (noDoubtsMessage) noDoubtsMessage.style.display = "block";
            }
            
        } else {
            console.error("Server error:", response.status);
            if (loadingIndicator) loadingIndicator.style.display = "none";
            if (errorMessage) errorMessage.style.display = "block";
        }
        
    } catch (error) {
        console.error("Network error while fetching doubts:", error);
        if (loadingIndicator) loadingIndicator.style.display = "none";
        if (errorMessage) errorMessage.style.display = "block";
    }
}

/**
 * displayStudentDoubts()
 * 
 * Purpose: Display doubts in student view format
 * Shows question, details, and answer if available
 * 
 * @param {Array} doubts - Array of doubt objects
 */
function displayStudentDoubts(doubts) {
    const doubtsList = document.getElementById("studentDoubtsList");
    if (!doubtsList) return;
    
    doubtsList.innerHTML = "";
    
    doubts.forEach(doubt => {
        const doubtItem = document.createElement("div");
        doubtItem.className = "doubt-item";
        
        const status = doubt.status || (doubt.answer ? "answered" : "pending");
        const statusClass = status === "answered" ? "status-answered" : "status-pending";
        
        const date = new Date(doubt.createdAt || doubt.created_at);
        const formattedDate = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        doubtItem.innerHTML = `
            <div class="doubt-item-header">
                <h3 class="doubt-item-title">${doubt.subject}</h3>
                <span class="doubt-status ${statusClass}">${status.toUpperCase()}</span>
            </div>
            
            <div class="doubt-item-details">
                <div class="doubt-detail-row">
                    <span class="doubt-detail-label">Course Code:</span>
                    <span class="doubt-detail-value">${doubt.courseCode || doubt.course_code || 'N/A'}</span>
                </div>
                <div class="doubt-detail-row">
                    <span class="doubt-detail-label">Teacher:</span>
                    <span class="doubt-detail-value">${doubt.teacher || 'N/A'}</span>
                </div>
                <div class="doubt-detail-row">
                    <span class="doubt-detail-label">Asked on:</span>
                    <span class="doubt-detail-value">${formattedDate}</span>
                </div>
            </div>
            
            <div class="doubt-item-question">
                <p><strong>Question:</strong> ${doubt.question}</p>
            </div>
            
            ${doubt.answer ? `
                <div class="answer-display">
                    <h4>✅ Teacher's Answer:</h4>
                    <p>${doubt.answer}</p>
                </div>
            ` : `
                <div class="pending-display">
                    <p>⏳ <em>Waiting for teacher's response...</em></p>
                </div>
            `}
        `;
        
        doubtsList.appendChild(doubtItem);
    });
}

/* ========================================
   TEACHER DASHBOARD FUNCTIONS
   ======================================== */

/**
 * loadDoubts()
 * 
 * Purpose: Load all doubts for the teacher dashboard
 * Fetches doubts from backend and displays them in a list
 */
async function loadDoubts() {
    console.log("Loading doubts for teacher dashboard...");
    
    const loadingIndicator = document.getElementById("loadingDoubts");
    const doubtsList = document.getElementById("doubtsList");
    const noDoubtsMessage = document.getElementById("noDoubtsMessage");
    const errorMessage = document.getElementById("errorLoadingDoubts");
    
    // Show loading, hide everything else
    if (loadingIndicator) loadingIndicator.style.display = "block";
    if (doubtsList) doubtsList.innerHTML = "";
    if (noDoubtsMessage) noDoubtsMessage.style.display = "none";
    if (errorMessage) errorMessage.style.display = "none";
    
    // Check if API URL is configured
    if (API_URL === "YOUR_BACKEND_API_URL_HERE") {
        console.error("API URL not configured");
        if (loadingIndicator) loadingIndicator.style.display = "none";
        if (errorMessage) {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = "<p>⚠️ API URL not configured! Please update script.js with the backend URL.</p>";
        }
        return;
    }
    
    // Get logged in teacher's name from session
    const teacherName = sessionStorage.getItem("teacherName");
    if (!teacherName) {
        console.error("Teacher name not found in session");
        if (loadingIndicator) loadingIndicator.style.display = "none";
        if (errorMessage) {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = "<p>⚠️ Session expired. Please login again.</p>";
        }
        setTimeout(() => {
            window.location.href = "teacher-login.html";
        }, 2000);
        return;
    }
    
    try {
        // Build API URL with teacher filter
        // Member 2 should implement filtering on backend
        // Example: API_URL + "?teacher=Dr.+Sharma"
        let fetchUrl = API_URL;
        fetchUrl += `?teacher=${encodeURIComponent(teacherName)}`;
        
        console.log("Fetching doubts for teacher:", teacherName);
        console.log("Fetching from:", fetchUrl);
        
        const response = await fetch(fetchUrl, {
            method: "GET",
            headers: API_HEADERS
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log("Doubts received:", data);
            
            // Handle different response formats
            let doubts = Array.isArray(data) ? data : (data.data || []);
            
            // Filter by teacher on frontend (backup if backend doesn't filter)
            doubts = doubts.filter(doubt => doubt.teacher === teacherName);
            
            if (loadingIndicator) loadingIndicator.style.display = "none";
            
            if (doubts.length > 0) {
                // Display doubts
                displayDoubts(doubts);
            } else {
                if (noDoubtsMessage) noDoubtsMessage.style.display = "block";
            }
            
        } else {
            console.error("Server error:", response.status);
            if (loadingIndicator) loadingIndicator.style.display = "none";
            if (errorMessage) errorMessage.style.display = "block";
        }
        
    } catch (error) {
        console.error("Network error while fetching doubts:", error);
        if (loadingIndicator) loadingIndicator.style.display = "none";
        if (errorMessage) errorMessage.style.display = "block";
    }
}

/**
 * displayDoubts()
 * 
 * Purpose: Display list of doubts in the teacher dashboard
 * 
 * @param {Array} doubts - Array of doubt objects
 */
function displayDoubts(doubts) {
    const doubtsList = document.getElementById("doubtsList");
    if (!doubtsList) return;
    
    doubtsList.innerHTML = "";
    
    doubts.forEach((doubt, index) => {
        const doubtItem = document.createElement("div");
        doubtItem.className = "professional-doubt-card";
        
        const status = doubt.status || (doubt.answer ? "Answered" : "Pending");
        const statusClass = status === "Answered" ? "status-answered" : "status-pending";
        
        const date = new Date(doubt.createdAt || doubt.created_at);
        const formattedDate = date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        doubtItem.innerHTML = `
            <div class="doubt-card-header">
                <div class="doubt-number">#${String(index + 1).padStart(3, '0')}</div>
                <span class="doubt-badge ${statusClass}">${status}</span>
            </div>
            
            <div class="doubt-main-info">
                <h3 class="doubt-subject-title">📚 ${doubt.subject}</h3>
                <div class="doubt-meta">
                    <span class="meta-item"><strong>Course:</strong> ${doubt.courseCode || doubt.course_code || 'N/A'}</span>
                    <span class="meta-item"><strong>Teacher:</strong> ${doubt.teacher || 'N/A'}</span>
                    <span class="meta-item"><strong>Date:</strong> ${formattedDate}</span>
                </div>
            </div>
            
            <div class="doubt-question-section">
                <h4 class="question-label">❓ Student's Question:</h4>
                <div class="question-content">${doubt.question}</div>
            </div>
            
            ${doubt.answer ? `
                <div class="answer-section-display">
                    <h4 class="answer-label">✅ Your Answer:</h4>
                    <div class="answer-content">${doubt.answer}</div>
                </div>
            ` : `
                <div class="pending-answer-section">
                    <p class="pending-text">⏳ This doubt is waiting for your response. Click below to answer.</p>
                </div>
            `}
            
            <div class="doubt-card-actions">
                ${!doubt.answer ? `
                    <button class="btn-primary-action" onclick="openAnswerModal('${doubt.id}', \`${doubt.subject}\`, \`${doubt.courseCode || doubt.course_code || 'N/A'}\`, \`${doubt.question}\`)">
                        ✍️ Write Answer
                    </button>
                ` : `
                    <button class="btn-completed" disabled>
                        ✅ Already Answered
                    </button>
                `}
            </div>
        `;
        
        doubtsList.appendChild(doubtItem);
    });
}

/**
 * filterDoubtsByTeacher()
 * 
 * Purpose: No longer needed - teacher is auto-determined from login session
 * Kept for backward compatibility
 */
function filterDoubtsByTeacher() {
    console.log("Filter function called - using session teacher name instead");
    loadDoubts();
}

/**
 * openAnswerModal()
 * 
 * Purpose: Open the popup modal to write an answer
 * 
 * @param {number} doubtId - ID of the doubt being answered
 * @param {string} subject - Subject of the doubt
 * @param {string} courseCode - Course code
 * @param {string} question - The question text
 */
function openAnswerModal(doubtId, subject, courseCode, question) {
    console.log("Opening answer modal for doubt ID:", doubtId);
    
    const modal = document.getElementById("answerModal");
    const doubtIdInput = document.getElementById("doubtId");
    const modalSubject = document.getElementById("modalSubject");
    const modalCourseCode = document.getElementById("modalCourseCode");
    const modalQuestion = document.getElementById("modalQuestion");
    const answerText = document.getElementById("answerText");
    
    // Set the doubt information
    if (doubtIdInput) doubtIdInput.value = doubtId;
    if (modalSubject) modalSubject.textContent = subject;
    if (modalCourseCode) modalCourseCode.textContent = courseCode;
    if (modalQuestion) modalQuestion.textContent = question;
    if (answerText) answerText.value = "";
    
    // Show the modal
    if (modal) modal.style.display = "block";
}

/**
 * closeAnswerModal()
 * 
 * Purpose: Close the answer popup modal
 */
function closeAnswerModal() {
    const modal = document.getElementById("answerModal");
    const answerForm = document.getElementById("answerForm");
    const messageBox = document.getElementById("answerMessageBox");
    
    if (modal) modal.style.display = "none";
    if (answerForm) answerForm.reset();
    if (messageBox) {
        messageBox.className = "message-box";
        messageBox.textContent = "";
    }
}

/**
 * submitAnswer()
 * 
 * Purpose: Submit teacher's answer to the backend
 * 
 * @param {Event} event - Form submit event
 */
async function submitAnswer(event) {
    event.preventDefault();
    
    console.log("Submitting answer...");
    
    const doubtId = document.getElementById("doubtId").value;
    const answerText = document.getElementById("answerText").value.trim();
    const submitBtn = document.getElementById("submitAnswerBtn");
    const messageBox = document.getElementById("answerMessageBox");
    
    if (!answerText) {
        showAnswerMessage("Please write an answer before submitting!", "error");
        return;
    }
    
    // Check if API URL is configured
    if (API_URL === "YOUR_BACKEND_API_URL_HERE") {
        showAnswerMessage("⚠️ API URL not configured! Please update script.js with the backend URL.", "error");
        return;
    }
    
    // Create answer data object
    const answerData = {
        doubtId: parseInt(doubtId),
        answer: answerText,
        status: "answered",
        answeredAt: new Date().toISOString()
    };
    
    console.log("Answer data:", answerData);
    
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    
    try {
        // POST answer to backend
        // Member 2 should create endpoint like: POST /api/doubts/:id/answer
        const response = await fetch(`${API_URL}/${doubtId}/answer`, {
            method: "POST",
            headers: API_HEADERS,
            body: JSON.stringify(answerData)
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log("Answer submitted successfully:", result);
            
            showAnswerMessage("✅ Answer submitted successfully!", "success");
            
            // Close modal after 2 seconds and reload doubts
            setTimeout(() => {
                closeAnswerModal();
                loadDoubts();
            }, 2000);
            
        } else {
            console.error("Server error:", response.status);
            showAnswerMessage(`❌ Failed to submit answer. Server error: ${response.status}`, "error");
        }
        
    } catch (error) {
        console.error("Network error:", error);
        showAnswerMessage("❌ Network error! Please check your connection.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Answer";
    }
}

/**
 * showAnswerMessage()
 * 
 * Purpose: Show success/error messages in the answer modal
 * 
 * @param {string} message - Message to display
 * @param {string} type - "success" or "error"
 */
function showAnswerMessage(message, type) {
    const messageBox = document.getElementById("answerMessageBox");
    if (!messageBox) return;
    
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    
    setTimeout(() => {
        messageBox.className = "message-box";
        messageBox.textContent = "";
    }, 5000);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById("answerModal");
    if (event.target === modal) {
        closeAnswerModal();
    }
}

/*
============================================
END OF JAVASCRIPT FILE
============================================
Good luck with your project! 🚀
*/
