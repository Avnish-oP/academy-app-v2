'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@academy.com',
          password: 'admin123',
          userType: 'admin'
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    }
  };

  const testAuth = async () => {
    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        body: new FormData(), // Empty form data
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="space-x-4 mb-4">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Login API
        </button>
        
        <button 
          onClick={testAuth}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Auth API
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {result || 'Click a button to test APIs'}
      </pre>
    </div>
  );
}
