# Phoenix Quick Start Guide

## 🚀 Getting Phoenix Running (5 minutes)

### 1. Run the Setup Script
```bash
./scripts/phoenix-setup.sh
```

This script will:
- Check Docker is installed and running
- Create `.env.local` if needed
- Generate a secure Phoenix secret key
- Start all Phoenix services
- Verify everything is working

### 2. Verify Phoenix is Running
Open http://localhost:6006 in your browser. You should see the Phoenix UI.

### 3. Check Service Status
```bash
docker-compose ps
```

You should see:
- `sambatv-phoenix` - Running on port 6006
- `sambatv-phoenix-postgres` - Running on port 5433
- `sambatv-redis` - Running on port 6379

## 🛠️ Manual Setup (if script fails)

### 1. Copy Environment Variables
```bash
cp .env.local.example .env.local
```

### 2. Generate Phoenix Secret Key
```bash
openssl rand -base64 32
```
Add this to `PHOENIX_SECRET_KEY` in `.env.local`

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Check Logs
```bash
docker-compose logs -f phoenix
```

## 🔧 Common Issues

### Port Already in Use
If you see "port already allocated":
```bash
# Check what's using the port
lsof -i :6006

# Stop the service or use a different port in docker-compose.yml
```

### Phoenix Won't Start
```bash
# Reset everything
docker-compose down -v
docker-compose up -d

# Check logs
docker-compose logs phoenix
```

### Can't Access Phoenix UI
1. Check Docker is running: `docker ps`
2. Check Phoenix logs: `docker-compose logs phoenix`
3. Try accessing: http://127.0.0.1:6006 (instead of localhost)

## 📝 Next Steps

Once Phoenix is running:
1. ✅ Task 32 is complete!
2. Move to Task 33: Create authentication bridge
3. Then Task 34: Add database tables
4. Then Task 35: Create API proxy

## 🎯 Quick Commands

```bash
# Start Phoenix
docker-compose up -d

# Stop Phoenix
docker-compose stop

# View logs
docker-compose logs -f phoenix

# Restart Phoenix
docker-compose restart phoenix

# Reset everything
docker-compose down -v && docker-compose up -d
```

## 🏁 Success Checklist

- [ ] Docker Desktop is installed and running
- [ ] `./scripts/phoenix-setup.sh` ran successfully
- [ ] Can access http://localhost:6006
- [ ] All services show as "Up" in `docker-compose ps`
- [ ] No errors in `docker-compose logs phoenix`

If all boxes are checked, Phoenix is ready! 🎉