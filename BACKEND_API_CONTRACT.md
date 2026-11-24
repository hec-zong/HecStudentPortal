# HEC Student Portal — Backend API Contract & Integration Guide

This document specifies the exact REST contracts, data payloads, and workflow state machines powering the **HEC Student Portal (Hec-e-Portal)**.

The frontend is architected **mock-first**. Backend developers can implement these endpoints on live microservices (Synapark workflow engine, Pakistan Qualification Register (PQR), and 1-Link / Kuickpay challan billing systems). When ready, toggling a single environment variable switches the frontend to your live APIs with **zero UI refactoring**.

---

## 1. Environment Configuration

| Variable                   | Default (Mock Mode)      | Production (Live Mode)      | Description                                                                                                |
| :------------------------- | :----------------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_USE_MOCK`     | `true`                   | `false`                     | When `true`, requests resolve to enriched JSON fixtures. When `false`, requests proxy to the live backend. |
| `NEXT_PUBLIC_API_BASE_URL` | _(Ignored in mock mode)_ | `https://api.hec.gov.pk/v1` | Root URL for live backend services.                                                                        |

---

## 2. Global Conventions

1. **Authentication:** All requests from authenticated sessions transmit standard Bearer token in the header:
   ```http
   Authorization: Bearer <JWT_ACCESS_TOKEN>
   ```
2. **Date Format:** All timestamps use ISO 8601 strings (e.g. `2026-11-24T10:30:00Z`).
3. **Currency & Fee:** All monetary values are integer or 2-decimal floats denominated in Pakistani Rupees (`PKR`).
4. **Standard CNIC Format:** 13-digit Pakistani CNIC formatted with hyphens: `XXXXX-XXXXXXX-X` (regex: `^[0-9]{5}-[0-9]{7}-[0-9]{1}$`).
5. **Standard Mobile Format:** `+923XXXXXXXXX` or `03XXXXXXXXX`.

---

## 3. Endpoints Specification

### 3.1 Student Session Bootstrap

- **Endpoint:** `GET /api/student/bootstrap`
- **Target Live Backend:** `GET ${NEXT_PUBLIC_API_BASE_URL}/student/bootstrap`
- **Description:** Fetches all data necessary to hydrate the student dashboard on login.
- **Query Parameters:**
  - `userType` _(optional)_: `first_time` | `returning` (Mock testing helper).
- **Response Payload (`200 OK`):**

```json
{
  "isFirstTimeUser": false,
  "hasSubmittedApplication": true,
  "profileCompletionPercentage": 92,
  "student": {
    "id": "std-98214",
    "cnic": "35202-1928374-1",
    "passportNumber": "AL9182341",
    "fullName": "Hamza Tariq Malik",
    "fatherOrHusbandName": "Tariq Malik",
    "dateOfBirth": "1999-04-12",
    "gender": "male",
    "maritalStatus": "single",
    "nationality": "Pakistani",
    "domicileProvince": "Punjab",
    "domicileDistrict": "Lahore",
    "email": "hamza.tariq@alumni.nust.edu.pk",
    "mobileNumber": "+923001234567",
    "postalAddress": {
      "line1": "House 14-B, Sector G, Phase 5, DHA",
      "city": "Lahore",
      "district": "Lahore",
      "province": "Punjab",
      "postalCode": "54792",
      "country": "Pakistan"
    },
    "permanentAddress": {
      "line1": "House 14-B, Sector G, Phase 5, DHA",
      "city": "Lahore",
      "district": "Lahore",
      "province": "Punjab",
      "postalCode": "54792",
      "country": "Pakistan"
    },
    "hasSpecialNeeds": false,
    "specialNeedDetails": null,
    "cnicFrontUrl": "https://storage.hec.gov.pk/mock/cnic-front.png",
    "cnicBackUrl": "https://storage.hec.gov.pk/mock/cnic-back.png",
    "isCnicVerified": true,
    "profilePictureUrl": "https://storage.hec.gov.pk/mock/avatar.jpg"
  },
  "pendingTasks": [
    {
      "id": "task-01",
      "title": "Action Required: Re-upload Clear Transcript Scan",
      "description": "L1 Controller flagged BS Transcript page 2 for application #APP-2024-9981.",
      "applicationId": "#APP-2024-9981",
      "actionType": "resubmit_doc",
      "dueDate": "2026-11-28",
      "priority": "high",
      "link": "/applications/#APP-2024-9981/track"
    }
  ],
  "hecWallet": [
    {
      "id": "wal-01",
      "title": "Attested HSSC Intermediate Sanad",
      "degreeLevel": "HSSC",
      "programName": "Pre-Engineering Certificate",
      "university": "Board of Intermediate and Secondary Education, Lahore",
      "serialNumber": "HEC-ATT-2023-091823",
      "qrCodeData": "https://verify.hec.gov.pk/qr/HEC-ATT-2023-091823",
      "attestationDate": "2023-08-14",
      "verificationHash": "0x9f83ab2148dc82910fae",
      "status": "active",
      "downloadUrl": "https://storage.hec.gov.pk/mock/attested-hssc.pdf",
      "issuedBy": "HEC Regional Centre Lahore"
    }
  ],
  "recentApplications": [
    {
      "id": "#APP-2024-9981",
      "serviceName": "Degree & Transcript Attestation (BS Computer Science)",
      "submittedAt": "2026-11-18T10:30:00Z",
      "status": "resubmit_required",
      "statusLabel": "Resubmit Required",
      "currentStage": "L1 Controller Review",
      "amountPaid": 2700,
      "actionRequired": true,
      "actionMessage": "Reviewer requested re-upload of BS transcript page 2."
    }
  ]
}
```

