#!/usr/bin/env node

/**
 * Simple Database Migration Script for Supabase
 * Handles basic migration tracking during CI/CD deployments
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase/migrations');

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Get list of migration files
 */
function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('📁 No migrations directory found, creating it...');
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    return [];
  }
  
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure chronological order
}

/**
 * Check if migrations table exists
 */
async function checkMigrationsTable() {
  try {
    const { data, error } = await supabase
      .from('_migrations')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "_migrations" does not exist')) {
        return false;
      }
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error checking migrations table:', error);
    return false;
  }
}

/**
 * Get applied migrations from database
 */
async function getAppliedMigrations() {
  try {
    const { data, error } = await supabase
      .from('_migrations')
      .select('filename')
      .order('applied_at');
      
    if (error) {
      console.error('Error fetching applied migrations:', error);
      return [];
    }
    
    return data.map(row => row.filename);
  } catch (error) {
    console.error('Error fetching applied migrations:', error);
    return [];
  }
}

/**
 * Calculate checksum for migration file
 */
function calculateChecksum(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Record a migration as applied
 */
async function recordMigration(filename, checksum) {
  try {
    const { error } = await supabase
      .from('_migrations')
      .insert({
        filename,
        checksum,
        applied_at: new Date().toISOString()
      });
      
    if (error) {
      throw error;
    }
    
    console.log(`✅ Recorded migration: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to record migration ${filename}:`, error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Ensure we have required environment variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    }
    
    // Check if migrations table exists
    const tableExists = await checkMigrationsTable();
    if (!tableExists) {
      console.log('⚠️  Migrations table does not exist.');
      console.log('📝 Please create it manually in Supabase SQL editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS _migrations (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW(),
  checksum VARCHAR(64)
);
      `);
      console.log('✅ For now, continuing without migration tracking...');
      return;
    }
    
    // Get migration files and applied migrations
    const migrationFiles = getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations();
    
    // Find pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !appliedMigrations.includes(file)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations found');
      return;
    }
    
    console.log(`📋 Found ${pendingMigrations.length} pending migrations:`);
    pendingMigrations.forEach(file => console.log(`  - ${file}`));
    
    // For each pending migration, log it and record it
    for (const migration of pendingMigrations) {
      const filePath = path.join(MIGRATIONS_DIR, migration);
      const content = fs.readFileSync(filePath, 'utf8');
      const checksum = calculateChecksum(content);
      
      console.log(`\n📄 Migration: ${migration}`);
      console.log('--- SQL Content ---');
      console.log(content);
      console.log('--- End SQL ---');
      
      // Record the migration as applied (assuming manual execution)
      await recordMigration(migration, checksum);
    }
    
    console.log('\n🎉 Migration tracking completed!');
    console.log('⚠️  Note: SQL must be executed manually in Supabase SQL editor');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Rollback last migration (for emergency use)
 */
async function rollbackLastMigration() {
  try {
    console.log('⚠️  Rolling back last migration...');
    
    // Get the last applied migration
    const { data, error } = await supabase
      .from('_migrations')
      .select('*')
      .order('applied_at', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('No migrations to rollback');
      return;
    }
    
    const lastMigration = data[0];
    console.log(`Rolling back: ${lastMigration.filename}`);
    
    // Remove from migrations table
    const { error: deleteError } = await supabase
      .from('_migrations')
      .delete()
      .eq('id', lastMigration.id);
      
    if (deleteError) throw deleteError;
    
    console.log('✅ Migration record removed from tracking table');
    console.log('⚠️  Manual schema rollback may be required in Supabase SQL editor');
    
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'rollback':
    rollbackLastMigration();
    break;
  case 'migrate':
  default:
    runMigrations();
    break;
}

export {
  runMigrations,
  rollbackLastMigration
}; 