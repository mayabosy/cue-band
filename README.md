# Cue Band – Assistive Web Platform for Parkinson’s Users

This project presents a web-based companion application developed for the Cue Band initiative, aimed at supporting individuals with Parkinson’s Disease (PD) through accessible digital tools.

The goal of this project was to provide an alternative to the mobile app by offering a browser-based interface that improves accessibility, enhances user experience, and supports users who may find mobile interaction challenging.

## Overview

As part of the Cue Band initiative, this web application was designed to address usability barriers for individuals with Parkinson’s Disease. The application allows users to manage their wearable device, track symptom data, record journal entries, and schedule cueing sessions — all from a desktop or browser environment.

The application also contributes to ongoing research and development in accessible healthcare technology.


## Methodology

- **Technology Stack**:
  - Front-end: React, HTML, Tailwind CSS
  - Back-end: PHP
  - Database: SQLite
  - Authentication: Bcrypt, JSON Web Token (JWT)

- **System Features**:
  - Bluetooth integration with CueBand devices
  - User authentication and registration
  - Cue scheduling via manual input or questionnaires
  - Journal entries with heatmap visualisation
  - Secure login with password hashing and token-based sessions

- **Bluetooth Configuration**:
  - Users must bond the CueBand via the Lightblue app to enable Bluetooth communication.
  - **UUID:** `0E1D0004-9D33-4E5E-AEAD-E062834BD8BB`


- **Hardware Integration**:
  - The web application integrates with the Cue Band hardware, specifically the PINE64 PineTime Smartwatch.
  - It uses the Web Bluetooth API to enable wireless communication directly through the browser.
  - The Generic Attribute Profile (GATT) protocol is employed to manage Bluetooth data exchange between the web application and the device.


## Accessibility Considerations

The web application was specifically designed to accommodate the motor and cognitive challenges experienced by individuals with Parkinson’s Disease. Accessibility-focused design decisions included:

- Clear and minimal interface layouts to reduce cognitive load
- Large, high-contrast buttons and text to improve visibility and ease of interaction
- Intuitive navigation to support users with limited digital literacy
- Option to set cueing schedules through a guided, conversational-style interface or a manual form

## Features

### Band
- Connect and disconnect the CueBand via Bluetooth
- Synchronise band time and date

### Journal
- View and create note entries
- Record entries via manual input or questionnaire
- Visualise data through a heat map

### Scheduling (Cueing)
- Set cueing schedules
- Choose between manual and questionnaire-based scheduling modes

### Authentication
- Register new user accounts
- Log in with email and password
- Log out functionality
- Error handling for failed login attempts

## Future Work

- Add more visual accessibility features such as dark mode or screen reader compatibility
- Integrate calendar syncing with external tools (Google/Apple calendar)

## Setup Instructions

Before running the Cue Band Web Application locally, ensure you have the following installed:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

Then follow these steps:

```bash
# Install dependencies
npm install

# Install Tailwind CSS
npm install tailwindcss

# Start the development server
npm run dev
```

Once running, open your browser and navigate to `http://localhost:3000`.


## Research Impact

This project builds upon previous studies and user feedback collected from earlier iterations of the Cue Band mobile app. By offering a more accessible web-based alternative, the application aims to expand usage among individuals who may struggle with smartphones. The ultimate goal is to improve the quality of life for those with Parkinson’s Disease by enabling better symptom management through cueing, journaling, and personalised scheduling.

In the long term, this web application has the potential to increase Cue Band adoption and contribute valuable data and insights to ongoing Parkinson’s research, particularly in areas such as drooling symptom management and digital health interventions.

## Acknowledgements

This project was developed as part of the Individual Computing Project module (KV6003) at Northumbria University. It forms the basis of a final year dissertation, extending the Cue Band initiative to improve accessibility for individuals with Parkinson’s Disease.