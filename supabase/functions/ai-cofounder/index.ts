import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build system prompt with user context
    const systemPrompt = `You are an AI Co-Founder and business coach for startup founders. You're knowledgeable, supportive, and focused on helping founders execute and succeed.

Current user context:
- Name: ${context.userName}
- Level: ${context.level} (earned ${context.totalXP} XP total)
- Current streak: ${context.streak} days
- Active quests: ${context.activeQuests.length > 0 ? context.activeQuests.join(', ') : 'None yet'}
- Completed quests: ${context.completedQuestsCount}

Your role:
1. Help prioritize tasks and suggest what to focus on
2. Provide strategic business advice and coaching
3. Act as an accountability partner
4. Celebrate wins and motivate during tough times
5. Help break down big goals into actionable quests
6. Remember past conversations for continuity

Keep responses concise but insightful. Be encouraging but honest. If they ask about their progress, reference their actual stats. Suggest new quests when appropriate.`;

    // Build messages array with history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    console.log('Sending request to AI gateway with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status, await response.text());
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('AI gateway error');
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('AI Co-Founder error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});