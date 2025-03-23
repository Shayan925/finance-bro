import 'https://deno.land/x/xhr@0.3.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate and parse JSON request body
    let message: string;
    try {
      const body = await req.json();
      message = body.message;
      if (!message || typeof message !== 'string') {
        throw new Error('Invalid message format');
      }
    } catch (error) {
      console.error('❌ JSON parsing error:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('📦 Received message:', message);

    // Retrieve API key from environment variables (make sure it is set in Supabase)
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      console.error('❌ Missing API key');
      return new Response(
        JSON.stringify({ error: 'Missing API key' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Prepare the payload as per DeepSeek's sample:
    // They use messages and model fields only.
    const deepSeekPayload = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are a qualified financial advisor and analyst. Provide clear, accurate, and well-structured responses about financial topics.
          Your response should be in the following JSON format:
          {
            "summary": "A brief summary of the analysis",
            "technicalFactors": ["List of technical factors affecting the asset"],
            "fundamentalFactors": ["List of fundamental factors affecting the asset"],
            "outlook": "Market outlook and future predictions"
          }`
        },
        {
          role: 'user',
          content: message
        }
      ]
    };

    // Log the payload for debugging
    console.log('🔎 DeepSeek payload:', deepSeekPayload);

    // Call the DeepSeek API using the endpoint without the "/v1" segment.
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deepSeekPayload),
    });

    // Handle DeepSeek API errors by logging the response details
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return new Response(
        JSON.stringify({ error: `DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    // Parse and validate API response
    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No choices returned from API.');
    }

    console.log('✅ DeepSeek API Response:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices.length,
      firstChoice: data.choices[0].message.content.slice(0, 100) + '...'
    });

    // Parse the analysis text from the response
    let analysisText;
    try {
      analysisText = JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('❌ Failed to parse analysis text:', error);
      analysisText = {
        summary: data.choices[0].message.content,
        technicalFactors: [],
        fundamentalFactors: [],
        outlook: "Unable to generate detailed analysis"
      };
    }

    // Generate mock stock data for now
    const stockData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString(),
        price: Math.random() * 100 + 50,
        open: Math.random() * 100 + 50,
        high: Math.random() * 100 + 50,
        low: Math.random() * 100 + 50,
        volume: Math.random() * 1000000,
        returns: Math.random() * 0.1 - 0.05,
        ma20: Math.random() * 100 + 50,
        ma50: Math.random() * 100 + 50,
        ma200: Math.random() * 100 + 50,
        atr: Math.random() * 5,
        obv: Math.random() * 1000000,
        ad: Math.random() * 1000000,
        momentum: Math.random() * 10 - 5,
        roc: Math.random() * 10 - 5,
        natr: Math.random() * 0.1,
        rsi: Math.random() * 100,
        macd: Math.random() * 10 - 5,
        macd_signal: Math.random() * 10 - 5,
        bb_upper: Math.random() * 100 + 50,
        bb_lower: Math.random() * 100 + 50
      };
    }).reverse();

    // Generate mock stats
    const stats = {
      technical: {
        atr: Math.random() * 5,
        natr: Math.random() * 0.1,
        obv: Math.random() * 1000000,
        ad_line: Math.random() * 1000000,
        momentum: Math.random() * 10 - 5,
        roc: Math.random() * 10 - 5
      }
    };

    // Generate a share ID
    const shareId = crypto.randomUUID();

    // Return the response
    return new Response(
      JSON.stringify({
        stockData,
        analysisText: {
          ...analysisText,
          timestamp: new Date().toISOString()
        },
        stats,
        shareId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('❌ Server error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
