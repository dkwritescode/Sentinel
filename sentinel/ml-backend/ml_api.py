#!/usr/bin/env python3
"""
Sentinel-SME ML API Server
Provides AI/ML powered threat detection services
"""

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import pickle
import os
import re
from urllib.parse import urlparse
import tldextract
import whois
import socket
import requests
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load ML models
MODEL_PATH = os.path.dirname(os.path.abspath(__file__))
LIGHTGBM_MODEL = None
LABEL_ENCODER = None

def load_models():
    """Load the trained ML models"""
    global LIGHTGBM_MODEL, LABEL_ENCODER
    
    try:
        with open(os.path.join(MODEL_PATH, 'lightgbm_model.pkl'), 'rb') as f:
            LIGHTGBM_MODEL = pickle.load(f)
        
        with open(os.path.join(MODEL_PATH, 'label_encoder.pkl'), 'rb') as f:
            LABEL_ENCODER = pickle.load(f)
        
        logger.info("✅ ML models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")

def extract_url_features(url):
    """Extract features from URL for ML prediction"""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        path = parsed.path
        query = parsed.query
        
        # Basic URL features
        features = {
            'url_length': len(url),
            'domain_length': len(domain),
            'path_length': len(path),
            'query_length': len(query),
            'num_dots': url.count('.'),
            'num_hyphens': url.count('-'),
            'num_underscores': url.count('_'),
            'num_slashes': url.count('/'),
            'num_question_marks': url.count('?'),
            'num_equals': url.count('='),
            'num_ampersands': url.count('&'),
            'num_percent': url.count('%'),
            'num_digits': sum(c.isdigit() for c in url),
            'has_https': 1 if url.startswith('https://') else 0,
            'has_http': 1 if url.startswith('http://') else 0,
            'has_www': 1 if 'www.' in domain else 0,
            'has_ip': 1 if re.match(r'^\d+\.\d+\.\d+\.\d+$', domain) else 0,
            'has_port': 1 if ':' in domain else 0,
            'is_shortened': 1 if any(shortener in domain for shortener in ['bit.ly', 'tinyurl', 'goo.gl', 't.co']) else 0,
            'suspicious_tld': 1 if any(tld in domain for tld in ['.tk', '.ml', '.ga', '.cf']) else 0,
            'suspicious_keywords': 1 if any(keyword in url.lower() for keyword in ['phish', 'scam', 'fake', 'suspicious']) else 0
        }
        
        # Domain analysis
        try:
            ext = tldextract.extract(domain)
            features['subdomain_length'] = len(ext.subdomain)
            features['domain_name_length'] = len(ext.domain)
            features['tld_length'] = len(ext.suffix)
        except:
            features['subdomain_length'] = 0
            features['domain_name_length'] = 0
            features['tld_length'] = 0
        
        return features
    except Exception as e:
        logger.error(f"Error extracting URL features: {e}")
        return None

def extract_email_features(email_subject, email_body=""):
    """Extract features from email for phishing detection"""
    try:
        text = f"{email_subject} {email_body}".lower()
        
        features = {
            'subject_length': len(email_subject),
            'body_length': len(email_body),
            'total_length': len(text),
            'num_urgent_words': sum(1 for word in ['urgent', 'immediate', 'asap', 'critical', 'emergency'] if word in text),
            'num_suspicious_words': sum(1 for word in ['verify', 'confirm', 'update', 'suspended', 'expired', 'security'] if word in text),
            'num_links': len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)),
            'num_attachments': text.count('attachment'),
            'has_greeting': 1 if any(greeting in text for greeting in ['dear', 'hello', 'hi', 'greetings']) else 0,
            'has_signature': 1 if any(sig in text for sig in ['sincerely', 'regards', 'best', 'thanks']) else 0,
            'num_caps': sum(1 for c in text if c.isupper()),
            'caps_ratio': sum(1 for c in text if c.isupper()) / max(len(text), 1),
            'num_exclamation': text.count('!'),
            'num_question': text.count('?'),
            'has_sender_info': 1 if any(info in text for info in ['from:', 'sent:', 'date:']) else 0,
            'suspicious_sender': 1 if any(sender in text for sender in ['noreply', 'no-reply', 'support', 'security']) else 0
        }
        
        return features
    except Exception as e:
        logger.error(f"Error extracting email features: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Sentinel ML API',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': LIGHTGBM_MODEL is not None
    })

