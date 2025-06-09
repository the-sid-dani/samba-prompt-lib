#!/usr/bin/env node

/**
 * Test script to add sample analytics data to verify the system is working
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addSampleAnalyticsData() {
  console.log('🧪 Adding sample analytics data...')

  try {
    // Get a sample user ID from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError)
      return
    }

    const userId = profiles?.[0]?.id

    if (!userId) {
      console.log('⚠️  No users found in profiles table. Creating sample analytics without user ID.')
    }

    // Add sample analytics events
    const analyticsEvents = [
      {
        user_id: userId,
        event_type: 'prompt_view',
        event_data: { prompt_id: 1, page_url: '/prompt/1' },
        session_id: 'test-session-1',
        page_url: '/prompt/1'
      },
      {
        user_id: userId,
        event_type: 'prompt_copy',
        event_data: { prompt_id: 1 },
        session_id: 'test-session-1'
      },
      {
        user_id: userId,
        event_type: 'playground_use',
        event_data: { prompt_id: 1, model: 'claude-3-5-sonnet-20241022' },
        session_id: 'test-session-1'
      },
      {
        user_id: userId,
        event_type: 'prompt_favorite',
        event_data: { prompt_id: 1 },
        session_id: 'test-session-1'
      },
      {
        user_id: userId,
        event_type: 'prompt_vote',
        event_data: { prompt_id: 1, vote_type: 'up' },
        session_id: 'test-session-2'
      }
    ]

    const { data: eventsData, error: eventsError } = await supabase
      .from('analytics_events')
      .insert(analyticsEvents)
      .select()

    if (eventsError) {
      console.error('❌ Error inserting analytics events:', eventsError)
      return
    }

    console.log(`✅ Added ${eventsData.length} analytics events`)

    // Add sample API usage logs
    const apiUsageLogs = [
      {
        user_id: userId,
        prompt_id: 1,
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        tokens_input: 150,
        tokens_output: 300,
        cost_usd: 0.002475, // Calculated based on Claude pricing
        request_duration_ms: 2500,
        status: 'success'
      },
      {
        user_id: userId,
        prompt_id: 1,
        provider: 'openai',
        model: 'gpt-4o-mini',
        tokens_input: 200,
        tokens_output: 250,
        cost_usd: 0.0009, // Calculated based on GPT-4o mini pricing
        request_duration_ms: 1800,
        status: 'success'
      },
      {
        user_id: userId,
        provider: 'google',
        model: 'gemini-1.5-flash-002',
        tokens_input: 100,
        tokens_output: 150,
        cost_usd: 0.0001125, // Calculated based on Gemini pricing
        request_duration_ms: 1200,
        status: 'success'
      }
    ]

    const { data: usageData, error: usageError } = await supabase
      .from('api_usage_logs')
      .insert(apiUsageLogs)
      .select()

    if (usageError) {
      console.error('❌ Error inserting API usage logs:', usageError)
      return
    }

    console.log(`✅ Added ${usageData.length} API usage logs`)

    // Verify the data was inserted
    const { data: eventCount } = await supabase
      .from('analytics_events')
      .select('id', { count: 'exact' })

    const { data: usageCount } = await supabase
      .from('api_usage_logs')
      .select('id', { count: 'exact' })

    console.log(`\n📊 Database Summary:`)
    console.log(`   Analytics Events: ${eventCount?.length || 0}`)
    console.log(`   API Usage Logs: ${usageCount?.length || 0}`)

    console.log('\n🎉 Sample analytics data added successfully!')
    console.log('💡 You can now check the admin dashboard to see the analytics data.')

  } catch (error) {
    console.error('❌ Error adding sample analytics data:', error)
  }
}

// Run the script
addSampleAnalyticsData() 