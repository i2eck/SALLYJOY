# 🔥 Firebase Setup Guide - Sally Joy Camps

This guide will help you set up Firebase to track sales from all distributed devices in real-time.

## ⚡ Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create Project**
3. Name: `sallyjoy-camps`
4. Click **Create Project**
5. Wait for it to finish

### Step 2: Create Firestore Database
1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Start in **Test Mode** (for development)
4. Choose location: **US (or closest to you)**
5. Click **Create**

### Step 3: Get Your Config
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (if not already there)
4. Copy the entire `firebaseConfig` object
5. Replace the dummy config in `index.html` with your real config

### Step 4: Update index.html
Find this section in `index.html`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDlJgZ_t6K0j2mPqQ8vL9nR4sT5uV6wX7y",
  authDomain: "sallyjoy-camps.firebaseapp.com",
  projectId: "sallyjoy-camps",
  storageBucket: "sallyjoy-camps.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

Replace with YOUR config from Firebase Console.

### Step 5: Deploy
```bash
git add .
git commit -m "Add Firebase cloud sync for global sales tracking"
git push
```

Railway will auto-deploy!

---

## 🎯 How It Works

### Generating Tickets
1. Fill form → Click "Generate & Share Ticket"
2. Ticket is **saved locally** instantly
3. Ticket is **synced to Firebase cloud** in background
4. Works offline, syncs when connection available

### Viewing Sales

#### On Single Device (Local)
- Dashboard shows "Sold Today" from this device only
- Shows breakdown by ticket type

#### Global Sales (All Devices)
- Click **"View Global Sales"** button on Dashboard
- Shows total sales from ALL devices connected to Firebase
- Real-time updates!

---

## 📊 Database Structure

Your Firestore will have a `tickets` collection with documents like:

```json
{
  "name": "isaac nkole",
  "phone": "0977625656",
  "type": "50",
  "typeText": "Early Bird - K50",
  "payment": "Cash",
  "number": "A6QAG3RYRY",
  "date": "9/19/2026",
  "timestamp": "2026-09-19T10:30:00Z",
  "deviceId": "Mozilla/5.0..."
}
```

---

## 🔒 Security Rules (Important!)

After testing, update your Firestore Security Rules:

Go to **Firestore** → **Rules** and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, restrict access (ask me for secure rules).

---

## ✅ Testing

1. Open app on **Device 1** → Generate a ticket
2. Open app on **Device 2** → Generate a ticket
3. Click "View Global Sales" on either device
4. Should show **2 tickets sold** total across both devices!

---

## 🆘 Troubleshooting

**Error: "Firebase not configured"**
- Check your config is correctly copied
- Refresh page
- Check browser console for errors

**Sales not showing?**
- Make sure Firestore database is created
- Check Security Rules are correct
- Verify you're connected to internet

**Still not working?**
- Check Firebase Console for any errors
- Verify project permissions
- Make sure billing is enabled (free tier works)

---

## 🎉 You're Done!

Your app now has **cloud-powered global sales tracking**! 

All devices sync to Firebase → View total sales from anywhere! 🚀