---

### 3.2 Synapark Dynamic Form Schema

- **Endpoint:** `GET /api/synapark/form/:serviceId`
- **Target Live Backend:** `GET ${NEXT_PUBLIC_API_BASE_URL}/synapark/form/:serviceId`
- **Description:** Retrieves the active JSON form schema driving the student multi-step wizard. The frontend uses `createDynamicSynaparkStepZodSchema` to convert this schema into runtime Zod validators automatically.
- **Response Payload (`200 OK`):**

```json
{
  "serviceId": "hec-degree-attestation-v2",
  "title": "HEC Degree & Transcript Attestation Service",
  "description": "Official Higher Education Commission verified attestation workflow.",
  "version": "2.4.0",
  "steps": [
    {
      "id": "step-personal-info",
      "stepNumber": 1,
      "title": "Personal Details & Identity",
      "shortTitle": "Personal Info",
      "description": "Verify your identity credentials.",
      "sections": [
        {
          "id": "sec-identity",
          "title": "National Identity & Biometrics",
          "fields": [
            {
              "id": "f-cnic",
              "name": "cnic",
              "label": "CNIC / NICOP Number",
              "type": "text",
              "validation": {
                "required": true,
                "pattern": "^[0-9]{5}-[0-9]{7}-[0-9]{1}$"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 3.3 Application Submission

- **Endpoint:** `POST /api/synapark/applications`
- **Target Live Backend:** `POST ${NEXT_PUBLIC_API_BASE_URL}/synapark/applications`
- **Description:** Ingests student form submission, creates application in worker portal queue, and generates 1-Link PSID challan.
- **Request Payload:**

```json
{
  "serviceId": "hec-degree-attestation-v2",
  "formData": {
    "cnic": "35202-1928374-1",
    "fullName": "Hamza Tariq Malik",
    "hasSpecialNeeds": false,
    "academicHistory": [
      {
        "degreeLevelId": "dl-16",
        "programTitle": "BS Computer Science",
        "institutionName": "National University of Sciences and Technology (NUST)",
        "rollNumber": "19-SEECS-BSCS-044",
        "passingYear": 2023,
        "documentDegreeUrl": "https://storage.hec.gov.pk/mock/degree.pdf",
        "documentTranscriptUrl": "https://storage.hec.gov.pk/mock/transcript.pdf"
      }
    ]
  },
  "attestationSelection": [
    {
      "academicRecordId": "rec-01",
      "degreeLevel": "Bachelor Degree (4-Year BS)",
      "programTitle": "BS Computer Science",
      "universityOrBoard": "NUST",
      "passingYear": 2023,
      "rollNumber": "19-SEECS-BSCS-044",
      "registrationNumber": "2019-NUST-REG-9812",
      "selectedDocuments": [
        {
          "type": "Degree",
          "attestOriginal": true,
          "copiesCount": 1,
          "originalFee": 1000,
          "copyFee": 700,
          "subtotal": 1700
        }
      ],
      "itemTotal": 1700
    }
  ]
}
```

- **Response Payload (`201 Created`):**

```json
{
  "success": true,
  "applicationId": "#APP-2026-8812",
  "trackingId": "HEC-SYN-8812-ISB",
  "challan": {
    "challanNumber": "HEC-CH-2024-91024",
    "psid": "10009823481239102",
    "totalAmount": 1700,
    "dueDate": "2026-12-01",
    "status": "unpaid"
  }
}
```

---

### 3.4 Granular Application Tracking & Worker Audit Trail

- **Endpoint:** `GET /api/synapark/applications/:id/track`
- **Target Live Backend:** `GET ${NEXT_PUBLIC_API_BASE_URL}/synapark/applications/:id/track`
- **Description:** Retrieves the complete stage progression pipeline along with worker comments, rejection reasons, and re-upload permissions.
- **Stage Sequence:**
  1. `submitted` — Application Received & Logged
  2. `scrutiny` — Initial Desk Review & PQR Matching
  3. `l1_controller` — Assistant Director Attestation Review
  4. `l2_controller` — Deputy Director Final Concurrence
  5. `attestation` — Digital Stamping & Security Seal Printing
  6. `completed_dispatched` — Handover to Courier / Issuance
- **Response Payload (`200 OK`):**

```json
{
  "id": "#APP-2024-9981",
  "trackingId": "HEC-SYN-9981-LHR",
  "serviceType": "Degree & Transcript Attestation",
  "submittedAt": "2026-11-18T10:30:00Z",
  "overallStatus": "resubmit_required",
  "currentStage": "l1_controller",
  "currentStageIndex": 2,
  "totalStages": 6,
  "stages": [
    {
      "stage": "submitted",
      "title": "Application Received & Logged",
      "description": "Application logged with verified e-challan.",
      "status": "approved",
      "startedAt": "2026-11-18T10:30:00Z",
      "completedAt": "2026-11-18T10:30:05Z"
    },
    {
      "stage": "scrutiny",
      "title": "Initial Desk Review & PQR Matching",
      "description": "PQR accreditation confirmed.",
      "status": "approved",
      "startedAt": "2026-11-19T08:30:00Z",
      "completedAt": "2026-11-20T11:45:00Z",
      "assignedWorker": {
        "name": "Nasir Mehmood",
        "role": "Scrutiny Officer - Desk 04",
        "department": "Accreditation Cell"
      }
    },
    {
      "stage": "l1_controller",
      "title": "Assistant Director Attestation Review (L1)",
      "description": "Detailed scrutiny of university seals and transcripts.",
      "status": "resubmit_required",
      "startedAt": "2026-11-21T09:00:00Z",
      "assignedWorker": {
        "name": "Dr. Farhan Akhtar",
        "role": "Assistant Director Attestation",
        "department": "Attestation Division"
      }
    },
    {
      "stage": "l2_controller",
      "title": "Deputy Director Final Concurrence (L2)",
      "description": "Final authorization.",
      "status": "pending"
    },
    {
      "stage": "attestation",
      "title": "Digital Stamping & Security Seal Printing",
      "description": "Security stamp affixed.",
      "status": "pending"
    },
    {
      "stage": "completed_dispatched",
      "title": "Dispatched / Complete",
      "description": "Couriered to student.",
      "status": "pending"
    }
  ],
  "commentsTrail": [
    {
      "id": "cm-02",
      "stage": "l1_controller",
      "stageName": "L1 Controller Review",
      "reviewerRole": "Assistant Director Attestation",
      "reviewerName": "Dr. Farhan Akhtar",
      "comment": "Transcript page 2 scan is blurry; the grading criteria table is illegible. Please re-upload a clear scan.",
      "type": "resubmit_required",
      "rejectionReason": "Blurry document scan on transcript grading key",
      "affectedDocumentType": "Transcript",
      "isReuploadAllowed": true,
      "createdAt": "2026-11-21T14:15:00Z",
      "resolvedAt": null
    }
  ]
}
```

---

### 3.5 Document Resubmission

- **Endpoint:** `POST /api/synapark/applications/:id/track`
- **Target Live Backend:** `POST ${NEXT_PUBLIC_API_BASE_URL}/synapark/applications/:id/resubmit`
- **Description:** Student submits an updated scan in response to an `isReuploadAllowed: true` rejection remark.
- **Request Payload:**

```json
{
  "applicationId": "#APP-2024-9981",
  "rejectionTrailId": "cm-02",
  "documentType": "Transcript",
  "newDocumentUrl": "https://storage.hec.gov.pk/uploads/transcript-scan-clear.pdf",
  "studentNote": "Uploaded 600 DPI color scan with legible grading table and seal."
}
```

- **Response Payload (`200 OK`):**

```json
{
  "success": true,
  "application": {
    "id": "#APP-2024-9981",
    "overallStatus": "in_progress",
    "currentStage": "l1_controller"
  }
}
```

---

### 3.6 PQR Universities Master Data

- **Endpoint:** `GET /api/pqr/universities`
- **Target Live Backend:** `GET ${NEXT_PUBLIC_API_BASE_URL}/pqr/universities`
- **Query Parameters:**
  - `search` _(optional)_: Text filter matching university name, abbreviation, or city.
  - `province` _(optional)_: `Punjab` | `Sindh` | `Federal` | `Khyber Pakhtunkhwa` | `Balochistan`.
- **Response Payload (`200 OK`):**

```json
[
  {
    "id": "uni-nust-02",
    "code": "NUST-ISB",
    "name": "National University of Sciences and Technology",
    "shortName": "NUST",
    "sector": "public",
    "province": "Federal",
    "city": "Islamabad",
    "charterYear": 1991,
    "isAccredited": true,
    "mainCampus": "H-12 Sector, Islamabad",
    "campuses": ["Rawalpindi", "Karachi", "Risalpur"]
  }
]
```

---

### 3.7 E-Challan Generation & Payment Proof Submission

- **Endpoint:** `POST /api/billing/challan`
- **Target Live Backend:**
  - For generation: `POST ${NEXT_PUBLIC_API_BASE_URL}/billing/challan`
  - For payment verification: `POST ${NEXT_PUBLIC_API_BASE_URL}/billing/challan/verify-payment`

#### Action A: Generate Challan

- **Request Payload:**

```json
{
  "applicationId": "#APP-2026-9812",
  "degrees": [
    {
      "academicRecordId": "rec-01",
      "degreeLevel": "Bachelor Degree (4-Year BS)",
      "programTitle": "BS Computer Science",
      "universityOrBoard": "NUST",
      "passingYear": 2023,
      "rollNumber": "19-SEECS-BSCS-044",
      "registrationNumber": "2019-NUST-REG-9812",
      "selectedDocuments": [
        {
          "type": "Degree",
          "attestOriginal": true,
          "copiesCount": 2,
          "originalFee": 1000,
          "copyFee": 700,
          "subtotal": 2400
        }
      ],
      "itemTotal": 2400
    }
  ]
}
```

- **Response Payload (`201 Created`):**

```json
{
  "challanNumber": "HEC-CH-2024-88491",
  "psid": "10009823481239841",
  "applicationId": "#APP-2026-9812",
  "studentCnic": "35202-1928374-1",
  "studentName": "Hamza Tariq Malik",
  "issueDate": "2026-11-24",
  "dueDate": "2026-12-01",
  "itemsBreakdown": [
    {
      "description": "Original BS Degree",
      "quantity": 1,
      "unitPrice": 1000,
      "total": 1000
    },
    {
      "description": "BS Degree Copies",
      "quantity": 2,
      "unitPrice": 700,
      "total": 1400
    }
  ],
  "totalAmount": 2400,
  "currency": "PKR",
  "status": "unpaid",
  "paymentMode": "1link_atm_mobile"
}
```

#### Action B: Submit Paid Proof

- **Request Payload:**

```json
{
  "action": "verify_payment",
  "challanNumber": "HEC-CH-2024-88491",
  "paymentMode": "1link_atm_mobile",
  "transactionReference": "FT2432810948",
  "paidReceiptUrl": "https://storage.hec.gov.pk/mock/receipt-screenshot.jpg",
  "paidAt": "2026-11-24T11:00:00Z",
  "bankBranch": "Meezan Bank Mobile App"
}
```

- **Response Payload (`200 OK`):**

```json
{
  "success": true,
  "challan": {
    "challanNumber": "HEC-CH-2024-88491",
    "status": "paid",
    "paidAt": "2026-11-24T11:00:00Z",
    "transactionReference": "FT2432810948"
  }
}
```

---

## 4. Testing Endpoints Locally

You can test all endpoints using `curl` while running `yarn dev` on `http://localhost:3000`:

```bash
# 1. Test student session bootstrap
curl http://localhost:3000/api/student/bootstrap

# 2. Test first-time user bootstrap
curl "http://localhost:3000/api/student/bootstrap?userType=first_time"

# 3. Test Synapark Form Schema
curl http://localhost:3000/api/synapark/form/hec-degree-attestation-v2

# 4. Test PQR Universities
curl "http://localhost:3000/api/pqr/universities?search=nust"

# 5. Test Application Tracking with Comments Trail
curl "http://localhost:3000/api/synapark/applications/%23APP-2024-9981/track"

# 6. Test E-Challan Query
curl "http://localhost:3000/api/billing/challan?challanNumber=HEC-CH-2024-99812"
```
