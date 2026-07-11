# AK BloodBridge

## Project Objective

AK BloodBridge is a full-stack web application that connects blood donors with patients in need by providing real-time nearby donor search, emergency blood requests, and blood compatibility matching.

The system aims to reduce the time required to find eligible blood donors during emergencies through location-based search and smart donor filtering.

---

# User Roles

## 1. User

A user can act as both:

- Blood Donor
- Blood Receiver

There is only one account type for normal users.

## 2. Admin

The administrator manages users, emergency requests, reports, and application statistics.

---

# User Journey

Visitor

↓

Landing Page

↓

Register

↓

Login

↓

Dashboard

↓

Choose an Action

- Donate Blood
- Need Blood

↓

If Donate Blood

- Complete Profile
- Enable Availability
- Update Current Location
- View Incoming Requests
- Accept or Reject Donation Requests
- View Donation History
- Track Next Eligible Donation Date

↓

If Need Blood

- Search Nearby Donors
- Search by Blood Group
- View Compatible Blood Groups
- Create Emergency Blood Request
- Track Request Status
- View Previous Requests

↓

Donation Completed

↓

Donation History Updated

↓

Next Eligible Donation Date Calculated

---

# Functional Requirements

## Authentication

- Register
- Login
- Logout
- JWT Authentication
- Password Encryption
- Protected Routes

---

## User Profile

A user should be able to:

- Edit Profile
- Upload Profile Picture
- Update Phone Number
- Update Address
- Update Current Location
- Enable / Disable Donation Availability
- Update Last Donation Date

---

## Blood Donation

The application should allow users to:

- Search Nearby Donors
- Search by Blood Group
- Find Compatible Donors Automatically
- View Donor Details
- Send Blood Request
- Accept Blood Request
- Reject Blood Request
- Cancel Blood Request

---

## Emergency Blood Request

Users can create emergency requests containing:

- Patient Name
- Blood Group
- Units Required
- Hospital Name
- Hospital Address
- Current Location
- Emergency Level
- Additional Notes

Nearby eligible donors should receive the request.

---

## Blood Compatibility

The application should automatically determine compatible blood groups.

Example:

Patient Blood Group:

A+

Eligible Donors:

- A+
- A-
- O+
- O-

The user should not manually search for every compatible blood group.

---

## Location Services

The application should:

- Get User GPS Location
- Store Latitude & Longitude
- Find Nearby Donors
- Sort Donors by Distance
- Show Distance from User

---

## Dashboard

The user dashboard should display:

- Profile Summary
- Availability Status
- Donation History
- Blood Request History
- Incoming Requests
- Notifications
- Next Eligible Donation Date

---

## Notifications

Users should receive notifications when:

- Someone requests their blood group
- Their request is accepted
- A request is rejected
- Donation is completed

---

## Admin Features

Admin should be able to:

- View All Users
- Search Users
- Delete Fake Accounts
- View Emergency Requests
- Update Request Status
- View Dashboard Analytics
- View Blood Group Statistics
- Monitor Active Users

---

# Non-Functional Requirements

- Responsive Design
- Secure Authentication
- Fast Nearby Search
- Clean User Interface
- Mobile Friendly
- Scalable Backend
- RESTful API
- TypeScript Support

---

# Future Enhancements

- AI Chat Assistant
- Hospital Portal
- Blood Bank Integration
- SMS Notifications
- Email Notifications
- Push Notifications
- Live Chat
- Real-Time Tracking
- Donation Certificates
- Dark Mode

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS (later)

## Backend

- Node.js
- Express
- TypeScript

## Database

- MongoDB Atlas

## Authentication

- JWT
- bcrypt

## Maps

- Leaflet
- OpenStreetMap

## Deployment

- Vercel
- Render
- MongoDB Atlas

---

# Project Goal

Develop a production-ready full-stack web application that demonstrates:

- Frontend Development
- Backend Development
- REST API Design
- Authentication
- Database Design
- Geolocation Services
- Blood Compatibility Logic
- Real-Time Features
- Clean Architecture
- Deployment