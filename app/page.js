"use client";

import React, { useState } from 'react';

export default function URLScanner() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    try {
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

  const renderResult = (result) => {
    const { page, stats, verdicts } = result;
    return (
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Scan Result</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Page Title:</strong> {page.title}</p>
          <p><strong>Final URL:</strong> {page.url}</p>
          <p><strong>IP Address:</strong> {page.ip}</p>
          <p><strong>Domain:</strong> {page.domain}</p>
          <p><strong>Country:</strong> {page.country}</p>
          <p><strong>Scan Date:</strong> {page.date}</p>
          <p><strong>Malicious:</strong> {verdicts.overall.malicious ? 'Yes' : 'No'}</p>
          <p><strong>Categories:</strong> {verdicts.overall.categories.join(', ')}</p>
          <p><strong>Stats:</strong></p>
          <ul>
            <li><strong>Data Length:</strong> {stats.dataLength}</li>
            <li><strong>Encoded Data Length:</strong> {stats.encodedDataLength}</li>
            <li><strong>Requests:</strong> {stats.requests}</li>
          </ul>
        </div>
      </div>
    );
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
      {result && renderResult(result)}
    </div>
  );
}