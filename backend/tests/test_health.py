"""
Health check API tests - Run first to verify backend is up
"""
import pytest
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_endpoint_returns_200(self, api_client):
        """Test that health endpoint returns 200 OK"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"Health check failed: {response.text}"
    
    def test_health_response_structure(self, api_client):
        """Test health response has correct structure"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert "service" in data
        assert "database" in data
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
    
    def test_root_endpoint(self, api_client):
        """Test root endpoint returns welcome message"""
        response = api_client.get(f"{BASE_URL}/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "PolluxKart" in data["message"]
