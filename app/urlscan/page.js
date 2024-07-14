'use client';

import React, { useState } from 'react';

export default function UrlScanPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submitUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Submit URL for scanning
      const submitResponse = await fetch('/api/urlscan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.error || `Failed to submit URL: ${submitResponse.status}`);
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
          break;
        } else if (resultResponse.status !== 404) {
          const errorData = await resultResponse.json();
          throw new Error(errorData.error || `Error retrieving scan result: ${resultResponse.status}`);
        }
        console.log(`Attempt ${i + 1}: Scan not complete yet`);
      }

      if (scanResult) {
        setResult(scanResult);
        console.log('Scan result received:', scanResult);
      } else {
        throw new Error('Scan did not complete within the expected time');
      }
    } catch (err) {
      console.error('Error in submitUrl:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">URL Scan</h1>
      <form onSubmit={submitUrl} className="mb-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scan"
          required
          className="border p-2 mr-2 w-full md:w-auto"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded mt-2 md:mt-0" 
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Scan URL'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && (
        <div className="mb-4">
          <p>Scanning in progress... This may take a few minutes.</p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Scan Results:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Page Title:</strong> {result.page?.title || 'N/A'}</p>
            <p><strong>Final URL:</strong> {result.page?.url || 'N/A'}</p>
            <p><strong>IP Address:</strong> {result.page?.ip || 'N/A'}</p>
            <p><strong>Server:</strong> {result.page?.server || 'N/A'}</p>
            <p><strong>Country:</strong> {result.page?.country || 'N/A'}</p>
            <p><strong>MIME Type:</strong> {result.page?.mimeType || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}