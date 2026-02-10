import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL = process.env.AI_MODEL || 'google/gemini-2.5-flash-lite';

const SYSTEM_PROMPT = `You are an image analysis assistant specialized in handwriting template processing.

You will receive an image of a handwriting template with a grid layout. The template has:
- A grid of cells arranged in rows and columns (typically 5 columns × 6 rows = 26 cells for A-Z)
- Each cell contains a handwritten letter
- The grid may have slight rotation, skew, or uneven lighting

Your task is to:
1. Identify the grid structure (rows, columns)
2. Locate each letter cell's bounding box coordinates (x, y, width, height in pixels)
3. Identify which letter (A-Z) corresponds to each cell (left-to-right, top-to-bottom)
4. Assess the quality/clarity of each handwritten character (0-100 score)
5. Note any issues (blurry characters, missing letters, noise, etc.)

Respond ONLY with valid JSON in this exact format:
{
  "characters": [
    {"letter": "A", "bbox": {"x": 10, "y": 10, "width": 100, "height": 100}, "quality_score": 85},
    {"letter": "B", "bbox": {"x": 120, "y": 10, "width": 100, "height": 100}, "quality_score": 72},
    ...
  ],
  "issues": ["Character G appears blurry", "Uneven lighting detected on left side"]
}

Important:
- bbox coordinates should be in PIXELS relative to the image
- quality_score: 0-100 (100 = perfect clarity)
- If a character is missing or unreadable, still include it with quality_score < 30
- Always return exactly 26 characters (A-Z)`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Determine MIME type from base64 magic bytes
    let mimeType = 'image/png';
    if (image.startsWith('/9j/')) {
      mimeType = 'image/jpeg';
    } else if (image.startsWith('UklGR')) {
      mimeType = 'image/webp';
    } else if (image.startsWith('iVBOR')) {
      mimeType = 'image/png';
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'FontGen',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this handwriting template image. Identify each letter cell, provide bounding box coordinates, and assess quality. Return JSON only.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'AI processing failed' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty AI response' },
        { status: 502 }
      );
    }

    // Parse JSON from the AI response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', content);
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Preprocessing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
