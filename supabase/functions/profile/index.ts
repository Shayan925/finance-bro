import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

// Map frontend field names to database field names
const fieldMapping = {
  timeHorizon: 'investment_horizon',
  riskTolerance: 'risk_tolerance',
  investmentGoal: 'investment_goal',
  initialInvestment: 'initial_investment',
  monthlyContribution: 'monthly_contribution',
  preferredAssetTypes: 'preferred_asset_types'
};

// Map database field names to frontend field names
const reverseFieldMapping = Object.entries(fieldMapping).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Extract the user ID from the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token');
    }

    // Handle different HTTP methods
    if (req.method === 'GET') {
      // Get user profile
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Map database fields to frontend fields
      const mappedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (reverseFieldMapping[key]) {
          acc[reverseFieldMapping[key]] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      return new Response(
        JSON.stringify(mappedData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (req.method === 'POST') {
      // Update or create user profile
      const profile = await req.json();
      
      // Map frontend fields to database fields
      const mappedProfile = Object.entries(profile).reduce((acc, [key, value]) => {
        if (fieldMapping[key]) {
          acc[fieldMapping[key]] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const { data, error } = await supabaseClient
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...mappedProfile,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Map database fields back to frontend fields
      const mappedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (reverseFieldMapping[key]) {
          acc[reverseFieldMapping[key]] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      return new Response(
        JSON.stringify(mappedData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    throw new Error('Method not allowed');
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
}); 