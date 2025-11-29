# Postman API Testing Guide

Complete guide for testing **WhisperBoard Backend API** using Postman.

---

## 📋 Prerequisites

1. **Postman** installed - [Download](https://www.postman.com/downloads/)
2. **Backend server running** on `http://localhost:5000`
3. **Firebase configured** with valid credentials

---

## 🔧 Setup Postman

### Create a New Collection

1. Open Postman
2. Click **"New"** → **"Collection"**
3. Name it: `WhisperBoard API`
4. Set Base URL variable:
   - Click on collection → **Variables** tab
   - Add variable:
     - **Variable**: `baseUrl`
     - **Initial Value**: `http://localhost:5000/api`
     - **Current Value**: `http://localhost:5000/api`

---

## 🧪 Test Cases

### 1. Health Check

**Verify server is running**

**Endpoint**: `GET /api/health`

**Request**:
```
GET {{baseUrl}}/health
```

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Submit a Doubt (Anonymous Student)

**Create a new doubt submission**

**Endpoint**: `POST /api/doubts`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "subject": "Database Systems",
  "courseCode": "CS301",
  "teacher": "Dr. Smith",
  "question": "What is the difference between SQL and NoSQL databases? Which one should I use for my project?"
}
```

**Expected Response**: `201 Created`
```json
{
  "success": true,
  "message": "Doubt submitted successfully",
  "data": {
    "id": "abc123xyz789",
    "subject": "Database Systems",
    "courseCode": "CS301",
    "teacher": "Dr. Smith",
    "question": "What is the difference between SQL and NoSQL databases? Which one should I use for my project?",
    "answer": null,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "answeredAt": null
  }
}
```

**📝 Save the `id` from response for next tests!**

---

### 3. Get All Doubts

**Retrieve all submitted doubts**

**Endpoint**: `GET /api/doubts`

**Request**:
```
GET {{baseUrl}}/doubts
```

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "message": "Retrieved all doubts",
  "data": [
    {
      "id": "abc123xyz789",
      "subject": "Database Systems",
      "courseCode": "CS301",
      "teacher": "Dr. Smith",
      "question": "What is the difference between SQL and NoSQL databases?",
      "answer": null,
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "answeredAt": null
    }
  ],
  "count": 1
}
```

---

### 4. Get Doubts by Teacher

**Filter doubts by teacher name**

**Endpoint**: `GET /api/doubts?teacher=Dr. Smith`

**Request**:
```
GET {{baseUrl}}/doubts?teacher=Dr. Smith
```

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "message": "Retrieved doubts for teacher: Dr. Smith",
  "data": [
    {
      "id": "abc123xyz789",
      "subject": "Database Systems",
      "courseCode": "CS301",
      "teacher": "Dr. Smith",
      "question": "What is the difference between SQL and NoSQL databases?",
      "answer": null,
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "answeredAt": null
    }
  ],
  "count": 1
}
```

---

### 5. Get Specific Doubt by ID

**Retrieve a single doubt**

**Endpoint**: `GET /api/doubts/:id`

**Request**:
```
GET {{baseUrl}}/doubts/abc123xyz789
```
*Replace `abc123xyz789` with actual doubt ID*

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "message": "Doubt retrieved successfully",
  "data": {
    "id": "abc123xyz789",
    "subject": "Database Systems",
    "courseCode": "CS301",
    "teacher": "Dr. Smith",
    "question": "What is the difference between SQL and NoSQL databases?",
    "answer": null,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "answeredAt": null
  }
}
```

---

### 6. Submit Answer (Teacher)

**Teacher answers a doubt**

**Endpoint**: `POST /api/doubts/:id/answer`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "answer": "SQL databases are relational and use structured schemas with ACID properties. NoSQL databases are non-relational, flexible, and horizontally scalable. For your project, use SQL if you need complex relationships and transactions, or NoSQL if you need flexibility and scalability for large datasets."
}
```

**Request**:
```
POST {{baseUrl}}/doubts/abc123xyz789/answer
```
*Replace `abc123xyz789` with actual doubt ID*

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "data": {
    "id": "abc123xyz789",
    "subject": "Database Systems",
    "courseCode": "CS301",
    "teacher": "Dr. Smith",
    "question": "What is the difference between SQL and NoSQL databases?",
    "answer": "SQL databases are relational and use structured schemas...",
    "status": "Answered",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "answeredAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 7. Get Statistics

**Get summary of all doubts**

**Endpoint**: `GET /api/doubts/stats/summary`

**Request**:
```
GET {{baseUrl}}/doubts/stats/summary
```

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 5,
    "pending": 2,
    "answered": 3
  }
}
```