@app.route('/predict/url', methods=['POST'])
def predict_url():
    """Predict if URL is malicious"""
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Extract features
        features = extract_url_features(url)
        if not features:
            return jsonify({'error': 'Failed to extract features'}), 500
        
        # Convert to DataFrame
        feature_df = pd.DataFrame([features])
        
        # Make prediction
        if LIGHTGBM_MODEL:
            prediction = LIGHTGBM_MODEL.predict(feature_df)[0]
            probability = LIGHTGBM_MODEL.predict_proba(feature_df)[0]
            
            # Convert prediction to readable format
            is_malicious = prediction == 1
            confidence = max(probability) * 100
            
            risk_level = 'High' if confidence > 80 else 'Medium' if confidence > 60 else 'Low'
            
            return jsonify({
                'url': url,
                'is_malicious': bool(is_malicious),
                'confidence': round(confidence, 2),
                'risk_level': risk_level,
                'features': features,
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({'error': 'ML model not loaded'}), 500
            
    except Exception as e:
        logger.error(f"Error in URL prediction: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/predict/email', methods=['POST'])
def predict_email():
    """Predict if email is phishing"""
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        body = data.get('body', '')
        
        if not subject:
            return jsonify({'error': 'Email subject is required'}), 400
        
        # Extract features
        features = extract_email_features(subject, body)
        if not features:
            return jsonify({'error': 'Failed to extract features'}), 500
        
        # Convert to DataFrame
        feature_df = pd.DataFrame([features])
        
        # Make prediction (using a simple rule-based approach for now)
        # In a real implementation, you'd use a trained email model
        phishing_score = 0
        
        # Rule-based phishing detection
        if features['num_urgent_words'] > 2:
            phishing_score += 30
        if features['num_suspicious_words'] > 3:
            phishing_score += 25
        if features['num_links'] > 2:
            phishing_score += 20
        if features['caps_ratio'] > 0.3:
            phishing_score += 15
        if features['num_exclamation'] > 3:
            phishing_score += 10
        
        is_phishing = phishing_score > 50
        confidence = min(phishing_score, 100)
        
        risk_level = 'High' if confidence > 80 else 'Medium' if confidence > 60 else 'Low'
        
        return jsonify({
            'subject': subject,
            'is_phishing': bool(is_phishing),
            'confidence': round(confidence, 2),
            'risk_level': risk_level,
            'phishing_score': phishing_score,
            'features': features,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in email prediction: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/analyze/fraud', methods=['POST'])
def analyze_fraud():
    """Analyze transaction for fraud detection"""
    try:
        data = request.get_json()
        
        # Simple fraud detection based on transaction patterns
        amount = data.get('amount', 0)
        location = data.get('location', '')
        time = data.get('time', '')
        merchant = data.get('merchant', '')
        
        fraud_score = 0
        reasons = []
        
        # Amount-based checks
        if amount > 10000:
            fraud_score += 30
            reasons.append('High amount transaction')
        
        # Location-based checks
        if 'unknown' in location.lower():
            fraud_score += 25
            reasons.append('Unknown location')
        
        # Time-based checks (simplified)
        if time and 'night' in time.lower():
            fraud_score += 15
            reasons.append('Unusual transaction time')
        
        # Merchant-based checks
        if any(suspicious in merchant.lower() for suspicious in ['test', 'fake', 'suspicious']):
            fraud_score += 40
            reasons.append('Suspicious merchant')
        
        is_fraud = fraud_score > 60
        confidence = min(fraud_score, 100)
        
        risk_level = 'High' if confidence > 80 else 'Medium' if confidence > 60 else 'Low'
        
        return jsonify({
            'is_fraud': bool(is_fraud),
            'confidence': round(confidence, 2),
            'risk_level': risk_level,
            'fraud_score': fraud_score,
            'reasons': reasons,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in fraud analysis: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Load models on startup
    load_models()
    
    # Start the server
    port = int(os.environ.get('ML_API_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
