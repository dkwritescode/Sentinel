import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Import models
import User from './models/User.js';
import Activity from './models/Activity.js';
import Report from './models/Report.js';
import Mission from './models/Mission.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage for demo
const storage = {
  passwords: [],
  activity: [],
  reports: [],
  missions: [],
  threats: [],
  heatmap: []
};

// File upload handling
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'Sentinel API', time: new Date().toISOString() });
});

// Simple URL "scan" mock
app.post('/api/scan/url', (req, res) => {
  const { url } = req.body || {};
  const text = String(url || '').toLowerCase();
  const isMal = /phish|suspicious|malware|login|verify/.test(text) || Math.random() > 0.6;
  res.json({
    type: 'url',
    status: isMal ? 'THREAT DETECTED' : 'SAFE',
    details: isMal
      ? 'This URL shows signs of phishing or malware distribution.'
      : 'No threats detected. URL appears safe.',
    risk: isMal ? 'Critical' : 'Low'
  });
});

// Simple Email phishing mock
app.post('/api/scan/email', (req, res) => {
  const { subject = '', body = '' } = req.body || {};
  const text = `${subject} ${body}`.toLowerCase();
  const isPhish = /(urgent|verify|suspended|password|reset|invoice|wire transfer|click here|verify account)/.test(text) || Math.random() > 0.5;
  res.json({
    type: 'email',
    status: isPhish ? 'PHISHING DETECTED' : 'SAFE',
    details: isPhish
      ? 'Email contains phishing indicators: urgency, suspicious requests or links.'
      : 'No phishing patterns detected.',
    risk: isPhish ? 'High' : 'Low'
  });
});

// Fraud detection endpoint
app.post('/api/scan/fraud', (req, res) => {
  const { transaction = '', amount = 0, merchant = '', location = '' } = req.body || {};
  const text = `${transaction} ${merchant} ${location}`.toLowerCase();
  const isFraud = /(wire transfer|bitcoin|crypto|urgent payment|verify identity|suspended account)/.test(text) || 
                  (amount > 10000) || 
                  Math.random() > 0.7;
  res.json({
    type: 'fraud',
    status: isFraud ? 'FRAUD DETECTED' : 'SAFE',
    details: isFraud
      ? 'Transaction shows signs of fraud: suspicious patterns, high amount, or unusual merchant.'
      : 'No fraud patterns detected.',
    risk: isFraud ? 'Critical' : 'Low'
  });
});

// Simple chatbot helper
app.post('/api/chat', (req, res) => {
  const { message = '' } = req.body || {};
  const input = message.toLowerCase();
  let response;
  if (input.includes('phishing') || input.includes('email')) {
    response = 'Phishing emails use urgency, spoofed senders, and malicious links. Verify requests via another channel and scan suspicious messages with Sentinel.';
  } else if (input.includes('password')) {
    response = 'Use 12+ chars with upper/lower/numbers/symbols. Use a manager and unique passwords per site.';
  } else if (input.includes('breach') || input.includes('hack')) {
    response = 'Disconnect from network, enable Panic Mode, rotate credentials, and notify IT/authorities.';
  } else {
    response = 'I can help with phishing detection, password safety, malware prevention, and incident response.';
  }
  res.json({ reply: response });
});

