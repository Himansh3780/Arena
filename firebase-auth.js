// ==========================================
// 🔐 AUTHENTICATION & FIREBASE LOGIC
// Handles Login, Profile Menu, and Database Connection
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ---------------------------------------------------------
// ⚠️ PASTE YOUR FIREBASE CONFIG HERE
// ---------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyD...", 
    authDomain: "techcrush...",
    databaseURL: "https://your-database-name.firebaseio.com",
    projectId: "techcrush...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};
// ---------------------------------------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- EXPORT TOOLS FOR INDEX.HTML (ADMIN LISTENER) ---
window.techCrushDB = db;
window.techCrushRef = ref;
window.techCrushOnValue = onValue;

// --- DOM ELEMENTS ---
const authContainer = document.getElementById('auth-container');
const userDashboard = document.getElementById('user-dashboard');
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');

// --- 1. TOGGLE FORMS ---
const linkSignup = document.getElementById('link-to-signup');
const linkLogin = document.getElementById('link-to-login');

if(linkSignup) linkSignup.addEventListener('click', (e) => { e.preventDefault(); loginSection.style.display='none'; signupSection.style.display='block'; });
if(linkLogin) linkLogin.addEventListener('click', (e) => { e.preventDefault(); signupSection.style.display='none'; loginSection.style.display='block'; });

// --- 2. REGISTER ---
const btnSignup = document.getElementById('btn-signup');
if(btnSignup) {
    btnSignup.addEventListener('click', async () => {
        const e = document.getElementById('signup-email').value;
        const p = document.getElementById('signup-password').value;
        const u = document.getElementById('signup-username').value;
        if(!e || !p || !u) return alert("Please fill all fields");
        
        btnSignup.innerText = "Processing...";
        try {
            const cred = await createUserWithEmailAndPassword(auth, e, p);
            await updateProfile(cred.user, { displayName: u });
            alert("Account Created! Welcome " + u);
        } catch(err) { alert(err.message); } 
        finally { btnSignup.innerText = "REGISTER"; }
    });
}

// --- 3. LOGIN ---
const btnLogin = document.getElementById('btn-login');
if(btnLogin) {
    btnLogin.addEventListener('click', async () => {
        const e = document.getElementById('login-email').value;
        const p = document.getElementById('login-password').value;
        if(!e || !p) return alert("Fill all fields");

        btnLogin.innerText = "Logging in...";
        try { await signInWithEmailAndPassword(auth, e, p); } 
        catch(err) { alert("Login Failed: " + err.message); } 
        finally { btnLogin.innerText = "LOGIN"; }
    });
}

// --- 4. PROFILE MENU LOGIC (New Feature) ---

// Toggle Menu
window.toggleMenu = () => {
    const menu = document.getElementById('profile-dropdown');
    menu.classList.toggle('active');
};

// Close menu if clicking outside
window.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-btn') && !e.target.closest('.profile-menu')) {
        const menu = document.getElementById('profile-dropdown');
        if(menu) menu.classList.remove('active');
    }
});

// Reset Password
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

// Logout User
window.logoutUser = () => {
    signOut(auth).then(() => window.location.reload());
};

// --- 5. AUTH STATE MONITOR ---
onAuthStateChanged(auth, (user) => {
    if(user) {
        // LOGGED IN
        if(authContainer) authContainer.style.display = 'none';
        if(userDashboard) userDashboard.style.display = 'block';
        
        // Update Dashboard Text
        const dName = document.getElementById('display-username');
        const mEmail = document.getElementById('menu-email');
        if(dName) dName.innerText = user.displayName || "Gamer";
        if(mEmail) mEmail.innerText = user.email; // Email inside dropdown
    } else {
        // LOGGED OUT
        if(authContainer) authContainer.style.display = 'block';
        if(userDashboard) userDashboard.style.display = 'none';
    }
});
