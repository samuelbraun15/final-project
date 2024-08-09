import { NextResponse } from 'next/server';

export async function POST(request) {
  const { url } = await request.json();
  const API_KEY = process.env.URLSCAN_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is not set' }, { status: 500 });
  }

  try {
    const submitResponse = await fetch('https://urlscan.io/api/v1/scan/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': API_KEY,
      },
      body: JSON.stringify({ url: url }),
    });

    if (!submitResponse.ok) {
      throw new Error(`Failed to submit URL: ${submitResponse.status}`);
    }

    const { uuid } = await submitResponse.json();
    return NextResponse.json({ uuid });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get('uuid');
  const API_KEY = process.env.URLSCAN_API_KEY;

  if (!uuid) {
    return NextResponse.json({ error: 'UUID is required' }, { status: 400 });
  }

  try {
    const resultResponse = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`, {
      method: 'GET',
      headers: {
        'API-Key': API_KEY,
      },
    });

    if (!resultResponse.ok) {
      throw new Error(`Failed to retrieve scan result: ${resultResponse.status}`);
    }

    const result = await resultResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}