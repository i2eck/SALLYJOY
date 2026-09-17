# 🎫 Sally Joy Camps - Multi-Seller Ticketing System
## George Lilanda Edition | October 31st, 2026

A complete mobile-first ticketing system for Sally Joy Camps with multi-location seller support, QR code generation, and real-time check-in scanning.

---

## 📋 Features

✅ **Multi-Seller Support** - Multiple staff across different booths/locations
✅ **Mobile Seller App** - Sellers sign in → Sell tickets → Generate QR codes  
✅ **3-Way Ticket Delivery** - Send via WhatsApp, Print QR, or Show on Phone
✅ **Customer Ticket Page** - Unique shareable link for each ticket
✅ **Mobile Check-in** - Scan QR codes with phone camera at event
✅ **Real-time Dashboard** - Live sales, attendance, and revenue tracking
✅ **Payment Tracking** - Record all payment methods (cash, mobile money, bank, WhatsApp)
✅ **Responsive Design** - Optimized for phones, tablets, and desktop
✅ **SQLite Database** - No external database needed
✅ **Deploy Ready** - Works on local network or cloud (Railway, Heroku, AWS)

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** v14+ (download from https://nodejs.org)
- **npm** (comes with Node.js)

### Installation

1. **Navigate to project folder:**
```bash
cd path/to/sally-joy-camps-ticketing
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

You'll see:
```
🎫 Sally Joy Camps Ticketing System running on http://localhost:5000
📊 Admin Panel: http://localhost:5000/admin
🔍 Check-in App: http://localhost:5000/checkin
```

4. **Open in browser:**
```
http://localhost:5000
```

That's it! 🎉

---

## 📱 How to Use

### **SELLER WORKFLOW** 🎫

**At the Booth/Location:**

1. **Sign In** (first time)
   - Open: `http://your-server/app.html`
   - Enter your name (e.g., "John Banda")
   - Enter your location (e.g., "Main Gate Booth 1")
   - Sign in

2. **Sell Ticket to Customer**
   - Customer comes to booth
   - Customer pays (cash, mobile money, bank transfer, WhatsApp)
   - Click **🎟️ Sell Ticket**
   - Enter:
     - Customer's name
     - Customer's phone number
     - Ticket type: ⭐ K50 / 🎟️ K80 / 👑 K150
     - How they paid
   - Click **✨ Generate & Share Ticket**

3. **Give Ticket to Customer** (Choose one method)
   - **📱 Send WhatsApp** - Click button → Share on WhatsApp → Customer gets link
   - **🖨️ Print** - Print QR code with customer details
   - **📲 Show on Phone** - Show customer the QR code to screenshot

4. **Track Your Sales**
   - See how many you've sold today
   - See your revenue
   - Stats update automatically

---

### **CUSTOMER WORKFLOW** 🎫

1. **Receive Ticket** (from seller)
   - Get link via WhatsApp: `https://your-app.com/ticket/abc123def`
   - OR get printed QR code
   - OR screenshot QR code from seller's phone

2. **View/Share Ticket**
   - Open link in browser
   - See full ticket details
   - Save/screenshot the page
   - Share with friends if needed

3. **At Event**
   - Show QR code on phone screen OR printed ticket
   - Staff scans with check-in app ✅

---

### **CHECK-IN AT EVENT** ✅

**Staff with Phone/Tablet:**

1. Open app: `http://your-server/app.html`
2. Click **✅ Check-In** tab
3. Two options:
   - **📱 Camera Scan** - Point at customer's QR code on phone/paper
   - **⌨️ Manual Entry** - Type ticket ID if camera fails
4. System confirms instantly ✅
5. Repeat for next customer

---

### **ADMIN DASHBOARD** 📊

1. Click **📊 Dashboard** tab
2. See real-time:
   - Total tickets sold (all locations)
   - Total checked in
   - Total revenue
   - Tickets by type
   - All attendees list

---

### **SELLER DASHBOARD** 📈

Each seller sees their own stats:
- How many tickets sold today
- Total revenue from their sales
- Break down by ticket type
- Update in real-time

---

## 💾 Database

All data is stored in `tickets.db` (SQLite file). No external database needed.

**Tables:**
- `tickets` - All ticket records with QR codes
- `sales` - Payment records linked to tickets

---

## 🔧 Customization

### Change Event Details
Edit the event name/date in `/public/index.html`:
```javascript
<p>George Lilanda Edition • October 31st, 2026</p>
```

### Change Ticket Prices
In `/public/index.html`, find `ticketPrices` object:
```javascript
const ticketPrices = {
  'K50': 50,
  'K80': 80,
  'K150': 150
};
```

### Change Server Port
In `server.js`:
```javascript
const PORT = process.env.PORT || 5000;
```

---

## 📤 Deployment

### **Option 1: Heroku (Free Tier - Quick)**

1. Create account at https://heroku.com
2. Install Heroku CLI
3. Run:
```bash
heroku create your-app-name
git push heroku main
heroku open
```

### **Option 2: Railway (Fast & Reliable)**

1. Go to https://railway.app
2. Connect GitHub repo
3. Deploy automatically

### **Option 3: Your Own Server**

Use any hosting with Node.js support:
- AWS EC2
- DigitalOcean
- Linode
- VPS (any provider)

---

## 🔐 Security Notes

- **Admin Access:** Currently open. Add authentication before production:
  ```javascript
  // Add login middleware in server.js
  app.use((req, res, next) => {
    // Add token validation here
  });
  ```

- **Backup Database:** Copy `tickets.db` regularly
  ```bash
  cp tickets.db tickets.db.backup
  ```

- **HTTPS:** Use HTTPS in production (certificate required)

---

## 📊 API Endpoints

### Create Ticket
```
POST /api/tickets/create
Body: {
  "customer_name": "John Banda",
  "customer_phone": "+260977123456",
  "ticket_type": "K80",
  "payment_method": "bank_transfer"
}
```

### Check-in Scan
```
POST /api/checkin/scan
Body: {
  "qrData": "{...ticket data...}",
  "staffName": "Staff Name"
}
```

### Get Stats
```
GET /api/admin/stats
GET /api/admin/tickets
GET /api/admin/revenue
```

---

## 🆘 Troubleshooting

### **Camera not working on Check-in**
- Ensure HTTPS (camera requires secure context)
- Grant camera permissions to browser
- Try different browser (Chrome/Firefox work best)
- Use manual entry instead

### **Port 5000 already in use**
```bash
# Change port:
PORT=3000 npm start
# Then visit: http://localhost:3000
```

### **Database errors**
```bash
# Delete and recreate:
rm tickets.db
npm start
```

### **Tickets not showing**
- Refresh dashboard (may need 5-10 seconds)
- Check browser console for errors (F12)
- Verify server is running

---

## 📝 Workflow Checklist

- [ ] Set up server locally / deploy to cloud
- [ ] Test creating a ticket
- [ ] Send test QR code to phone
- [ ] Test scanning from phone camera
- [ ] Test manual check-in entry
- [ ] Verify dashboard updates
- [ ] Train staff on check-in app
- [ ] Print/share event poster with ticket prices
- [ ] Collect payments (WhatsApp/Bank)
- [ ] Generate QR ticket after verification
- [ ] At event: Use check-in app to scan attendees
- [ ] After event: Export attendance list

---

## 📞 Support

For issues or improvements:
- Check database manually: `sqlite3 tickets.db`
- View server logs during runtime
- Test API endpoints with Postman

---

## 🎉 Ready to Go!

Your ticketing system is now ready. Questions? Need help? Let me know!

**Built with ❤️ by Saio Development Enterprise**
