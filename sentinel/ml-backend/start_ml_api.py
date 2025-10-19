#!/usr/bin/env python3
"""
Startup script for Sentinel ML API
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("🔄 Installing ML backend requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def start_ml_api():
    """Start the ML API server"""
    print("🚀 Starting Sentinel ML API...")
    try:
        subprocess.run([sys.executable, "ml_api.py"])
    except KeyboardInterrupt:
        print("\n👋 ML API server stopped")
    except Exception as e:
        print(f"❌ Error starting ML API: {e}")

if __name__ == "__main__":
    print("🛡️  Sentinel-SME ML Backend")
    print("=" * 40)
    
    # Install requirements
    if install_requirements():
        # Start the API
        start_ml_api()
    else:
        print("❌ Failed to install requirements. Please check your Python environment.")
