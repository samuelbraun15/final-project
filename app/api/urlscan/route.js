URLSCAN_API_KEY=import { NextResponse } from 'next/server';

export async function POST(request) {
  const { url } = await request.json();
  const API_KEY = process.env.URLSCAN_API_KEY;

  try {
    const response = await fetch('https://urlscan.io/api/v1/scan/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': API_KEY,
      },
      body: JSON.stringify({ url: url }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit URL: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get('uuid');
  const API_KEY = process.env.URLSCAN_API_KEY;

  try {
    const response = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`, {
      headers: {
        'API-Key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch result: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}