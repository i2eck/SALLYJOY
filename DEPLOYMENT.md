# 🚀 Sally Joy Camps - DEPLOYMENT GUIDE

## **3 Ways to Run Your Ticketing System**

---

## **OPTION 1: Local Network (Laptop at Event) 🖥️**

**Best for:** Running at your location, all staff on same WiFi

### Setup

1. **Install on your laptop**
   ```bash
   npm install
   npm start
   ```

2. **Find your laptop's IP address**

   **Windows:**
   - Open Command Prompt
   - Type: `ipconfig`
   - Look for "IPv4 Address" (e.g., `192.168.1.10`)

   **Mac:**
   - System Preferences → Network
   - Look for "IP Address"

   **Linux:**
   - Terminal: `ifconfig`
   - Look for inet address

3. **Share with sellers**
   - Give them: `http://YOUR_IP:5000/app.html`
   - Example: `http://192.168.1.10:5000/app.html`

4. **At event**
   - Keep laptop plugged in
   - Keep WiFi enabled
   - Everyone on same WiFi can access

### Pros ✅
- Free
- No internet needed
- Fast
- Data stays local

### Cons ❌
- Only works on same WiFi
- Laptop must stay on
- Need to know IP address

---

## **OPTION 2: Railway (Cloud - RECOMMENDED) ☁️**

**Best for:** Sellers anywhere, always online, professional

### Setup (5 minutes)

1. **Create Railway account**
   - Go to: https://railway.app
   - Sign up with GitHub

2. **Connect to GitHub**
   - Push your code to GitHub
   - OR upload ZIP directly on Railway

3. **Create new project**
   - Click "New Project"
   - Select "GitHub Repo" or "Deploy from GitHub"
   - Choose your `sally-joy-camps-ticketing` repo

4. **Set environment**
   - Railway auto-detects Node.js
   - Click "Deploy"
   - Takes ~2 minutes

5. **Get your URL**
   - Once deployed, Railway gives you a link
   - Example: `https://sally-joy-camps-xyz.railway.app`
   - **Share this link with all sellers**

6. **Sellers use it**
   - Sellers open: `https://your-app.railway.app/app.html`
   - Works from anywhere
   - Works anytime

### Pros ✅
- Works globally
- Always online
- Professional
- Easy setup
- Free tier available

### Cons ❌
- Needs internet
- Slight delay
- External service

### Cost
- Free tier: 500 hours/month (plenty)
- Paid: ~$5-10/month if needed

---

## **OPTION 3: Heroku (Alternative Cloud) ☁️**

**Best for:** Traditional deployment, 12-hour free tier

### Setup

1. **Create Heroku account**
   - Go to: https://heroku.com
   - Sign up

2. **Install Heroku CLI**
   - Download: https://devcenter.heroku.com/articles/heroku-cli

3. **Deploy**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   heroku open
   ```

4. **Get your URL**
   - Heroku shows: `https://your-app-name.herokuapp.com`
   - Use: `https://your-app-name.herokuapp.com/app.html`

### Cost
- Free tier: 550 hours/month (enough for event)
- Paid: ~$7/month

---

## **WHICH OPTION SHOULD YOU CHOOSE?**

| Need | Best Option |
|------|------------|
| Quick local test | Option 1 (Laptop) |
| Multiple locations, WiFi | Option 1 (Laptop) |
| Sellers from different cities | Option 2 (Railway) |
| Professional setup | Option 2 (Railway) |
| Backup plan | Option 2 + Option 1 |

**Recommended: Railway + Laptop Backup**
- Railway for normal use
- Laptop for backup if internet fails

---

## **TESTING BEFORE OCTOBER 31st**

### Test locally first
```bash
npm install
npm start
# Open: http://localhost:5000/app.html
```

### Test with multiple devices
- Seller on Phone 1
- Seller on Phone 2
- Check-in on Tablet
- All on same WiFi

### Test all methods
- ✅ Seller signs in
- ✅ Creates ticket
- ✅ Sends via WhatsApp
- ✅ Prints ticket
- ✅ Check-in scans QR
- ✅ Dashboard shows sales

---

## **DATABASE BACKUP**

### Local Backup
Before deleting or updating:
```bash
cp tickets.db tickets.db.backup
```

### Export Data
```bash
sqlite3 tickets.db "SELECT * FROM tickets;" > tickets_export.csv
```

---

## **TROUBLESHOOTING DEPLOYMENT**

### "App won't start"
```bash
# Check Node.js version
node --version
# Should be v14+

# Clear cache
rm -rf node_modules package-lock.json
npm install
npm start
```

### "Port 5000 in use"
```bash
# Use different port
PORT=3000 npm start
# Then: http://localhost:3000/app.html
```

### "Database locked"
```bash
# Close any open connections
rm tickets.db
npm start
# Database recreates fresh
```

### "Railway deployment fails"
- Check: GitHub repo is public
- Check: package.json exists
- Check: No syntax errors in code
- View logs in Railway dashboard

---

## **AFTER EVENT**

### Export data
```bash
sqlite3 tickets.db ".mode csv" ".headers on" "SELECT * FROM tickets;" > sally-joy-camps-tickets.csv
```

### Archive
```bash
zip -r sally-joy-camps-2026.zip .
```

### Shutdown
- Stop local server: CTRL+C
- Pause Railway: (optional)
- Backup database: Keep tickets.db

---

## **SECURITY CHECKLIST**

Before going live:

- [ ] Change default admin credentials
- [ ] Use HTTPS (Railway does this automatically)
- [ ] Keep database backups
- [ ] Don't share admin link publicly
- [ ] Test payment methods
- [ ] Train all sellers
- [ ] Test on multiple phones
- [ ] Have backup WiFi/internet
- [ ] Have laptop as backup
- [ ] Test QR scanner app

---

## **SUPPORT**

If deployment has issues:
1. Check logs (Railway dashboard / Heroku logs)
2. Review error messages
3. Check internet connection
4. Restart server
5. Contact hosting support

---

**You're ready to deploy! 🚀**

Questions? Review this guide or ask your technical team.
