#!/bin/bash

# Rollback Verification Script for SambaTV Prompt Library
# This script verifies that a rollback was successful

set -e

echo "🔍 ROLLBACK VERIFICATION INITIATED"
echo "Timestamp: $(date)"

# Configuration
HEALTH_URL="https://sambatv-prompt-lib-sid-danis-projects.vercel.app/api/health"
MAIN_URL="https://sambatv-prompt-lib-sid-danis-projects.vercel.app"
MAX_RESPONSE_TIME=2.0
MAX_RETRIES=5
RETRY_DELAY=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
success() {
  echo -e "${GREEN}✅ $1${NC}"
}

warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
  echo -e "${RED}❌ $1${NC}"
}

info() {
  echo "ℹ️  $1"
}

# Function to check health endpoint
check_health() {
  local attempt=$1
  info "Health check attempt $attempt/$MAX_RETRIES..."
  
  if curl -f -s "$HEALTH_URL" > /dev/null; then
    success "Health check passed"
    return 0
  else
    error "Health check failed"
    return 1
  fi
}

# Function to check response time
check_performance() {
  info "Checking application performance..."
  
  RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null "$MAIN_URL" 2>/dev/null || echo "999")
  
  if (( $(echo "$RESPONSE_TIME < $MAX_RESPONSE_TIME" | bc -l 2>/dev/null || echo "0") )); then
    success "Performance acceptable (${RESPONSE_TIME}s < ${MAX_RESPONSE_TIME}s)"
    return 0
  else
    warning "Performance degraded (${RESPONSE_TIME}s >= ${MAX_RESPONSE_TIME}s)"
    return 1
  fi
}

# Function to check HTTP status codes
check_http_status() {
  info "Checking HTTP status codes..."
  
  local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$MAIN_URL")
  
  if [[ "$status_code" == "200" ]]; then
    success "HTTP status OK ($status_code)"
    return 0
  else
    error "HTTP status error ($status_code)"
    return 1
  fi
}

# Function to check database connectivity
check_database() {
  info "Checking database connectivity via health endpoint..."
  
  local health_response=$(curl -s "$HEALTH_URL" 2>/dev/null || echo '{"status":"error"}')
  
  if echo "$health_response" | grep -q '"status":"ok"'; then
    success "Database connectivity confirmed"
    return 0
  else
    error "Database connectivity issues detected"
    echo "Health response: $health_response"
    return 1
  fi
}

# Function to check deployment info
check_deployment_info() {
  info "Checking current deployment information..."
  
  local current_commit=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
  local current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
  
  echo "Current commit: $current_commit"
  echo "Current branch: $current_branch"
  
  if [[ "$current_branch" == "main" ]]; then
    success "On main branch"
  else
    warning "Not on main branch ($current_branch)"
  fi
}

# Function to check for error patterns
check_error_patterns() {
  info "Checking for common error patterns..."
  
  local response=$(curl -s "$MAIN_URL" 2>/dev/null || echo "")
  
  if echo "$response" | grep -qi "error\|exception\|500\|502\|503\|504"; then
    error "Error patterns detected in response"
    return 1
  else
    success "No error patterns detected"
    return 0
  fi
}

# Main verification process
echo "🎯 Starting comprehensive rollback verification..."
echo "Target URL: $MAIN_URL"
echo "Health URL: $HEALTH_URL"
echo ""

# Initialize counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Check 1: Health endpoint with retries
echo "📋 Check 1: Health Endpoint"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
HEALTH_PASSED=false

for i in $(seq 1 $MAX_RETRIES); do
  if check_health $i; then
    HEALTH_PASSED=true
    break
  else
    if [[ $i -lt $MAX_RETRIES ]]; then
      info "Retrying in ${RETRY_DELAY} seconds..."
      sleep $RETRY_DELAY
    fi
  fi
done

if $HEALTH_PASSED; then
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
  error "Health check failed after $MAX_RETRIES attempts"
fi

echo ""

# Check 2: HTTP Status
echo "📋 Check 2: HTTP Status"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_http_status; then
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

echo ""

# Check 3: Performance
echo "📋 Check 3: Performance"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_performance; then
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

echo ""

# Check 4: Database Connectivity
echo "📋 Check 4: Database Connectivity"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_database; then
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

echo ""

# Check 5: Error Patterns
echo "📋 Check 5: Error Pattern Detection"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_error_patterns; then
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi

echo ""

# Check 6: Deployment Info
echo "📋 Check 6: Deployment Information"
check_deployment_info

echo ""

# Summary
echo "📊 VERIFICATION SUMMARY"
echo "======================"
echo "Total checks: $TOTAL_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $FAILED_CHECKS"
echo "Success rate: $(( PASSED_CHECKS * 100 / TOTAL_CHECKS ))%"

echo ""

# Overall result
if [[ $FAILED_CHECKS -eq 0 ]]; then
  success "🎉 ROLLBACK VERIFICATION SUCCESSFUL"
  echo "All systems are operational after rollback"
  exit 0
elif [[ $PASSED_CHECKS -ge $((TOTAL_CHECKS * 2 / 3)) ]]; then
  warning "⚠️  ROLLBACK PARTIALLY SUCCESSFUL"
  echo "Most systems operational, but some issues detected"
  echo "Manual investigation recommended"
  exit 1
else
  error "🚨 ROLLBACK VERIFICATION FAILED"
  echo "Critical issues detected after rollback"
  echo "Immediate intervention required"
  exit 2
fi 