// Activity log with enhanced features
app.get('/api/activity', async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'username email');
    res.json({ items: activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.post('/api/activity', async (req, res) => {
  try {
    const activity = new Activity({
      type: req.body.type || 'General',
      details: req.body.details || '',
      threatType: req.body.threatType || 'other',
      severity: req.body.severity || 'Low',
      risk: req.body.risk || 'Low',
      metadata: req.body.metadata || {}
    });
    
    await activity.save();
    res.json({ ok: true, id: activity._id });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// File integrity checker
app.post('/api/file/integrity', (req, res) => {
  const { filename, hash } = req.body;
  const filePath = path.join(uploadDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.json({ status: 'FILE_NOT_FOUND', integrity: false });
  }
  
  const fileBuffer = fs.readFileSync(filePath);
  const calculatedHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const integrity = calculatedHash === hash;
  
  storage.activity.push({
    type: 'File Integrity Check',
    filename,
    integrity,
    time: new Date().toISOString()
  });
  
  res.json({ 
    status: integrity ? 'INTEGRITY_VERIFIED' : 'INTEGRITY_FAILED',
    integrity,
    calculatedHash,
    providedHash: hash
  });
});

// File encryption/decryption
app.post('/api/file/encrypt', (req, res) => {
  const { filename, password } = req.body;
  const filePath = path.join(uploadDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.json({ status: 'FILE_NOT_FOUND' });
  }
  
  const fileBuffer = fs.readFileSync(filePath);
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(fileBuffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const encryptedPath = path.join(uploadDir, `${filename}.encrypted`);
  fs.writeFileSync(encryptedPath, encrypted);
  
  res.json({ 
    status: 'ENCRYPTED',
    encryptedFile: `${filename}.encrypted`,
    iv: iv.toString('hex')
  });
});

// Network intrusion detection
app.get('/api/network/scan', (_req, res) => {
  const threats = [
    { ip: '192.168.1.105', type: 'Failed Login', severity: 'Medium', time: '07:22' },
    { ip: '10.0.0.45', type: 'Port Scan', severity: 'High', time: '08:15' },
    { ip: '172.16.0.23', type: 'Suspicious Traffic', severity: 'Low', time: '09:30' }
  ];
  
  res.json({
    status: 'SCAN_COMPLETE',
    threats,
    totalConnections: Math.floor(Math.random() * 50) + 20,
    blockedIPs: Math.floor(Math.random() * 10) + 5,
    networkHealth: 'SECURE'
  });
});

// Email summarizer
app.post('/api/email/summarize', (req, res) => {
  const { subject, body } = req.body;
  const text = `${subject} ${body}`;
  
  // Simple keyword-based summarization
  const keywords = text.toLowerCase().match(/\b(urgent|important|security|password|verify|suspended|payment|invoice|wire transfer)\b/g) || [];
  const summary = {
    keyPoints: keywords.slice(0, 3),
    riskLevel: keywords.length > 2 ? 'High' : keywords.length > 0 ? 'Medium' : 'Low',
    actionRequired: keywords.some(k => ['urgent', 'verify', 'suspended'].includes(k)),
    summary: `Email contains ${keywords.length} security-related keywords: ${keywords.join(', ')}`
  };
  
  res.json(summary);
});

// Threat heatmap data
app.get('/api/threats/heatmap', (_req, res) => {
  const heatmapData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    threats: Math.floor(Math.random() * 10),
    severity: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
  }));
  
  res.json({ heatmap: heatmapData });
});

// Cyber missions
app.get('/api/missions', async (req, res) => {
  try {
    let missions = await Mission.find({ isActive: true });
    
    // If no missions exist, create default ones
    if (missions.length === 0) {
      const defaultMissions = [
        {
          title: 'Phishing Defense Master',
          description: 'Complete 5 phishing detection challenges',
          difficulty: 'Easy',
          points: 100,
          total: 5,
          category: 'phishing',
          rewards: { points: 100, badge: 'Phishing Hunter' }
        },
        {
          title: 'Password Guardian',
          description: 'Generate and secure 10 strong passwords',
          difficulty: 'Medium',
          points: 150,
          total: 10,
          category: 'password',
          rewards: { points: 150, badge: 'Password Master' }
        },
        {
          title: 'Network Sentinel',
          description: 'Detect and report 3 network intrusions',
          difficulty: 'Hard',
          points: 200,
          total: 3,
          category: 'network',
          rewards: { points: 200, badge: 'Network Sentinel' }
        }
      ];
      
      missions = await Mission.insertMany(defaultMissions);
    }
    
    res.json({ missions });
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

// Privacy exposure analyzer
app.post('/api/privacy/analyze', (req, res) => {
  const { data } = req.body;
  const exposures = [];
  
  // Check for common privacy exposures
  if (data.includes('@')) exposures.push({ type: 'Email Address', severity: 'Medium' });
  if (data.match(/\d{3}-\d{2}-\d{4}/)) exposures.push({ type: 'SSN Pattern', severity: 'Critical' });
  if (data.match(/\d{4}-\d{4}-\d{4}-\d{4}/)) exposures.push({ type: 'Credit Card', severity: 'Critical' });
  if (data.match(/\b\d{3}\.\d{3}\.\d{3}\.\d{3}\b/)) exposures.push({ type: 'IP Address', severity: 'Low' });
  
  res.json({
    exposures,
    riskScore: exposures.reduce((score, exp) => {
      return score + (exp.severity === 'Critical' ? 3 : exp.severity === 'Medium' ? 2 : 1);
    }, 0),
    recommendations: exposures.map(exp => `Remove or encrypt ${exp.type.toLowerCase()}`)
  });
});

// Honeypot simulation
app.post('/api/honeypot/simulate', (_req, res) => {
  const simulation = {
    status: 'ACTIVE',
    traps: [
      { name: 'Fake Login Page', hits: Math.floor(Math.random() * 20) },
      { name: 'Decoy Database', hits: Math.floor(Math.random() * 15) },
      { name: 'Fake Admin Panel', hits: Math.floor(Math.random() * 10) }
    ],
    totalHits: 0,
    attackers: Math.floor(Math.random() * 5) + 1
  };
  
  simulation.totalHits = simulation.traps.reduce((sum, trap) => sum + trap.hits, 0);
  
  res.json(simulation);
});

// Deepfake detection
app.post('/api/deepfake/detect', (req, res) => {
  const { imageData, videoData } = req.body;
  
  // Mock deepfake detection
  const isDeepfake = Math.random() > 0.6;
  const confidence = Math.random() * 100;
  
  res.json({
    isDeepfake,
    confidence: Math.round(confidence),
    details: isDeepfake 
      ? 'Detected signs of AI-generated content: inconsistent lighting, facial artifacts, or unnatural movements'
      : 'No signs of deepfake manipulation detected',
    risk: isDeepfake ? 'High' : 'Low'
  });
});

// One-click security booster
app.post('/api/security/boost', (_req, res) => {
  const actions = [
    'Updated firewall rules',
    'Enabled 2FA on all accounts',
    'Scanned for malware',
    'Updated security patches',
    'Backed up critical data',
    'Enabled intrusion detection',
    'Cleared browser cache',
    'Updated antivirus definitions'
  ];
  
  const completedActions = actions.slice(0, Math.floor(Math.random() * 4) + 4);
  
  res.json({
    status: 'BOOST_COMPLETE',
    actions: completedActions,
    securityScore: Math.floor(Math.random() * 20) + 80,
    recommendations: [
      'Enable automatic updates',
      'Use a password manager',
      'Regular security training',
      'Monitor network traffic'
    ]
  });
});

// Auto-heal security mode
app.post('/api/autoheal/activate', (req, res) => {
  const { threatType, severity } = req.body;
  
  const actions = [];
  if (threatType === 'phishing') {
    actions.push('Blocked suspicious email', 'Notified IT department', 'Updated spam filters');
  } else if (threatType === 'malware') {
    actions.push('Isolated infected system', 'Initiated malware scan', 'Backed up clean files');
  } else {
    actions.push('Activated emergency protocols', 'Notified security team', 'Captured system logs');
  }
  
  storage.activity.push({
    type: 'Auto-Heal Activation',
    threatType,
    severity,
    actions,
    time: new Date().toISOString()
  });
  
  res.json({
    status: 'AUTOHEAL_ACTIVATED',
    actions,
    nextSteps: [
      'Monitor system for 24 hours',
      'Review security logs',
      'Update incident response plan'
    ]
  });
});

// Report endpoints with external department forwarding
app.post('/api/report/:target', async (req, res) => {
  try {
    const { target } = req.params;
    const { details, threatType, severity, evidence } = req.body || {};
    
    // Generate case ID
    const caseId = target.toUpperCase() + '-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    
    const report = new Report({
      target,
      details: details || '',
      threatType: threatType || 'Unknown',
      severity: severity || 'Medium',
      evidence: evidence || '',
      status: 'REPORTED',
      caseId
    });
    
    await report.save();
    
    // Log activity
    const activity = new Activity({
      type: 'Threat Report',
      details: `Report submitted to ${target}`,
      threatType: threatType || 'other',
      severity: severity || 'Medium',
      metadata: { reportId: report._id, caseId }
    });
    await activity.save();
    
    // Mock external department notifications
    const notifications = {
      'cybercrime': {
        department: 'Cyber Crime Department',
        contact: 'cybercrime@police.gov',
        response: `Report forwarded to cybercrime unit. Case ID: ${caseId}`
      },
      'police': {
        department: 'Police Department',
        contact: 'emergency@police.gov',
        response: `Report forwarded to local police. Incident ID: ${caseId}`
      },
      'hr': {
        department: 'Human Resources',
        contact: 'security@company.com',
        response: `Report forwarded to HR department. Internal case: ${caseId}`
      }
    };
    
    const notification = notifications[target] || {
      department: 'General Security',
      contact: 'security@company.com',
      response: 'Report logged and forwarded to appropriate department'
    };
    
    res.json({
      ok: true,
      reportId: report._id,
      target,
      notification,
      message: `Threat report successfully forwarded to ${notification.department}`
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Get all reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'username email');
    res.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Enhanced ranking system with YouTube integration
app.get('/api/user/rank', (_req, res) => {
  const userStats = {
    totalPoints: 1250,
    currentRank: 'Gold',
    nextRank: 'Diamond',
    pointsToNext: 250,
    completedMissions: 8,
    totalMissions: 12,
    securityScore: 85,
    learningProgress: 75
  };
  
  res.json(userStats);
});

// YouTube learning videos API
app.get('/api/learning/videos', (_req, res) => {
  const videos = [
    {
      id: 1,
      title: 'Phishing Detection Masterclass',
      description: 'Learn to identify and prevent phishing attacks',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'Phishing',
      difficulty: 'Beginner',
      duration: '15:30',
      points: 50
    },
    {
      id: 2,
      title: 'Advanced Password Security',
      description: 'Master password management and security',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'Password Security',
      difficulty: 'Intermediate',
      duration: '22:15',
      points: 75
    },
    {
      id: 3,
      title: 'Network Intrusion Detection',
      description: 'Understanding network security threats',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'Network Security',
      difficulty: 'Advanced',
      duration: '28:45',
      points: 100
    },
    {
      id: 4,
      title: 'Social Engineering Defense',
      description: 'Protect against social engineering attacks',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'Social Engineering',
      difficulty: 'Intermediate',
      duration: '19:20',
      points: 60
    }
  ];
  
  res.json({ videos });
});

// Mini-games API
app.get('/api/games', (_req, res) => {
  const games = [
    {
      id: 1,
      name: 'Phishing Hunter',
      description: 'Identify phishing emails in this interactive game',
      type: 'quiz',
      difficulty: 'Easy',
      maxScore: 1000,
      rewards: { points: 100, badge: 'Phishing Hunter' }
    },
    {
      id: 2,
      name: 'Password Defender',
      description: 'Create strong passwords and defend against breaches',
      type: 'simulation',
      difficulty: 'Medium',
      maxScore: 1500,
      rewards: { points: 150, badge: 'Password Master' }
    },
    {
      id: 3,
      name: 'Network Guardian',
      description: 'Protect your network from intruders',
      type: 'tower-defense',
      difficulty: 'Hard',
      maxScore: 2000,
      rewards: { points: 200, badge: 'Network Sentinel' }
    }
  ];
  
  res.json({ games });
});

// Auto security report exporter
app.post('/api/reports/export', (req, res) => {
  const { format = 'pdf', dateRange = '30d' } = req.body;
  
  const reportData = {
    generatedAt: new Date().toISOString(),
    format,
    dateRange,
    summary: {
      totalThreats: storage.threats.length,
      reportsSubmitted: storage.reports.length,
      securityScore: Math.floor(Math.random() * 20) + 80,
      topThreats: ['Phishing', 'Malware', 'Social Engineering']
    },
    details: storage.reports.slice(-20),
    recommendations: [
      'Enable 2FA on all accounts',
      'Regular security training',
      'Update security policies',
      'Monitor network traffic'
    ]
  };
  
  res.json({
    status: 'EXPORTED',
    downloadUrl: `/api/downloads/security-report-${Date.now()}.${format}`,
    reportData
  });
});

// Offline files scanner
app.post('/api/scanner/offline', (req, res) => {
  const { filePath, scanType = 'full' } = req.body;
  
  // Mock offline scanning results
  const scanResults = {
    status: 'COMPLETED',
    scannedFiles: Math.floor(Math.random() * 1000) + 500,
    threatsFound: Math.floor(Math.random() * 5),
    scanDuration: '2m 34s',
    threats: [
      { file: 'suspicious.exe', type: 'Malware', severity: 'High' },
      { file: 'phishing.html', type: 'Phishing', severity: 'Medium' }
    ],
    recommendations: [
      'Quarantine suspicious files',
      'Update antivirus definitions',
      'Run full system scan'
    ]
  };
  
  storage.activity.push({
    type: 'Offline Scan',
    results: scanResults,
    time: new Date().toISOString()
  });
  
  res.json(scanResults);
});

// Mini-learning zone with interactive content
app.get('/api/learning/modules', (_req, res) => {
  const modules = [
    {
      id: 1,
      title: 'Cybersecurity Fundamentals',
      description: 'Basic concepts and terminology',
      lessons: [
        { title: 'What is Cybersecurity?', duration: '5 min', completed: true },
        { title: 'Types of Threats', duration: '8 min', completed: true },
        { title: 'Security Best Practices', duration: '10 min', completed: false }
      ],
      progress: 67,
      points: 150
    },
    {
      id: 2,
      title: 'Advanced Threat Detection',
      description: 'Advanced techniques for threat identification',
      lessons: [
        { title: 'Behavioral Analysis', duration: '12 min', completed: false },
        { title: 'Machine Learning in Security', duration: '15 min', completed: false },
        { title: 'Incident Response', duration: '18 min', completed: false }
      ],
      progress: 0,
      points: 300
    }
  ];
  
  res.json({ modules });
});

// Panic mode stub
app.post('/api/panic', (_req, res) => {
  activity.push({ type: 'panic', time: new Date().toISOString() });
  res.json({ ok: true, actions: ['network_isolation', 'teams_notified', 'logs_captured'] });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.68cdadb.mongodb.net/sentinel?retryWrites=true&w=majority';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Initialize default data to ensure collections are created
    await initializeDefaultData();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Continue with in-memory storage if MongoDB fails
    console.log('⚠️  Using in-memory storage as fallback');
  }
};

// Initialize default data to create collections
const initializeDefaultData = async () => {
  try {
    // Check if missions exist, if not create default ones
    const missionCount = await Mission.countDocuments();
    if (missionCount === 0) {
      console.log('📝 Creating default missions...');
      const defaultMissions = [
        {
          title: 'Phishing Defense Master',
          description: 'Complete 5 phishing detection challenges',
          difficulty: 'Easy',
          points: 100,
          total: 5,
          category: 'phishing',
          rewards: { points: 100, badge: 'Phishing Hunter' }
        },
        {
          title: 'Password Guardian',
          description: 'Generate and secure 10 strong passwords',
          difficulty: 'Medium',
          points: 150,
          total: 10,
          category: 'password',
          rewards: { points: 150, badge: 'Password Master' }
        },
        {
          title: 'Network Sentinel',
          description: 'Detect and report 3 network intrusions',
          difficulty: 'Hard',
          points: 200,
          total: 3,
          category: 'network',
          rewards: { points: 200, badge: 'Network Sentinel' }
        }
      ];
      
      await Mission.insertMany(defaultMissions);
      console.log('✅ Default missions created');
    }

    // Create a sample activity to ensure Activity collection exists
    const activityCount = await Activity.countDocuments();
    if (activityCount === 0) {
      console.log('📝 Creating sample activity...');
      const sampleActivity = new Activity({
        type: 'System Initialization',
        details: 'Sentinel system started successfully',
        threatType: 'other',
        severity: 'Low',
        risk: 'Low'
      });
      await sampleActivity.save();
      console.log('✅ Sample activity created');
    }

    // List all collections to verify they exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Error initializing default data:', error.message);
  }
};

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sentinel API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});


