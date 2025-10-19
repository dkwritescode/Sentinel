# Sentinel-SME ML Backend

This directory contains the Machine Learning backend for the Sentinel-SME cybersecurity application.

## 🚀 Features

- **URL Threat Detection**: AI-powered malicious URL detection using LightGBM
- **Email Phishing Detection**: Rule-based and ML-powered phishing email detection
- **Fraud Detection**: Transaction fraud analysis
- **Real-time API**: RESTful API for threat detection services

## 📁 Structure

```
ml-backend/
├── ml_api.py              # Main ML API server
├── start_ml_api.py        # Startup script
├── requirements.txt       # Python dependencies
├── train_model.py         # Model training script
├── MURLD.ipynb           # Jupyter notebook for analysis
├── data/                 # Training data
│   ├── emails.csv        # Email dataset
│   └── urls.csv          # URL dataset
├── *.pkl                 # Trained ML models
└── *.png                 # Analysis visualizations
```

## 🛠️ Setup

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the ML API Server**:
   ```bash
   python start_ml_api.py
   ```
   
   Or directly:
   ```bash
   python ml_api.py
   ```

3. **API will be available at**: `http://localhost:5001`

## 📊 API Endpoints

### Health Check
- **GET** `/health` - Check API status

### URL Threat Detection
- **POST** `/predict/url`
  ```json
  {
    "url": "https://example.com/suspicious-link"
  }
  ```

### Email Phishing Detection
- **POST** `/predict/email`
  ```json
  {
    "subject": "Urgent: Verify Your Account",
    "body": "Click here to verify your account immediately..."
  }
  ```

### Fraud Detection
- **POST** `/analyze/fraud`
  ```json
  {
    "amount": 15000,
    "location": "Unknown",
    "merchant": "Test Store",
    "time": "night"
  }
  ```

## 🤖 ML Models

- **LightGBM Model**: Trained on URL features for malicious URL detection
- **Label Encoder**: For categorical feature encoding
- **Feature Engineering**: Automated feature extraction from URLs and emails

## 📈 Training Data

- **URLs Dataset**: 100,000+ URLs with labels (malicious/benign)
- **Emails Dataset**: Phishing email samples for training
- **Features**: 20+ engineered features per URL/email

## 🔧 Development

To retrain the models:

1. Update the training data in `data/` directory
2. Run the training notebook: `MURLD.ipynb`
3. Update the model files: `lightgbm_model.pkl`, `label_encoder.pkl`

## 🌐 Integration

The ML API integrates with the main Sentinel server to provide:
- Real-time threat detection
- AI-powered security analysis
- Automated risk assessment
- Enhanced phishing detection

## 📝 Notes

- The ML API runs on port 5001 by default
- Models are loaded on startup
- All predictions include confidence scores and risk levels
- API responses include detailed feature analysis
