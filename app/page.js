"use client";

import { useState } from 'react';

export default function URLScanner() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    try {
      // Submit URL for scanning
      const submitResponse = await fetch('/api/urlscan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!submitResponse.ok) {
        throw new Error(`Failed to submit URL: ${submitResponse.status}`);
      }

      const { uuid } = await submitResponse.json();
      console.log('Submitted URL, received UUID:', uuid);

      // Poll for results
      let scanResult = null;
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        const resultResponse = await fetch(`/api/urlscan?uuid=${uuid}`);
        if (resultResponse.ok) {
          scanResult = await resultResponse.json();
          console.log('Scan result received:', scanResult);
          break;
        }
      }

      if (!scanResult) {
        throw new Error('Failed to retrieve scan result after multiple attempts');
      }

      setResult(scanResult);
    } catch (error) {
      console.error('Error during URL submission and polling:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">URL Scanner</h1>
      <p className="mb-4">Enter a URL to scan for security issues.</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="border p-2 rounded w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Scan URL</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Scan Result</h2>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}