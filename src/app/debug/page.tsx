'use client';

import { useEffect, useState } from 'react';

export default function ChromeDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [swStatus, setSWStatus] = useState('Checking...');

  useEffect(() => {
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          setSWStatus(`Found ${registrations.length} service worker(s)`);
          
          // Force clear old service workers
          for (let registration of registrations) {
            await registration.unregister();
          }
          
          // Re-register fresh service worker
          const newReg = await navigator.serviceWorker.register('/sw.js');
          setSWStatus('New service worker registered successfully');
          
        } catch (error) {
          setSWStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        setSWStatus('Service Worker not supported');
      }
    };

    const gatherDebugInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        isChrome: navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edge'),
        isSecure: location.protocol === 'https:',
        cookiesEnabled: navigator.cookieEnabled,
        hasServiceWorker: 'serviceWorker' in navigator,
        hasLocalStorage: typeof Storage !== 'undefined',
        origin: location.origin,
        timestamp: new Date().toISOString()
      };
      setDebugInfo(info);
    };

    checkServiceWorker();
    gatherDebugInfo();
  }, []);

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      alert('All caches cleared!');
    }
  };

  const handleTestLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });
      const data = await response.json();
      alert(`Login test: ${data.success ? 'Success' : 'Failed - ' + data.message}`);
    } catch (error) {
      alert(`Login test error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Chrome Authentication Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Debug Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            <div className="space-y-2 text-sm">
              {Object.entries(debugInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span className={value === true ? 'text-green-600' : value === false ? 'text-red-600' : 'text-gray-600'}>
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Worker Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Service Worker Status</h2>
            <p className="text-sm mb-4">{swStatus}</p>
            
            <div className="space-y-3">
              <button 
                onClick={handleClearCache}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear All Caches
              </button>
              
              <button 
                onClick={handleTestLogin}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Login API
              </button>
              
              <button 
                onClick={() => window.location.href = '/login'}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        </div>

        {/* Console Log Display */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-2 text-sm">
            <p>1. Click "Clear All Caches" to remove old cached data</p>
            <p>2. Refresh the page to reload the new service worker</p>
            <p>3. Click "Test Login API" to verify API calls work</p>
            <p>4. Go to Login Page and try logging in</p>
            <p>5. Check browser console (F12) for any remaining errors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
