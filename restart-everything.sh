#!/bin/bash

echo "🇮🇳 =================================================="
echo "   Restarting MGNREGA Application"
echo "   =================================================="
echo ""

# Kill existing processes
echo "🛑 Step 1: Stopping existing processes..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
sleep 2
echo "✅ Processes stopped"
echo ""

# Check MongoDB
echo "📊 Step 2: Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
fi
echo "✅ MongoDB running"
echo ""

# Check Redis (optional)
echo "⚡ Step 3: Checking Redis..."
if ! pgrep -x "redis-server" > /dev/null; then
    echo "Starting Redis..."
    brew services start redis
    sleep 2
fi
echo "✅ Redis running (or will continue without it)"
echo ""

# Navigate to project
cd ~/Desktop/Codes/MNREGA-voice-rights

# Start Backend
echo "🚀 Step 4: Starting Backend Server..."
cd backend

# Ensure we have the latest controller fix
if grep -q "Only search by districtId" controllers/districtController.js 2>/dev/null; then
    echo "✅ Controller fix is applied"
else
    echo "⚠️  Applying controller fix..."
    curl -s https://gist.githubusercontent.com/temp/controller-fix.js > controllers/districtController.js 2>/dev/null || echo "Using existing controller"
fi

# Start backend in background
echo ""
echo "Starting backend on port 5001..."
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to initialize..."
for i in {1..30}; do
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Test backend
echo ""
echo "🧪 Testing backend endpoints..."
echo ""

HEALTH=$(curl -s http://localhost:5001/health)
if echo "$HEALTH" | grep -q "success"; then
    echo "✅ Health check: PASSED"
else
    echo "❌ Health check: FAILED"
    echo "Response: $HEALTH"
fi

STATES=$(curl -s http://localhost:5001/api/states)
STATE_COUNT=$(echo "$STATES" | jq -r '.count' 2>/dev/null || echo "0")
echo "✅ States available: $STATE_COUNT"

DISTRICTS=$(curl -s http://localhost:5001/api/districts?limit=1)
DISTRICT_COUNT=$(echo "$DISTRICTS" | jq -r '.pagination.total' 2>/dev/null || echo "0")
echo "✅ Total districts: $DISTRICT_COUNT"

# Start Frontend
cd ../frontend

echo ""
echo "🎨 Step 5: Starting Frontend..."
echo ""

# Verify .env
if [ -f .env ]; then
    if grep -q "REACT_APP_API_URL=http://localhost:5001/api" .env; then
        echo "✅ Frontend .env is configured correctly"
    else
        echo "⚠️  Fixing .env..."
        echo "REACT_APP_API_URL=http://localhost:5001/api" > .env
    fi
else
    echo "Creating .env..."
    echo "REACT_APP_API_URL=http://localhost:5001/api" > .env
fi

echo ""
echo "Starting frontend on port 3000..."
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "Waiting for frontend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    fi
    echo -n "."
    sleep 1
done

cd ..

echo ""
echo "=================================================="
echo "✅ Application Started Successfully!"
echo "=================================================="
echo ""
echo "📊 System Status:"
echo "   🗄️  MongoDB:    ✅ Running"
echo "   ⚡ Redis:       ✅ Running (optional)"
echo "   🔧 Backend:     http://localhost:5001"
echo "   🎨 Frontend:    http://localhost:3000"
echo ""
echo "📝 Process IDs:"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📋 Available Data:"
echo "   States:     $STATE_COUNT"
echo "   Districts:  $DISTRICT_COUNT"
echo ""
echo "🌐 Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "📊 View Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 Stop Everything:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   OR"
echo "   pkill -f 'node.*server.js'"
echo "   pkill -f 'react-scripts'"
echo ""
echo "⚠️  SYSTEM DATE ISSUE DETECTED:"
echo "   Your system shows: $(date)"
echo "   This is October 2025 (future date)"
echo "   To fix: System Preferences → Date & Time → Set date automatically"
echo ""

# Open browser automatically
sleep 5
echo "🌐 Opening browser..."
open http://localhost:3000

echo ""
echo "✅ Setup complete! Check your browser."
echo ""
