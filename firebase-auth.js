// ==========================================
// 🔐 AUTHENTICATION & FIREBASE LOGIC
// ==========================================

// 1. USE WEB URL IMPORTS (Required for GitHub Pages)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. YOUR SPECIFIC CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyCBeLkcCws6IRTIUztKMDCQztK8-os1pZM",
  authDomain: "ludo-7753c.firebaseapp.com",
  projectId: "ludo-7753c",
  storageBucket: "ludo-7753c.firebasestorage.app",
  messagingSenderId: "780949213750",
  appId: "1:780949213750:web:c54afff4efd44948163e97",
  measurementId: "G-SCSFRTD857"
};

// 3. INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);       // Enable Login System
const db = getDatabase(app);     // Enable Database System

// --- EXPORT TOOLS FOR INDEX.HTML ---
window.techCrushDB = db;
window.techCrushRef = ref;
window.techCrushOnValue = onValue;

// ==========================================
// 🎮 GAME & LOGIN LOGIC BELOW
// ==========================================

// DOM ELEMENTS
const authContainer = document.getElementById('auth-container');
const userDashboard = document.getElementById('user-dashboard');
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');

// 1. TOGGLE FORMS (Login <-> Register)
const linkSignup = document.getElementById('link-to-signup');
const linkLogin = document.getElementById('link-to-login');

if(linkSignup) linkSignup.addEventListener('click', (e) => { e.preventDefault(); loginSection.style.display='none'; signupSection.style.display='block'; });
if(linkLogin) linkLogin.addEventListener('click', (e) => { e.preventDefault(); signupSection.style.display='none'; loginSection.style.display='block'; });

// 2. REGISTER NEW USER
const btnSignup = document.getElementById('btn-signup');
if(btnSignup) {
    btnSignup.addEventListener('click', async () => {
        const e = document.getElementById('signup-email').value;
        const p = document.getElementById('signup-password').value;
        const u = document.getElementById('signup-username').value;
        
        if(!e || !p || !u) return alert("⚠️ Please fill all fields");
        
        btnSignup.innerText = "Creating Account...";
        try {
            // Create user in Firebase
            const cred = await createUserWithEmailAndPassword(auth, e, p);
            // Set their display name
            await updateProfile(cred.user, { displayName: u });
            alert("✅ Account Created! Welcome " + u);
        } catch(err) { 
            let msg = err.message;
            if(msg.includes("email-already-in-use")) msg = "This email is already used.";
            if(msg.includes("weak-password")) msg = "Password must be at least 6 characters.";
            alert("❌ Error: " + msg); 
        } 
        finally { btnSignup.innerText = "REGISTER"; }
    });
}

// 3. LOGIN EXISTING USER
const btnLogin = document.getElementById('btn-login');
if(btnLogin) {
    btnLogin.addEventListener('click', async () => {
        const e = document.getElementById('login-email').value;
        const p = document.getElementById('login-password').value;
        
        if(!e || !p) return alert("⚠️ Please fill all fields");

        btnLogin.innerText = "Logging in...";
        try { 
            await signInWithEmailAndPassword(auth, e, p); 
            // Note: onAuthStateChanged will handle the UI switch automatically
        } 
        catch(err) { 
            alert("❌ Login Failed: Incorrect Email or Password"); 
        } 
        finally { btnLogin.innerText = "LOGIN"; }
    });
}

// 4. PROFILE MENU LOGIC (New Feature)

// Toggle Menu Open/Close
window.toggleMenu = () => {
    const menu = document.getElementById('profile-dropdown');
    if(menu) menu.classList.toggle('active');
};

// Close menu if clicking anywhere else
window.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-btn') && !e.target.closest('.profile-menu')) {
        const menu = document.getElementById('profile-dropdown');
        if(menu) menu.classList.remove('active');
    }
});

// Reset Password Feature
window.resetPassword = () => {
    const user = auth.currentUser;
    if (user && user.email) {
        if(confirm("Send password reset email to " + user.email + "?")) {
            sendPasswordResetEmail(auth, user.email)
                .then(() => alert("✅ Email Sent! Check your inbox."))
                .catch((error) => alert("Error: " + error.message));
        }
    }
};

// Logout Feature
window.logoutUser = () => {
    signOut(auth).then(() => window.location.reload());
};

// 5. AUTH STATE MONITOR (The Brain)
// This runs automatically whenever someone logs in or out
onAuthStateChanged(auth, (user) => {
    if(user) {
        // === USER IS LOGGED IN ===
        if(authContainer) authContainer.style.display = 'none';
        if(userDashboard) userDashboard.style.display = 'block';
        
        // Update Dashboard Text
        const dName = document.getElementById('display-username');
        const mEmail = document.getElementById('menu-email');
        if(dName) dName.innerText = user.displayName || "Gamer";
        if(mEmail) mEmail.innerText = user.email; 
    } else {
        // === USER IS LOGGED OUT ===
        if(authContainer) authContainer.style.display = 'block';
        if(userDashboard) userDashboard.style.display = 'none';
    }
});
