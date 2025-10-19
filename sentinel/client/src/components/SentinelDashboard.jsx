import React, { useState, useEffect } from 'react';
import {
  Shield, Zap, Clock, Wrench, Award, Users, MessageSquare, AlertTriangle,
  Mail, Globe, Lock, Key, FileCheck, FileText, Network, Activity, DollarSign,
  Target, Eye, Map, Gamepad2, Brain, Upload, Download, Settings, BarChart3,
  Search
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
 const LOGO_PATH = import.meta.env.VITE_LOGO_PATH || '/sentinel-logo.png';

const SentinelDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [threatLevel] = useState(4.1);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizBadge, setQuizBadge] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [randomQuizQuestions, setRandomQuizQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPanicConfirmation, setShowPanicConfirmation] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  //const [userRank, setUserRank] = useState('Bronze');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'senty', text: "Hi! I'm Senty, your cybersecurity assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [fraudInput, setFraudInput] = useState('');
  const [fraudAmount, setFraudAmount] = useState('');
  const [fraudMerchant, setFraudMerchant] = useState('');
  const [activeScanType, setActiveScanType] = useState('url');
  const [missions, setMissions] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [privacyExposures, setPrivacyExposures] = useState([]);
  const [honeypotData, setHoneypotData] = useState(null);
  const [deepfakeResult, setDeepfakeResult] = useState(null);
  const [securityBoost, setSecurityBoost] = useState(null);
  const [autoHealStatus, setAutoHealStatus] = useState(null);
  const [reportStatus, setReportStatus] = useState(null);
  const [reports, setReports] = useState([]);
  const [userRank, setUserRank] = useState({});
  const [learningVideos, setLearningVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [learningModules, setLearningModules] = useState([]);
  const [offlineScanResult, setOfflineScanResult] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
const [generatedPassword, setGeneratedPassword] = useState('');
const [showProfileModal, setShowProfileModal] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [logoFailed, setLogoFailed] = useState(false);

  const securityEvents = [
    { time: '10:30', type: 'Email Scan', event: 'Phishing Detected (CEO email)', risk: 'High' },
    { time: '09:15', type: 'URL Scan', event: 'Malicious URL Blocked', risk: 'Critical' },
    { time: '08:45', type: 'Password Monitor', event: 'Warning: Password overdue in 25 days', risk: 'Low' },
    { time: '07:22', type: 'Network IDS', event: 'Failed login attempt from IP 192.168.1.105', risk: 'Medium' }
  ];

  const leaderboardData = [
    { rank: 1, name: 'Alex Johnson', points: 980, color: 'from-yellow-500 to-orange-500' },
    { rank: 2, name: 'Jamie Lee', points: 950, color: 'from-blue-400 to-blue-600' },
    { rank: 3, name: 'Chris Evans', points: 870, color: 'from-purple-400 to-pink-500' },
    { rank: 4, name: 'Riley Kim', points: 750, color: 'from-green-400 to-emerald-500' },
    { rank: 5, name: 'Sam Taylor', points: 680, color: 'from-cyan-400 to-blue-500' }
  ];

  const allQuizQuestions = [
    {
      question: 'You receive an urgent email from your "CEO" asking for wire transfer. What should you do?',
      options: [
        'Send the money immediately',
        'Verify through a separate communication channel',
        'Reply to the email asking for confirmation',
        'Forward it to IT department only'
      ],
      correct: 1,
      explanation: 'Always verify urgent requests through a separate, trusted channel like phone or in-person.',
      category: 'Social Engineering'
    },
    {
      question: 'What makes a password strong?',
      options: [
        'Using your birthday',
        'At least 12 characters with mix of uppercase, lowercase, numbers, and symbols',
        'Using the same password everywhere',
        'Simple words like "password123"'
      ],
      correct: 1,
      explanation: 'Strong passwords are long, complex, and unique for each account.',
      category: 'Password Security'
    },
    {
      question: "You click on a suspicious link. What should you do immediately?",
      options: [
        "Nothing, it's probably fine",
        'Disconnect from network, scan for malware, report to IT',
        'Delete your browser history',
        'Restart your computer'
      ],
      correct: 1,
      explanation: 'Quick action can prevent malware spread: disconnect, scan, and report immediately.',
      category: 'Incident Response'
    },
    {
      question: 'What is phishing?',
      options: [
        'A type of computer virus',
        'Fraudulent attempt to obtain sensitive information',
        'A firewall technique',
        'A password manager'
      ],
      correct: 1,
      explanation: 'Phishing uses fake communications to trick people into revealing sensitive data.',
      category: 'Social Engineering'
    },
    {
      question: 'How often should you update your passwords?',
      options: [
        'Never',
        'Every 5 years',
        'Every 60-90 days for sensitive accounts',
        'Only when breached'
      ],
      correct: 2,
      explanation: 'Regular password rotation (60-90 days) reduces risk of compromise.',
      category: 'Password Security'
    },
    {
      question: 'What does HTTPS stand for and why is it important?',
      options: [
        'HyperText Transfer Protocol Secure - encrypts data transmission',
        'HyperText Transfer Protocol Standard - faster loading',
        'HyperText Transfer Protocol System - better compatibility',
        'HyperText Transfer Protocol Service - improved reliability'
      ],
      correct: 0,
      explanation: 'HTTPS encrypts data between your browser and the website, protecting sensitive information.',
      category: 'Network Security'
    },
    {
      question: 'You receive a USB drive in the mail from an unknown sender. What should you do?',
      options: [
        'Plug it in immediately to see what it contains',
        'Throw it away without opening',
        'Give it to IT security for analysis',
        'Use it on a personal computer first'
      ],
      correct: 2,
      explanation: 'Unknown USB devices can contain malware. Always hand them over to IT security.',
      category: 'Physical Security'
    },
    {
      question: 'What is two-factor authentication (2FA) and why is it important?',
      options: [
        'Using two different passwords for the same account',
        'A second layer of security requiring two different types of verification',
        'Having two separate accounts for the same service',
        'Using the same password twice for extra security'
      ],
      correct: 1,
      explanation: '2FA adds an extra layer of security by requiring something you know (password) and something you have (phone/app).',
      category: 'Authentication'
    },
    {
      question: 'You notice unusual network activity on your computer. What should you do first?',
      options: [
        'Continue working normally',
        'Disconnect from the internet immediately',
        'Restart your computer',
        'Download more software to fix it'
      ],
      correct: 1,
      explanation: 'Disconnect from the internet to prevent potential data exfiltration, then contact IT security.',
      category: 'Incident Response'
    },
    {
      question: 'What is the most secure way to handle sensitive documents?',
      options: [
        'Store them on your desktop for easy access',
        'Email them to yourself for backup',
        'Use encrypted storage and secure sharing methods',
        'Print them and keep physical copies'
      ],
      correct: 2,
      explanation: 'Sensitive documents should be encrypted and shared through secure, authorized channels only.',
      category: 'Data Protection'
    },
    {
      question: 'Your computer is running slowly and showing popup ads. What might be the cause?',
      options: [
        'You need more RAM',
        'Malware infection',
        'Outdated software',
        'All of the above'
      ],
      correct: 3,
      explanation: 'Slow performance and popup ads often indicate malware, but can also be caused by hardware or software issues.',
      category: 'Malware Protection'
    },
    {
      question: 'What should you do if you accidentally click on a suspicious link?',
      options: [
        'Nothing, it was probably safe',
        'Immediately change all your passwords',
        'Run a full antivirus scan and change passwords',
        'Restart your computer and continue working'
      ],
      correct: 2,
      explanation: 'Suspicious links can lead to malware. Run security scans and change passwords as a precaution.',
      category: 'Incident Response'
    },
    {
      question: 'What is the best practice for using public Wi-Fi?',
      options: [
        'Use it for banking and shopping',
        'Avoid accessing sensitive accounts, use VPN if necessary',
        'Always use it without any precautions',
        'Share your login credentials with others'
      ],
      correct: 1,
      explanation: 'Public Wi-Fi is insecure. Avoid sensitive activities or use a VPN for protection.',
      category: 'Network Security'
    },
    {
      question: 'How can you identify a secure website?',
      options: [
        'It has a green address bar',
        'It uses HTTPS and has a valid SSL certificate',
        'It loads quickly',
        'It has many popup ads'
      ],
      correct: 1,
      explanation: 'Secure websites use HTTPS encryption and have valid SSL certificates, often indicated by a lock icon.',
      category: 'Web Security'
    },
    {
      question: 'What is ransomware and how can you protect against it?',
      options: [
        'A type of antivirus software',
        'Malware that encrypts files and demands payment - protect with backups and security software',
        'A firewall technique',
        'A password manager feature'
      ],
      correct: 1,
      explanation: 'Ransomware encrypts your files and demands payment. Protect with regular backups and security software.',
      category: 'Malware Protection'
    }
  ];

  // Function to get random 5 questions
  const getRandomQuestions = () => {
    const shuffled = [...allQuizQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  // Function to calculate badge based on score
  const calculateBadge = (score) => {
    if (score >= 90) return { name: 'Security Expert', icon: '🏆', color: 'from-yellow-400 to-orange-500', description: 'Outstanding cybersecurity knowledge!' };
    if (score >= 80) return { name: 'Cyber Guardian', icon: '🛡️', color: 'from-blue-400 to-cyan-500', description: 'Excellent security awareness!' };
    if (score >= 70) return { name: 'Security Champion', icon: '🥇', color: 'from-green-400 to-emerald-500', description: 'Great job on security fundamentals!' };
    if (score >= 60) return { name: 'Security Learner', icon: '📚', color: 'from-purple-400 to-pink-500', description: 'Good progress, keep learning!' };
    return { name: 'Security Novice', icon: '🌱', color: 'from-gray-400 to-gray-600', description: 'Keep studying to improve your security knowledge!' };
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    const feedback = [];
    if (password.length >= 12) strength += 20; else feedback.push('Use at least 12 characters');
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20; else feedback.push('Mix uppercase and lowercase');
    if (/\d/.test(password)) strength += 20; else feedback.push('Include numbers');
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20; else feedback.push('Add special characters');
    if (password.length >= 16) strength += 20;
    let level = 'Weak';
    let color = 'bg-red-500';
    if (strength >= 80) { level = 'Strong'; color = 'bg-green-500'; }
    else if (strength >= 60) { level = 'Good'; color = 'bg-yellow-500'; }
    else if (strength >= 40) { level = 'Fair'; color = 'bg-orange-500'; }
    return { level, strength, color, feedback };
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedPassword(password);
  };

  const scanUrl = async () => {
    setScanResult(null);
    const { data } = await axios.post(`${API}/api/scan/url`, { url: urlInput });
    setScanResult(data);
  };

  const scanEmail = async () => {
    setScanResult(null);
    const { data } = await axios.post(`${API}/api/scan/email`, { subject: emailInput, body: emailBody });
    setScanResult(data);
  };

  const scanFraud = async () => {
    setScanResult(null);
    const { data } = await axios.post(`${API}/api/scan/fraud`, { 
      transaction: fraudInput, 
      amount: parseFloat(fraudAmount) || 0, 
      merchant: fraudMerchant 
    });
    setScanResult(data);
  };

  const startQuiz = () => {
    const randomQuestions = getRandomQuestions();
    setRandomQuizQuestions(randomQuestions);
    setCurrentQuestion(0);
    setQuizScore(0);
    setSelectedAnswers([]);
    setShowQuizResult(false);
    setQuizStarted(true);
    setQuizBadge(null);
  };

  const handleQuizAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === randomQuizQuestions[currentQuestion].correct;
    const newScore = isCorrect ? quizScore + 20 : quizScore;
    setQuizScore(newScore);
    
    // Store the answer
    const newAnswers = [...selectedAnswers, { 
      questionIndex: currentQuestion, 
      selected: selectedIndex, 
      correct: isCorrect,
      question: randomQuizQuestions[currentQuestion].question,
      category: randomQuizQuestions[currentQuestion].category
    }];
    setSelectedAnswers(newAnswers);
    
    if (currentQuestion < randomQuizQuestions.length - 1) {
      setCurrentQuestion((i) => i + 1);
    } else {
      // Quiz completed
      const finalScore = newScore;
      const badge = calculateBadge(finalScore);
      setQuizBadge(badge);
      setShowQuizResult(true);
    }
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.toLowerCase().includes('scan') || query.toLowerCase().includes('threat')) {
      setActiveTab('scanner');
    } else if (query.toLowerCase().includes('quiz') || query.toLowerCase().includes('test')) {
      setActiveTab('quiz');
    } else if (query.toLowerCase().includes('mission') || query.toLowerCase().includes('challenge')) {
      setActiveTab('missions');
    } else if (query.toLowerCase().includes('learn') || query.toLowerCase().includes('training')) {
      setActiveTab('learning');
    } else if (query.toLowerCase().includes('leaderboard') || query.toLowerCase().includes('rank')) {
      setActiveTab('leaderboard');
    } else if (query.toLowerCase().includes('chat') || query.toLowerCase().includes('senty')) {
      setActiveTab('chat');
    } else if (query.toLowerCase().includes('activity') || query.toLowerCase().includes('log')) {
      setActiveTab('activity');
    } else if (query.toLowerCase().includes('tool') || query.toLowerCase().includes('password')) {
      setActiveTab('tools');
    } else if (query.toLowerCase().includes('advanced') || query.toLowerCase().includes('offline')) {
      setActiveTab('advanced');
    } else if (query.toLowerCase().includes('dashboard') || query.toLowerCase().includes('analytics')) {
      setActiveTab('dashboard');
    }
  };

  // Panic button functions
  const handlePanicButton = () => {
    setShowPanicConfirmation(true);
  };

  const confirmPanic = async () => {
    try {
      const { data } = await axios.post(`${API}/api/panic`, { user: 'current_user' });
      console.log('Panic mode activated:', data);
      setShowPanicConfirmation(false);
      setPanicMode(true);
      
      // Auto-exit panic mode after 5 seconds
      setTimeout(() => {
        setPanicMode(false);
      }, 5000);
    } catch (error) {
      console.error('Error activating panic mode:', error);
      // Still activate panic mode even if API call fails
      setShowPanicConfirmation(false);
      setPanicMode(true);
      
      // Auto-exit panic mode after 5 seconds
      setTimeout(() => {
        setPanicMode(false);
      }, 5000);
    }
  };

  const cancelPanic = () => {
    setShowPanicConfirmation(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { sender: 'user', text: chatInput }];
    setChatMessages(newMessages);
    const { data } = await axios.post(`${API}/api/chat`, { message: chatInput });
    setChatMessages([...newMessages, { sender: 'senty', text: data.reply }]);
    setChatInput('');
  };

  const activatePanicMode = async () => {
    setPanicMode(true);
    try { await axios.post(`${API}/api/panic`); } catch {}
    setTimeout(() => setPanicMode(false), 5000);
  };

  // New API functions
  const loadMissions = async () => {
    const { data } = await axios.get(`${API}/api/missions`);
    setMissions(data.missions);
  };

  const loadHeatmap = async () => {
    const { data } = await axios.get(`${API}/api/threats/heatmap`);
    setHeatmapData(data.heatmap);
  };

  const analyzePrivacy = async (data) => {
    const { data: result } = await axios.post(`${API}/api/privacy/analyze`, { data });
    setPrivacyExposures(result);
  };

  const simulateHoneypot = async () => {
    const { data } = await axios.post(`${API}/api/honeypot/simulate`);
    setHoneypotData(data);
  };

  const detectDeepfake = async (imageData) => {
    const { data } = await axios.post(`${API}/api/deepfake/detect`, { imageData });
    setDeepfakeResult(data);
  };

  const boostSecurity = async () => {
    const { data } = await axios.post(`${API}/api/security/boost`);
    setSecurityBoost(data);
  };

  const activateAutoHeal = async (threatType, severity) => {
    const { data } = await axios.post(`${API}/api/autoheal/activate`, { threatType, severity });
    setAutoHealStatus(data);
  };

  // Report functions
  const reportThreat = async (target, threatType, severity, details, evidence) => {
    const { data } = await axios.post(`${API}/api/report/${target}`, {
      threatType,
      severity,
      details,
      evidence
    });
    setReportStatus(data);
    loadReports();
  };

  const loadReports = async () => {
    const { data } = await axios.get(`${API}/api/reports`);
    setReports(data.reports);
  };

  // Enhanced API functions
  const loadUserRank = async () => {
    const { data } = await axios.get(`${API}/api/user/rank`);
    setUserRank(data);
  };

  const loadLearningVideos = async () => {
    const { data } = await axios.get(`${API}/api/learning/videos`);
    setLearningVideos(data.videos);
  };

  const loadGames = async () => {
    const { data } = await axios.get(`${API}/api/games`);
    setGames(data.games);
  };

  const loadLearningModules = async () => {
    const { data } = await axios.get(`${API}/api/learning/modules`);
    setLearningModules(data.modules);
  };

  const runOfflineScan = async () => {
    const { data } = await axios.post(`${API}/api/scanner/offline`, { scanType: 'full' });
    setOfflineScanResult(data);
  };

  const exportSecurityReport = async (format = 'pdf') => {
    const { data } = await axios.post(`${API}/api/reports/export`, { format });
    setExportStatus(data);
  };

  // Load data on component mount
  useEffect(() => {
    loadMissions();
    loadHeatmap();
    loadReports();
    loadUserRank();
    loadLearningVideos();
    loadGames();
    loadLearningModules();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-red-400';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white">
      {panicMode && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-95 z-50 flex items-center justify-center animate-pulse">
          <div className="text-center">
            <AlertTriangle className="w-32 h-32 mx-auto mb-4 text-white animate-bounce" />
            <h1 className="text-6xl font-bold mb-4 text-white">🚨 PANIC MODE ACTIVATED 🚨</h1>
            <p className="text-2xl mb-6 text-white">Emergency protocols initiated</p>
            <div className="space-y-3 text-lg text-white">
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Network disconnected</span>
            </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-400">✓</span>
                <span>IT department notified</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Security team alerted</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-400">✓</span>
                <span>System logs captured</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Sensitive systems locked down</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-red-800 bg-opacity-50 rounded-lg border border-red-400">
              <p className="text-lg font-semibold">Emergency protocols are now active</p>
              <p className="text-sm">This alert will automatically clear in a few seconds</p>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-blue-900/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-blue-800 border border-blue-600 rounded-xl p-6 w-[420px] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">User Profile</h3>
              <button className="text-blue-200 hover:text-white" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-blue-900 font-bold">RK</span>
                </div>
                <div>
                  <p className="text-lg font-semibold">Riley Kim</p>
                  <p className="text-xs subtle">User Summary</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-700/40 rounded-lg p-3 border border-blue-600">
                  <p className="text-xs subtle">Rank</p>
                  <p className="font-bold">{userRank.currentRank || 'Bronze'}</p>
                </div>
                <div className="bg-blue-700/40 rounded-lg p-3 border border-blue-600">
                  <p className="text-xs subtle">Points</p>
                  <p className="font-bold">{userRank.totalPoints || 0}</p>
                </div>
              </div>
              <div className="text-sm text-blue-200">
                <p>Recent activity and achievements summarized.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700" onClick={() => setShowProfileModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-900/60 backdrop-blur-xl border-b border-blue-700 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {!logoFailed ? (
  <img src={LOGO_PATH} alt="Sentinel logo" className="w-8 h-8 object-contain" onError={() => setLogoFailed(true)} />
) : (
  <Shield className="w-8 h-8 text-green-400" />
)}
            <div>
              <h1 className="text-2xl font-extrabold text-green-400">Sentinel</h1>
              <p className="text-xs subtle">Cybersecurity Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <input
                type="text"
                placeholder="Search features, tools, threats..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-blue-700 bg-opacity-50 pl-10 pr-4 py-2 rounded-lg border border-blue-500 text-white placeholder-blue-300 focus:border-cyan-400 focus:outline-none w-80"
              />
            </div>
            <div className="text-right">
              <p className="text-sm">Welcome, Riley Kim</p>
              <p className="text-xs subtle">Rank: {userRank.currentRank || 'Bronze'}</p>
              <p className="text-xs subtle">{userRank.totalPoints || 0} pts</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer" onClick={() => setShowProfileModal(true)} title="View profile">
              <span className="text-blue-900 font-bold">RK</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        <div className="w-64 bg-blue-900/40 backdrop-blur-xl p-4 border-r border-blue-700 sticky top-0 h-screen">
          <nav className="space-y-2 h-full overflow-y-auto pr-2">
            <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
              <Activity className="w-5 h-5" />
              Dashboard
            </button>
            <button onClick={() => setActiveTab('scanner')} className={`nav-item ${activeTab === 'scanner' ? 'active' : ''}`}>
              <Zap className="w-5 h-5" />
              Threat Scanner
            </button>
            <button onClick={() => setActiveTab('activity')} className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`}>
              <Clock className="w-5 h-5" />
              Activity Log
            </button>
            <button onClick={() => setActiveTab('tools')} className={`nav-item ${activeTab === 'tools' ? 'active' : ''}`}>
              <Wrench className="w-5 h-5" />
              User Tools
            </button>
            <button onClick={() => setActiveTab('advanced')} className={`nav-item ${activeTab === 'advanced' ? 'active' : ''}`}>
              <Settings className="w-5 h-5" />
              Advanced Tools
            </button>
            <button onClick={() => setActiveTab('quiz')} className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}>
              <Award className="w-5 h-5" />
              Awareness Quiz
            </button>
            <button onClick={() => setActiveTab('missions')} className={`nav-item ${activeTab === 'missions' ? 'active' : ''}`}>
              <Gamepad2 className="w-5 h-5" />
              Cyber Missions
            </button>
            <button onClick={() => setActiveTab('learning')} className={`nav-item ${activeTab === 'learning' ? 'active' : ''}`}>
              <Brain className="w-5 h-5" />
              Learning Zone
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}>
              <Users className="w-5 h-5" />
              Leaderboard
            </button>
            <button onClick={() => setActiveTab('chat')} className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}>
              <MessageSquare className="w-5 h-5" />
              Chat with Senty
            </button>
            
            {/* Panic Button at the bottom */}
            <div className="pt-4 mt-4 border-t border-blue-700">
              <button 
                onClick={handlePanicButton} 
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 animate-pulse"
              >
                <AlertTriangle className="w-5 h-5" />
                PANIC BUTTON
              </button>
            </div>
          </nav>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="heading-xl mb-6">SECURITY ANALYTICS</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card p-6 glow-cyan">
                  <div className="flex items-start justify-between mb-4">
                    <Shield className="w-10 h-10 text-blue-300" />
                    {threatLevel >= 4 && (<span className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold">CRITICAL ALERT</span>)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Overall Threat Level</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">{threatLevel}</span>
                    <span className="text-2xl text-blue-300">/ 5.0</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2 mt-3">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(threatLevel / 5) * 100}%` }}></div>
                  </div>
                </div>
                <div className="card p-6">
                  <Zap className="w-10 h-10 text-pink-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Total Intrusion Attempts</h3>
                  <span className="text-5xl font-bold">152</span>
                </div>
                <div className="card p-6">
                  <Clock className="w-10 h-10 text-orange-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Password Health Monitor</h3>
                  <div className="text-orange-400 font-bold text-xl">Warning:</div>
                  <div className="text-3xl font-bold">65 days</div>
                </div>
              </div>
              <div className="card p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Activity className="w-6 h-6" />Security Activity Trend (Last 7 Days)</h3>
                <div className="h-48 flex items-end justify-around gap-2">
                  {[45, 62, 38, 71, 55, 48, 67].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg" style={{ height: `${height}%` }}></div>
                      <span className="text-xs mt-2 text-blue-300">Day {7 - i}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-blue-300 mt-4">Total security checks/training events completed</p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Mail className="w-6 h-6" />Recent Security Events (Top 4)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-600">
                        <th className="text-left py-3 px-4">TIME</th>
                        <th className="text-left py-3 px-4">TYPE</th>
                        <th className="text-left py-3 px-4">EVENT</th>
                        <th className="text-left py-3 px-4">RISK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityEvents.map((event, i) => (
                        <tr key={i} className="border-b border-blue-700 hover:bg-blue-700 transition-colors">
                          <td className="py-3 px-4">{event.time}</td>
                          <td className="py-3 px-4 font-semibold">{event.type}</td>
                          <td className="py-3 px-4">{event.event}</td>
                          <td className="py-3 px-4"><span className={`${getRiskColor(event.risk)} px-3 py-1 rounded-full text-xs font-bold`}>{event.risk}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Scanner */}
          {activeTab === 'scanner' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">AI/ML THREAT SCANNER</h2>
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setActiveScanType('url')}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    activeScanType === 'url' ? 'bg-green-400 text-blue-900' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Globe className="w-5 h-5" />URL Phishing
                </button>
                <button 
                  onClick={() => setActiveScanType('email')}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    activeScanType === 'email' ? 'bg-green-400 text-blue-900' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Mail className="w-5 h-5" />Email/Gmail Checker
                </button>
                <button 
                  onClick={() => setActiveScanType('fraud')}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    activeScanType === 'fraud' ? 'bg-green-400 text-blue-900' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />Fraud Detection
                </button>
              </div>
              {activeScanType === 'url' && (
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600 mb-6">
                <h3 className="text-xl font-semibold mb-4">Enter URL to Scan</h3>
                <div className="flex gap-4">
                  <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Paste a suspicious link..." className="flex-1 bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400" />
                  <button onClick={scanUrl} className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5" />Execute Scan</button>
                </div>
              </div>
              )}

              {activeScanType === 'email' && (
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600 mb-6">
                <h3 className="text-xl font-semibold mb-4">Enter Email Subject/Sender Line</h3>
                <input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Subject: Urgent password reset required" className="w-full bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Email Body Content (Optional, for better accuracy)</h3>
                <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Paste the first few lines of the email body here..." className="w-full h-32 bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400 mb-4" />
                <button onClick={scanEmail} className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5" />Execute Scan</button>
              </div>
              )}

              {activeScanType === 'fraud' && (
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600 mb-6">
                <h3 className="text-xl font-semibold mb-4">Fraud Detection</h3>
                <div className="space-y-4">
                  <input type="text" value={fraudInput} onChange={(e) => setFraudInput(e.target.value)} placeholder="Transaction description..." className="w-full bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" value={fraudAmount} onChange={(e) => setFraudAmount(e.target.value)} placeholder="Amount ($)" className="bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400" />
                    <input type="text" value={fraudMerchant} onChange={(e) => setFraudMerchant(e.target.value)} placeholder="Merchant/Location" className="bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400" />
                  </div>
                  <button onClick={scanFraud} className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5" />Execute Scan</button>
                </div>
              </div>
              )}
              {scanResult && (
                <div className={`${(scanResult.risk === 'Critical' || scanResult.risk === 'High') ? 'bg-red-500' : 'bg-green-500'} bg-opacity-20 backdrop-blur-sm p-6 rounded-xl border ${(scanResult.risk === 'Critical' || scanResult.risk === 'High') ? 'border-red-500' : 'border-green-500'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{scanResult.status}</h3>
                    <span className={`${getRiskColor(scanResult.risk)} px-4 py-2 rounded-full font-bold`}>{scanResult.risk} Risk</span>
                  </div>
                  <p className="text-lg mb-4">{scanResult.details}</p>
                  {(scanResult.risk === 'Critical' || scanResult.risk === 'High') && (
                    <div className="space-y-2">
                      <button 
                        onClick={() => reportThreat('cybercrime', scanResult.type, scanResult.risk, scanResult.details, `${scanResult.type}: ${scanResult.details}`)}
                        className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-5 h-5" />
                        Report to Cyber Crime Department
                      </button>
                      <button 
                        onClick={() => reportThreat('police', scanResult.type, scanResult.risk, scanResult.details, `${scanResult.type}: ${scanResult.details}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <Shield className="w-5 h-5" />
                        Report to Police Department
                      </button>
                      <button 
                        onClick={() => reportThreat('hr', scanResult.type, scanResult.risk, scanResult.details, `${scanResult.type}: ${scanResult.details}`)}
                        className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <Users className="w-5 h-5" />
                        Report to HR Department
                      </button>
                      <button 
                        onClick={() => {
                          // Add to threat history
                          axios.post(`${API}/api/activity`, {
                            type: 'Threat Logged',
                            threat: scanResult.type,
                            risk: scanResult.risk,
                            details: scanResult.details
                          });
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <FileText className="w-5 h-5" />
                        Add to Threat History
                      </button>
                    </div>
                  )}
                  {reportStatus && (
                    <div className="mt-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                      <h4 className="font-bold text-green-400 mb-2">Report Status</h4>
                      <p className="text-green-300">{reportStatus.message}</p>
                      <p className="text-sm text-green-400 mt-2">
                        {reportStatus.notification?.response}
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        Contact: {reportStatus.notification?.contact}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Activity */}
          {activeTab === 'activity' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Activity Log</h2>
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                <div className="flex justify-between mb-4">
                  <div className="flex gap-2">
                    {['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((day, i) => (
                      <button key={i} className={`px-4 py-2 rounded-lg ${i === 0 ? 'bg-cyan-500 text-blue-900' : 'bg-blue-700 hover:bg-blue-600'}`}>{day}</button>
                    ))}
                  </div>
                </div>
                <p className="text-center text-blue-300 mb-6">Total security checks/training events completed.</p>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Mail className="w-6 h-6" />Recent Security Events (Top 4)</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-600">
                      <th className="text-left py-3 px-4">TIME</th>
                      <th className="text-left py-3 px-4">TYPE</th>
                      <th className="text-left py-3 px-4">EVENT</th>
                      <th className="text-left py-3 px-4">RISK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityEvents.map((event, i) => (
                      <tr key={i} className="border-b border-blue-700 hover:bg-blue-700">
                        <td className="py-3 px-4">{event.time}</td>
                        <td className="py-3 px-4 font-semibold">{event.type}</td>
                        <td className="py-3 px-4">{event.event}</td>
                        <td className="py-3 px-4"><span className={`${getRiskColor(event.risk)} px-3 py-1 rounded-full text-xs font-bold`}>{event.risk}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tools */}
          {activeTab === 'tools' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">User Tools</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Password Strength */}
                <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Lock className="w-6 h-6" />Password Strength Checker</h3>
                  <div className="relative mb-4">
  <input type={showPassword ? 'text' : 'password'} value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setPasswordStrength(e.target.value ? checkPasswordStrength(e.target.value) : null); }} placeholder="Enter your password..." className="w-full bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400 pr-24" />
  <button type="button" aria-label={showPassword ? 'Hide password' : 'Reveal password'} onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1">
    <Eye className="w-4 h-4" />
    {showPassword ? 'Hide' : 'Reveal'}
  </button>
</div>
                  {passwordStrength && (
                    <div>
                      <div className="flex items-center justify-between mb-2"><span className="font-semibold">Strength: {passwordStrength.level}</span><span>{passwordStrength.strength}%</span></div>
                      <div className="w-full bg-blue-900 rounded-full h-2 mb-3"><div className={`${passwordStrength.color} h-2 rounded-full transition-all`} style={{ width: `${passwordStrength.strength}%` }}></div></div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="text-sm text-yellow-300"><p className="font-semibold mb-1">Suggestions:</p><ul className="list-disc list-inside">{passwordStrength.feedback.map((tip, i) => (<li key={i}>{tip}</li>))}</ul></div>
                      )}
                    </div>
                  )}
                </div>
                {/* Generator */}
                <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Key className="w-6 h-6" />Password Generator</h3>
                  <button onClick={generatePassword} className="w-full bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-4 py-3 rounded-lg font-bold mb-4">Generate Strong Password</button>
                  {generatedPassword && (<div className="bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 font-mono text-green-400 break-all">{generatedPassword}</div>)}
                </div>
                {/* Vault (static demo) */}
                <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Lock className="w-6 h-6" />Password Vault</h3>
                  <div className="space-y-3">
                    {[{ site: 'gmail.com', username: 'user@gmail.com', lastChanged: '45 days ago' }, { site: 'github.com', username: 'devuser', lastChanged: '12 days ago' }].map((pwd, i) => (
                      <div key={i} className="bg-blue-700 bg-opacity-50 p-4 rounded-lg border border-blue-500">
                        <div className="flex items-center justify-between">
                          <div><p className="font-semibold">{pwd.site}</p><p className="text-sm text-blue-300">{pwd.username}</p></div>
                          <div className="text-right"><p className="text-xs text-blue-300">Last changed:</p><p className="text-sm">{pwd.lastChanged}</p></div>
                        </div>
                      </div>
                    ))}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold">+ Add New Password</button>
                  </div>
                </div>

                {/* File Integrity */}
                <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileCheck className="w-6 h-6" />File Integrity Checker</h3>
                  <input type="file" className="w-full bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 mb-4" />
                  <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-4 py-3 rounded-lg font-bold">Check File Integrity</button>
                </div>
                {/* File Encryption */}
                <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileText className="w-6 h-6" />File Encryption</h3>
                  <input type="file" className="w-full bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 mb-4" />
                  <div className="flex gap-2"><button className="flex-1 bg-green-500 hover:bg-green-600 px-4 py-3 rounded-lg font-bold">Encrypt</button><button className="flex-1 bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-lg font-bold">Decrypt</button></div>
                </div>
                {/* Network Monitor (mock) */}
                <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Network className="w-6 h-6" />Network Monitor</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span>Network Status:</span><span className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold">SECURE</span></div>
                    <div className="flex items-center justify-between"><span>Active Connections:</span><span className="font-bold">23</span></div>
                    <div className="flex items-center justify-between"><span>Blocked IPs:</span><span className="font-bold">7</span></div>
                    <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-4 py-3 rounded-lg font-bold mt-4">Run Full Network Scan</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz */}
          {activeTab === 'quiz' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-8 h-8" />
                CYBERSECURITY AWARENESS QUIZ
              </h2>
              
              {!quizStarted ? (
                <div className="card p-8 text-center">
                  <div className="mb-6">
                    <Award className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                    <h3 className="text-2xl font-bold mb-4">Test Your Cybersecurity Knowledge</h3>
                    <p className="text-blue-300 mb-6">Answer 5 random questions to earn your security badge!</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-sm font-semibold">5 Questions</div>
                      </div>
                      <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                        <div className="text-2xl mb-2">🎲</div>
                        <div className="text-sm font-semibold">Random Selection</div>
                      </div>
                      <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="text-sm font-semibold">Earn Badges</div>
                      </div>
                      <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-sm font-semibold">Track Progress</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={startQuiz}
                    className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
                  >
                    Start Quiz
                  </button>
                </div>
              ) : !showQuizResult ? (
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold">Question {currentQuestion + 1} / {randomQuizQuestions.length}</span>
                      <span className="bg-cyan-500 text-blue-900 px-4 py-2 rounded-full font-bold">
                        Score: {quizScore}
                      </span>
                    </div>
                    <div className="text-sm text-blue-300">
                      Category: {randomQuizQuestions[currentQuestion].category}
                    </div>
                  </div>
                  
                  <div className="w-full bg-blue-700 bg-opacity-50 rounded-full h-2 mb-6">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${((currentQuestion + 1) / randomQuizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-6">{randomQuizQuestions[currentQuestion].question}</h3>
                  
                  <div className="space-y-3 mb-6">
                    {randomQuizQuestions[currentQuestion].options.map((option, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleQuizAnswer(i)} 
                        className="w-full bg-blue-700 hover:bg-blue-600 px-6 py-4 rounded-lg text-left transition-all border border-blue-500 hover:border-cyan-400 hover:scale-105"
                      >
                        <span className="font-semibold mr-3">{String.fromCharCode(65 + i)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-blue-700 bg-opacity-50 rounded-lg border border-blue-500">
                    <p className="text-sm text-blue-300">
                      💡 <strong>Tip:</strong> {randomQuizQuestions[currentQuestion].explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">{quizBadge.icon}</div>
                  <h3 className="text-4xl font-bold mb-4">Quiz Complete!</h3>
                  <p className="text-2xl mb-6">Your Score: {quizScore} / 100</p>
                    <div className={`inline-block px-8 py-4 rounded-lg font-bold text-2xl mb-4 bg-gradient-to-r ${quizBadge.color}`}>
                      {quizBadge.name}
                    </div>
                    <p className="text-blue-300 mb-6">{quizBadge.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-700 bg-opacity-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-4">📊 Performance Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        {selectedAnswers.map((answer, i) => (
                          <div key={i} className={`flex justify-between p-2 rounded ${answer.correct ? 'bg-green-700 bg-opacity-50' : 'bg-red-700 bg-opacity-50'}`}>
                            <span>Q{i + 1}: {answer.category}</span>
                            <span>{answer.correct ? '✓' : '✗'}</span>
                          </div>
                    ))}
                  </div>
                    </div>
                    
                    <div className="bg-blue-700 bg-opacity-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-4">🎯 Category Performance</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(
                          selectedAnswers.reduce((acc, answer) => {
                            if (!acc[answer.category]) acc[answer.category] = { correct: 0, total: 0 };
                            acc[answer.category].total++;
                            if (answer.correct) acc[answer.category].correct++;
                            return acc;
                          }, {})
                        ).map(([category, stats]) => (
                          <div key={category} className="flex justify-between">
                            <span>{category}</span>
                            <span>{stats.correct}/{stats.total}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={startQuiz} 
                      className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                    >
                      Take Another Quiz
                    </button>
                    <button 
                      onClick={() => {
                        setQuizStarted(false);
                        setShowQuizResult(false);
                        setCurrentQuestion(0);
                        setQuizScore(0);
                        setSelectedAnswers([]);
                        setQuizBadge(null);
                      }} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all"
                    >
                      Back to Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard */}
          {activeTab === 'leaderboard' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><Award className="w-8 h-8" />AWARENESS LEADERBOARD</h2>
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-blue-600">
                <p className="text-center text-blue-300 mb-6">Top performers in the Security Awareness Quizzes. Earn points to climb the ranks!</p>
                <div className="space-y-4">
                  {leaderboardData.map((user) => (
                    <div key={user.rank} className={`bg-gradient-to-r ${user.color} p-6 rounded-xl flex items-center justify-between ${user.rank <= 3 ? 'border-4 border-yellow-400' : ''}`}>
                      <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-2xl font-bold">{user.rank}</div><span className="text-2xl font-bold">{user.name}</span></div>
                      <span className="text-3xl font-bold text-yellow-300">{user.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat */}
          {activeTab === 'chat' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><MessageSquare className="w-8 h-8" />Chat with Senty</h2>
              <div className="bg-blue-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-blue-600 flex flex-col" style={{ height: '600px' }}>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md px-4 py-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-500 text-blue-900' : 'bg-blue-700 border border-blue-500'}`}>
                        {msg.sender === 'senty' && (<p className="font-bold text-green-400 mb-1">Senty 🛡</p>)}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-blue-600">
                  <div className="flex gap-2">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Ask Senty about cybersecurity..." className="flex-1 bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400" />
                    <button onClick={sendChatMessage} className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-6 py-3 rounded-lg font-bold">Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cyber Missions */}
          {activeTab === 'missions' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Gamepad2 className="w-8 h-8" />
                CYBER MISSIONS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map((mission) => (
                  <div key={mission.id} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{mission.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        mission.difficulty === 'Easy' ? 'bg-green-500' :
                        mission.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    <p className="text-blue-300 mb-4">{mission.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{mission.progress}/{mission.total}</span>
                      </div>
                      <div className="w-full bg-blue-900 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${(mission.progress/mission.total)*100}%`}}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-bold">{mission.reward} pts</span>
                      <button className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-4 py-2 rounded-lg font-bold">
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threat Heatmap */}
          {activeTab === 'heatmap' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Map className="w-8 h-8" />
                THREAT HEATMAP
              </h2>
              <div className="card p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">24-Hour Threat Activity</h3>
                <div className="grid grid-cols-12 gap-2">
                  {heatmapData.map((hour) => (
                    <div key={hour.hour} className="text-center">
                      <div className={`h-8 rounded mb-2 ${
                        hour.severity === 'High' ? 'bg-red-500' :
                        hour.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} style={{opacity: Math.min(hour.threats / 10, 1)}}></div>
                      <span className="text-xs text-blue-300">{hour.hour}:00</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Analyzer */}
          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Eye className="w-8 h-8" />
                PRIVACY EXPOSURE ANALYZER
              </h2>
              <div className="card p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Analyze Data for Privacy Exposures</h3>
                <textarea
                  placeholder="Paste text, documents, or data to analyze for privacy exposures..."
                  className="w-full h-32 bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 focus:outline-none focus:border-cyan-400 mb-4"
                  onChange={(e) => analyzePrivacy(e.target.value)}
                />
                {privacyExposures.exposures && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Risk Score:</span>
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        privacyExposures.riskScore > 5 ? 'bg-red-500' :
                        privacyExposures.riskScore > 2 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {privacyExposures.riskScore}/10
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Detected Exposures:</h4>
                      {privacyExposures.exposures.map((exp, i) => (
                        <div key={i} className="flex items-center justify-between bg-blue-700 bg-opacity-50 p-3 rounded-lg mb-2">
                          <span>{exp.type}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            exp.severity === 'Critical' ? 'bg-red-500' :
                            exp.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}>
                            {exp.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="list-disc list-inside text-blue-300">
                        {privacyExposures.recommendations?.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Tools */}
          {activeTab === 'advanced' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-8 h-8" />
                ADVANCED SECURITY TOOLS
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Honeypot Simulation */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Honeypot Simulation
                  </h3>
                  <p className="text-blue-300 mb-4">Simulate honeypot traps to catch attackers</p>
                  <button
                    onClick={simulateHoneypot}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-4 py-3 rounded-lg font-bold mb-4"
                  >
                    Activate Honeypot
                  </button>
                  {honeypotData && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold">
                          {honeypotData.status}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{honeypotData.totalHits}</div>
                        <div className="text-sm text-blue-300">Total Hits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{honeypotData.attackers}</div>
                        <div className="text-sm text-blue-300">Active Attackers</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Deepfake Detection */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6" />
                    Deepfake Detection
                  </h3>
                  <p className="text-blue-300 mb-4">Detect AI-generated or manipulated media</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="w-full bg-blue-700 bg-opacity-50 px-4 py-3 rounded-lg border border-blue-500 mb-4"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        detectDeepfake(e.target.files[0].name);
                      }
                    }}
                  />
                  {deepfakeResult && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Detection:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          deepfakeResult.isDeepfake ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                          {deepfakeResult.isDeepfake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC'}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{deepfakeResult.confidence}%</div>
                        <div className="text-sm text-blue-300">Confidence</div>
                      </div>
                      <p className="text-sm text-blue-300">{deepfakeResult.details}</p>
                    </div>
                  )}
                </div>

                {/* One-Click Security Booster */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    One-Click Security Booster
                  </h3>
                  <p className="text-blue-300 mb-4">Boost your security with automated actions</p>
                  <button
                    onClick={boostSecurity}
                    className="w-full bg-green-500 hover:bg-green-600 text-blue-900 px-4 py-3 rounded-lg font-bold mb-4"
                  >
                    Boost Security
                  </button>
                  {securityBoost && (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{securityBoost.securityScore}</div>
                        <div className="text-sm text-blue-300">Security Score</div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Completed Actions:</h4>
                        <ul className="list-disc list-inside text-blue-300 text-sm">
                          {securityBoost.actions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto-Heal Security */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Auto-Heal Security Mode
                  </h3>
                  <p className="text-blue-300 mb-4">Automatically respond to security threats</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => activateAutoHeal('phishing', 'High')}
                      className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold"
                    >
                      Activate for Phishing
                    </button>
                    <button
                      onClick={() => activateAutoHeal('malware', 'Critical')}
                      className="w-full bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-bold"
                    >
                      Activate for Malware
                    </button>
                  </div>
                  {autoHealStatus && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold">
                          {autoHealStatus.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Actions Taken:</h4>
                        <ul className="list-disc list-inside text-blue-300 text-sm">
                          {autoHealStatus.actions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Offline Scanner */}
                <div className="card p-8 col-span-2">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                    <Upload className="w-8 h-8" />
                    Offline Scanner
                  </h3>
                  <p className="text-lg text-blue-300 mb-6">Scan files on your local system for malware and threats</p>
                  <div className="flex gap-6 mb-6">
                    <input
                      type="file"
                      multiple
                      className="flex-1 bg-blue-700 bg-opacity-50 px-6 py-4 rounded-lg border border-blue-500 text-base"
                    />
                    <button
                      onClick={runOfflineScan}
                      className="bg-cyan-500 hover:bg-cyan-600 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3"
                    >
                      <Zap className="w-6 h-6" />
                      Start Scan
                    </button>
                  </div>
                  
                  {offlineScanResult && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{offlineScanResult.scannedFiles}</div>
                          <div className="text-sm text-blue-300">Files Scanned</div>
                        </div>
                        <div className="text-center bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">{offlineScanResult.threatsFound}</div>
                          <div className="text-sm text-blue-300">Threats Found</div>
                        </div>
                        <div className="text-center bg-blue-700 bg-opacity-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-cyan-400">{offlineScanResult.scanDuration}</div>
                          <div className="text-sm text-blue-300">Duration</div>
                        </div>
                      </div>
                      
                      {offlineScanResult.threats.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Detected Threats:</h4>
                          {offlineScanResult.threats.map((threat, i) => (
                            <div key={i} className="flex items-center justify-between bg-red-500 bg-opacity-20 p-3 rounded-lg mb-2">
                              <span className="font-mono text-sm">{threat.file}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{threat.type}</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(threat.severity)}`}>
                                  {threat.severity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold mb-2">Recommendations:</h4>
                        <ul className="list-disc list-inside text-blue-300">
                          {offlineScanResult.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Threat Reports */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-8 h-8" />
                THREAT REPORTS
              </h2>
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Submitted Reports</h3>
                  <div className="flex gap-2">
                    <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold">
                      {reports.filter(r => r.target === 'cybercrime').length} Cyber Crime
                    </span>
                    <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold">
                      {reports.filter(r => r.target === 'police').length} Police
                    </span>
                    <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-bold">
                      {reports.filter(r => r.target === 'hr').length} HR
                    </span>
                  </div>
                </div>
                
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <p className="text-blue-300">No reports submitted yet</p>
                    <p className="text-sm text-blue-400">Reports will appear here when threats are detected and reported</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="bg-blue-700 bg-opacity-50 p-4 rounded-lg border border-blue-500">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              report.target === 'cybercrime' ? 'bg-red-500' :
                              report.target === 'police' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}>
                              {report.target.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(report.severity)}`}>
                              {report.severity}
                            </span>
                            <span className="text-sm text-blue-300">{report.threatType}</span>
                          </div>
                          <span className="text-xs text-blue-400">
                            {new Date(report.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-blue-200 mb-2">{report.details}</p>
                        {report.evidence && (
                          <p className="text-sm text-blue-400">Evidence: {report.evidence}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-blue-400">Report ID: {report.id.slice(0, 8)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            report.status === 'REPORTED' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Learning Zone */}
          {activeTab === 'learning' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Brain className="w-8 h-8" />
                MINI-LEARNING ZONE
              </h2>
              
              {/* User Progress */}
              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Your Progress</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{userRank.totalPoints || 0}</div>
                      <div className="text-sm text-blue-300">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{userRank.securityScore || 0}%</div>
                      <div className="text-sm text-blue-300">Security Score</div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-blue-900 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full" style={{width: `${userRank.learningProgress || 0}%`}}></div>
                </div>
                <p className="text-sm text-blue-300 mt-2">Learning Progress: {userRank.learningProgress || 0}%</p>
              </div>

              {/* Learning Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {learningModules.map((module) => (
                  <div key={module.id} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{module.title}</h3>
                      <span className="bg-cyan-500 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
                        {module.points} pts
                      </span>
                    </div>
                    <p className="text-blue-300 mb-4">{module.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-blue-900 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${module.progress}%`}}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, i) => (
                        <div key={i} className="flex items-center justify-between bg-blue-700 bg-opacity-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              lesson.completed ? 'bg-green-500 text-white' : 'bg-blue-600 text-blue-300'
                            }`}>
                              {lesson.completed ? '✓' : i + 1}
                            </div>
                            <span className={lesson.completed ? 'text-green-400' : 'text-blue-300'}>{lesson.title}</span>
                          </div>
                          <span className="text-xs text-blue-400">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* YouTube Learning Videos */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4">Educational Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningVideos.map((video) => (
                    <div key={video.id} className="bg-blue-700 bg-opacity-50 p-4 rounded-lg border border-blue-500">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          video.difficulty === 'Beginner' ? 'bg-green-500' :
                          video.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {video.difficulty}
                        </span>
                        <span className="text-yellow-400 font-bold">{video.points} pts</span>
                      </div>
                      <h4 className="font-semibold mb-2">{video.title}</h4>
                      <p className="text-sm text-blue-300 mb-3">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-400">{video.duration}</span>
                        <a
                          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
                        >
                          <span>▶</span> Watch
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Games */}
          {activeTab === 'games' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Gamepad2 className="w-8 h-8" />
                SECURITY GAMES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <div key={game.id} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{game.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        game.difficulty === 'Easy' ? 'bg-green-500' :
                        game.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {game.difficulty}
                      </span>
                    </div>
                    <p className="text-blue-300 mb-4">{game.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Max Score</span>
                        <span>{game.maxScore}</span>
                      </div>
                      <div className="w-full bg-blue-900 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-yellow-400 font-bold">{game.rewards.points} pts</div>
                        <div className="text-xs text-blue-300">{game.rewards.badge}</div>
                      </div>
                      <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-bold">
                        Play Game
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


        {/* Panic Confirmation Dialog */}
        {showPanicConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-blue-800 bg-opacity-95 backdrop-blur-xl p-8 rounded-xl max-w-md w-full mx-4 border border-blue-600">
              <div className="flex items-center gap-4 mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
                    <div>
                  <h3 className="text-2xl font-bold text-white">Emergency Panic Mode</h3>
                  <p className="text-sm text-blue-300">This action will activate emergency protocols</p>
                    </div>
                  </div>
              
              <div className="mb-6">
                <p className="text-lg mb-4 text-white">
                  Are you sure you want to activate panic mode? This will:
                </p>
                <ul className="space-y-2 text-sm text-blue-300">
                  <li>• Disconnect from the network</li>
                  <li>• Notify IT department immediately</li>
                  <li>• Alert security team</li>
                  <li>• Capture system logs</li>
                  <li>• Lock down sensitive systems</li>
                </ul>
              </div>

                <div className="flex gap-4">
                  <button
                  onClick={confirmPanic}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                  YES, ACTIVATE PANIC MODE
                  </button>
                  <button
                  onClick={cancelPanic}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentinelDashboard;


