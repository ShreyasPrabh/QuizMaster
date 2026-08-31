import sys
import os

# Ensure the backend root is on the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.wsgi import get_wsgi_application

# Vercel Python runtime looks for 'app' as the WSGI callable
app = get_wsgi_application()
