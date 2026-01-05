<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechCrush Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body{background:#0f172a;color:white;padding:20px;font-family:sans-serif}input,select{background:#1e293b;border:1px solid #334155;color:white;width:100%;padding:10px;margin-bottom:15px;border-radius:5px}label{color:#94a3b8;font-size:12px;font-weight:bold;text-transform:uppercase}h2{color:#60a5fa;font-size:18px;margin-bottom:10px;border-bottom:1px solid #334155;padding-bottom:5px}.btn{background:#2563eb;width:100%;padding:15px;font-weight:bold;border-radius:8px;cursor:pointer}.btn:hover{background:#1d4ed8}</style>
</head>
<body>
    <h1 class="text-2xl font-bold text-center mb-6 text-yellow-400">⚡ ADMIN CONTROL PANEL</h1>
    <div class="max-w-md mx-auto">
        <h2>Global Settings</h2>
        <label>Maintenance Mode</label>
        <select id="maint"><option value="false">🟢 Site Active</option><option value="true">🔴 Maintenance (Closed)</option></select>
        <label>Top Announcement</label>
        <input id="notice" type="text" placeholder="Announcement text...">
        <label>WhatsApp Number</label>
        <input id="wa" type="text" placeholder="919999999999">

        <h2>🥈 Silver Pot (100)</h2>
        <select id="s_status"><option value="OPEN">🟢 OPEN</option><option value="FULL">🔴 FULL</option></select>
        <input id="s_link" type="text" placeholder="Payment Link">

        <h2>🥇 Gold Pot (200)</h2>
        <select id="g_status"><option value="OPEN">🟢 OPEN</option><option value="FULL">🔴 FULL</option></select>
        <input id="g_link" type="text" placeholder="Payment Link">

        <h2>💎 Diamond Pot (500)</h2>
        <select id="d_status"><option value="OPEN">🟢 OPEN</option><option value="FULL">🔴 FULL</option></select>
        <input id="d_link" type="text" placeholder="Payment Link">

        <button onclick="save()" id="btn" class="btn">💾 UPDATE WEBSITE</button>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

        const firebaseConfig = {
            apiKey: "AIzaSyCBeLkcCws6IRTIUztKMDCQztK8-os1pZM",
            authDomain: "ludo-7753c.firebaseapp.com",
            projectId: "ludo-7753c",
            storageBucket: "ludo-7753c.firebasestorage.app",
            messagingSenderId: "780949213750",
            appId: "1:780949213750:web:c54afff4efd44948163e97",
            measurementId: "G-SCSFRTD857"
        };

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);

        onValue(ref(db, 'settings'), (snap) => {
            const d = snap.val();
            if(d) {
                document.getElementById('maint').value = d.maintenance;
                document.getElementById('notice').value = d.notice;
                document.getElementById('wa').value = d.whatsapp;
                document.getElementById('s_status').value = d.silver.status;
                document.getElementById('s_link').value = d.silver.link;
                document.getElementById('g_status').value = d.gold.status;
                document.getElementById('g_link').value = d.gold.link;
                document.getElementById('d_status').value = d.diamond.status;
                document.getElementById('d_link').value = d.diamond.link;
            }
        });

        window.save = () => {
            document.getElementById('btn').innerText = "Saving...";
            set(ref(db, 'settings'), {
                maintenance: document.getElementById('maint').value,
                notice: document.getElementById('notice').value,
                whatsapp: document.getElementById('wa').value,
                silver: { status: document.getElementById('s_status').value, link: document.getElementById('s_link').value },
                gold: { status: document.getElementById('g_status').value, link: document.getElementById('g_link').value },
                diamond: { status: document.getElementById('d_status').value, link: document.getElementById('d_link').value }
            }).then(() => {
                document.getElementById('btn').innerText = "✅ UPDATED!";
                setTimeout(()=>document.getElementById('btn').innerText="💾 UPDATE WEBSITE", 2000);
            });
        };
    </script>
</body>
</html>
