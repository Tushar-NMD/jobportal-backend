### 👨‍💻 **User Flow**

### 1. Registration / Login

- User registers with **name, email, password**.
- Password is **hashed using bcrypt**.
- JWT token generated on login and stored in **localStorage** on frontend.

---

### 2. View Jobs

- React calls backend API:
    
    `GET /api/jobs`
    
- Backend fetches from MongoDB → sends all job details.
- User sees jobs with filters (title, skills, location, etc.).

---

### 3. Apply for a Job

- User clicks “Apply” on a job.
- Frontend opens form → upload resume (PDF/DOC).
- Resume file is sent via **Multer** to backend.

Backend steps:

1. Multer temporarily stores file.
2. File uploaded to **Cloudinary** → returns a secure URL.
3. New entry created in `Application` collection with:
    - jobId
    - userId
    - resumeUrl
    - status = “pending”
4. Email sent to user: “Your application for [job title] has been received.”

---

### 4. Track Application Status

- User can see list of applied jobs with current status (`pending`, `accepted`, `rejected`).
- React fetches via:
    
    `GET /api/user/applications`
    

---

### 5. Email Notification (Nodemailer)

- When Admin updates an application’s status,
    
    backend sends email using **Nodemailer**:
    
    - “Congratulations, your application was accepted.”
    - or “We regret to inform you your application was rejected.”

---

### 👨‍💼 **Admin Flow**

### 1. Admin Login

- Admin logs in with separate role (`role: 'admin'`).
- Gets JWT token with `role = admin`.
<!-- MARK--[DONE] -->
---

### 2. Post New Job

- Admin fills job details form.
- React sends request:
    
    `POST /api/jobs` with token.
    
- Backend validates admin role → saves job in MongoDB.

---

### 3. View All Applicants

- Admin selects a job → React calls:
    
    `GET /api/admin/jobs/:id/applicants`
    
- Backend joins `Application` + `User` collections and returns all applicants (with resume URLs).

---

### 4. Update Applicant Status

- Admin clicks “Accept” / “Reject” → React sends PUT request:
    
    `PUT /api/admin/application/:id/status`
    
- Backend updates MongoDB + sends **Nodemailer email** to user notifying the decision.


<!-- >>New backend flow>> -->
Admin

1 register [DONE]
2 login [DONE]
extra>> admin can also update his profile like photo and name and other details [DONE]
3 post job with all details + he/she can add logo(missing) [DONE]
4 get all list of applied job by employee[DONE]

5 get single employee by admin after this admin can update status of job then employee will get the notification of status         

employee

1: register[DONE]
2: Login[DONE]
extra>> employee can also update his profile [DONE]
like photo name email and other details and resume
3: get all list of jobs posted by admin[DONE]
4: get single job posted by admin[DONE]
5: apply for this job after getting single job with your resume and all detail[DONE]
6: get all applied job[DONE]
7: status of applied job

Extra

Add search and filter on jobs (by location, salary, etc.)

Add pagination for job listings

Add dashboard stats for Admin (total jobs, total applicants)