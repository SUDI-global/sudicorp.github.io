#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SUDI Global Website Development Server
========================================
خادم تطوير لموقع شركة سودي العالمية

Features / المميزات:
- Simple HTTP server with live reload / خادم HTTP بسيط مع إعادة تحميل تلقائية
- Auto-opens browser / فتح المتصفح تلقائياً
- Custom port selection / اختيار المنفذ المخصص
- Directory listing / عرض قائمة الملفات

Usage / الاستخدام:
    python3 dev_server.py [port]
    
Examples / أمثلة:
    python3 dev_server.py        # Default port 8000
    python3 dev_server.py 3000   # Custom port 3000
"""

import http.server
import socketserver
import webbrowser
import sys
import os
from pathlib import Path

# Configuration / الإعدادات
DEFAULT_PORT = 8000
HOST = 'localhost'

class SUDIHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with Arabic support"""
    
    def end_headers(self):
        """Add custom headers for development"""
        # Enable CORS for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"📄 [{self.log_date_time_string()}] {format % args}")


def find_available_port(start_port):
    """Find an available port starting from start_port"""
    port = start_port
    while port < start_port + 100:
        try:
            with socketserver.TCPServer((HOST, port), SUDIHTTPRequestHandler) as test_server:
                return port
        except OSError:
            port += 1
    raise OSError(f"Could not find available port in range {start_port}-{start_port + 100}")


def main():
    """Main function to start the development server"""
    
    # Get port from command line argument or use default
    if len(sys.argv) > 1:
        try:
            requested_port = int(sys.argv[1])
        except ValueError:
            print(f"❌ خطأ: المنفذ غير صالح '{sys.argv[1]}'")
            print(f"❌ Error: Invalid port '{sys.argv[1]}'")
            sys.exit(1)
    else:
        requested_port = DEFAULT_PORT
    
    # Find available port
    try:
        port = find_available_port(requested_port)
        if port != requested_port:
            print(f"⚠️  المنفذ {requested_port} مشغول، استخدام المنفذ {port}")
            print(f"⚠️  Port {requested_port} is busy, using port {port}")
    except OSError as e:
        print(f"❌ خطأ: {e}")
        print(f"❌ Error: {e}")
        sys.exit(1)
    
    # Change to script directory
    os.chdir(Path(__file__).parent)
    
    # Create server
    Handler = SUDIHTTPRequestHandler
    
    try:
        with socketserver.TCPServer((HOST, port), Handler) as httpd:
            url = f"http://{HOST}:{port}"
            
            print("\n" + "="*60)
            print("🚀 SUDI Global - Development Server")
            print("🚀 خادم التطوير - شركة سودي العالمية")
            print("="*60)
            print(f"\n📍 العنوان / URL: {url}")
            print(f"📂 المجلد / Directory: {os.getcwd()}")
            print(f"\n✨ الصفحات المتاحة / Available Pages:")
            print(f"   • {url}/index.html (الصفحة الرئيسية)")
            print(f"   • {url}/index-ar.html (النسخة العربية)")
            print(f"   • {url}/projects.html (المشاريع)")
            print(f"   • {url}/about.html (من نحن)")
            print(f"   • {url}/services.html (الخدمات)")
            print(f"   • {url}/contact.html (اتصل بنا)")
            print(f"\n🛑 لإيقاف الخادم / To stop: Press Ctrl+C")
            print("="*60 + "\n")
            
            # Open browser automatically
            try:
                webbrowser.open(url)
                print("🌐 فتح المتصفح... / Opening browser...")
            except Exception as e:
                print(f"⚠️  لم يتم فتح المتصفح تلقائياً: {e}")
                print(f"⚠️  Could not open browser automatically: {e}")
            
            # Start serving
            print("\n✅ الخادم يعمل... / Server is running...\n")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n⏹️  إيقاف الخادم... / Stopping server...")
        print("👋 مع السلامة! / Goodbye!\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ خطأ: {e}")
        print(f"❌ Error: {e}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
