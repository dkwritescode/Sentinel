# CybersecSME 
.mean-app
├── backend/
│   ├── node_modules/             # Node.js dependencies
│   ├── src/
│   │   ├── config/               # DB connection, API keys, server settings
│   │   ├── controllers/          # API logic (handling requests/responses)
│   │   ├── models/               # Mongoose schemas for MongoDB
│   │   ├── routes/               # Express route definitions
│   │   ├── services/             # Business logic (interacting with MongoDB, calling Python)
│   │   ├── app.ts                # Main Express application file
│   │   └── server.ts             # Server entry point
│   ├── tsconfig.json             # TypeScript configuration
│   └── package.json              # Backend dependencies
|
├── frontend/
│   ├── node_modules/             # Angular dependencies
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── pages/            # Page-level components (e.g., Dashboard, Login)
│   │   │   ├── services/         # Logic for API calls to the Node.js backend
│   │   │   ├── app-routing.module.ts
│   │   │   └── app.module.ts
│   │   ├── assets/               # Images, fonts
│   │   ├── environments/         # Dev/Prod configuration
│   │   └── index.html            # Main HTML file
│   └── angular.json              # Angular configuration
|
├── data_model/
│   ├── .venv/                    # Python Virtual Environment
│   ├── data_processor.py         # Main Python script for data tasks
│   ├── requirements.txt          # Python dependencies (e.g., pandas, scikit-learn)
│   ├── config.py                 # Configuration specific to Python scripts
│   └── notebooks/                # Optional: Jupyter notebooks for development/testing
|
├── .gitignore
├── README.md
└── docker-compose.yml            # (Optional) For running all services together