---

### 8. Teacher Login

**Demo teacher authentication**

**Endpoint**: `POST /api/teacher/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "username": "teacher",
  "password": "teacher123"
}
```

**Expected Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "username": "teacher",
    "role": "teacher",
    "token": "demo-token-1705315800000"
  }
}
```

---

## ❌ Error Test Cases

### Test 1: Invalid Doubt Submission (Missing Fields)

**Body**:
```json
{
  "subject": "Database Systems",
  "courseCode": "CS301"
}
```

**Expected Response**: `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Teacher name is required",
    "Question is required"
  ]
}
```

---

### Test 2: Short Question

**Body**:
```json
{
  "subject": "Math",
  "courseCode": "MA101",
  "teacher": "Dr. Jones",
  "question": "Help?"
}
```

**Expected Response**: `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Question must be at least 10 characters long"
  ]
}
```

---

### Test 3: Answer Non-Existent Doubt

**Request**:
```
POST {{baseUrl}}/doubts/invalid-id-123/answer
```

**Expected Response**: `404 Not Found`
```json
{
  "success": false,
  "error": "Doubt not found",
  "id": "invalid-id-123"
}
```

---

### Test 4: Answer Already Answered Doubt

**Try to answer same doubt twice**

**Expected Response**: `400 Bad Request`
```json
{
  "success": false,
  "error": "This doubt has already been answered",
  "data": { ... }
}
```

---

### Test 5: Invalid Teacher Login

**Body**:
```json
{
  "username": "teacher",
  "password": "wrongpassword"
}
```

**Expected Response**: `401 Unauthorized`
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

## 📊 Complete Test Flow

**Run tests in this order for full workflow:**

1. ✅ Health Check
2. ✅ Submit Doubt #1 (Save ID)
3. ✅ Submit Doubt #2 (Save ID)
4. ✅ Submit Doubt #3 (Save ID)
5. ✅ Get All Doubts (should show 3)
6. ✅ Get Doubts by Teacher
7. ✅ Get Specific Doubt by ID
8. ✅ Get Statistics (0 answered, 3 pending)
9. ✅ Teacher Login
10. ✅ Submit Answer to Doubt #1
11. ✅ Submit Answer to Doubt #2
12. ✅ Get All Doubts (2 answered, 1 pending)
13. ✅ Get Statistics (2 answered, 1 pending)
14. ❌ Try answering same doubt again (should fail)

---

## 📥 Import Postman Collection

Save this as `WhisperBoard.postman_collection.json`:

```json
{
  "info": {
    "name": "WhisperBoard API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Submit Doubt",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"subject\": \"Database Systems\",\n  \"courseCode\": \"CS301\",\n  \"teacher\": \"Dr. Smith\",\n  \"question\": \"What is the difference between SQL and NoSQL databases?\"\n}"
        },
        "url": "{{baseUrl}}/doubts"
      }
    },
    {
      "name": "Get All Doubts",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{baseUrl}}/doubts"
      }
    },
    {
      "name": "Get Doubts by Teacher",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{baseUrl}}/doubts?teacher=Dr. Smith"
      }
    },
    {
      "name": "Submit Answer",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"answer\": \"SQL databases are relational with ACID properties. NoSQL databases are flexible and scalable.\"\n}"
        },
        "url": "{{baseUrl}}/doubts/REPLACE_WITH_DOUBT_ID/answer"
      }
    },
    {
      "name": "Teacher Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"teacher\",\n  \"password\": \"teacher123\"\n}"
        },
        "url": "{{baseUrl}}/teacher/login"
      }
    }
  ]
}
```

**To Import**:
1. Open Postman
2. Click **Import** button
3. Select the JSON file
4. Start testing!

---

## 🎯 Tips

- **Use Variables**: Store `doubtId` as Postman variable for reuse
- **Test Scripts**: Add auto-validation in Postman Tests tab
- **Environment**: Create separate environments for dev/prod
- **Documentation**: Use Postman's auto-documentation feature

---

## 🐛 Common Issues

### "Network Error"
- Ensure backend server is running
- Check `baseUrl` is correct

### "404 Not Found"
- Verify endpoint URL
- Check doubt ID is valid

### "500 Internal Server Error"
- Check Firebase credentials in `.env`
- Review backend logs

---

**Happy Testing! 🚀**
