import { NextResponse } from 'next/server';

export async function POST(request) {
  const { url } = await request.json();
  const API_KEY = process.env.URLSCAN_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is not set' }, { status: 500 });
  }

  try {
    const response = await fetch('https://urlscan.io/api/v1/scan/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'API-Key': API_KEY 
      },
      body: JSON.stringify({ url, visibility: 'public' }),
    });

    if (!response.ok) {
      throw new Error(HTTP error! status: ${response.status});
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting URL:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get('uuid');
  const API_KEY = process.env.URLSCAN_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is not set' }, { status: 500 });
  }

  try {
    const response = await fetch(https://urlscan.io/api/v1/result/${uuid}/, {
      headers: { 'API-Key': API_KEY }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Scan not completed yet' }, { status: 404 });
      }
      throw new Error(HTTP error! status: ${response.status});
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting scan result:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
app/api/urlscan/route.js