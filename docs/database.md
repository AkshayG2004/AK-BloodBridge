# Database Design

---

# 1. Users

Stores information about every registered user.

Fields:

- id
- name
- email
- password
- phone
- profilePhoto
- bloodGroup
- dateOfBirth
- gender
- weight
- city

- currentLocation
    - latitude
    - longitude

- availableToDonate

- lastDonationDate

- nextEligibleDonationDate

- totalDonations

- role
    - user
    - admin

- createdAt
- updatedAt

---

# 2. BloodRequests

Stores every blood request created by users.

Fields:

- requestId
- createdBy (User ID)
- patientName
- patientAge
- bloodGroup
- unitsRequired
- hospitalName
- hospitalAddress

- location
    - latitude
    - longitude

- urgency
    - Normal
    - Urgent
    - Critical

- status
    - Pending
    - Accepted
    - Completed
    - Cancelled

- acceptedBy (User ID)

- notes

- createdAt
- updatedAt
---

# 3. DonationHistory

Stores every completed blood donation.

Fields:

- donationId
- requestId

- donorId
- receiverId

- donorBloodGroup

- unitsDonated

- hospitalName

- donationDate

- status
    - Completed
    - Cancelled

- remarks

- createdAt

# 4. Notifications

Stores all notifications sent to users.

Fields:

- notificationId

- userId

- title

- message

- type
    - Blood Request
    - Accepted
    - Completed
    - Reminder
    - System

- isRead

- requestId (Optional)

- createdAt