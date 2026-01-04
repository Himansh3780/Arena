// --- 1. Imports using CDN URLs (Required for GitHub Pages) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- 2. Your Specific Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCBeLkcCws6IRTIUztKMDCQztK8-os1pZM",
    authDomain: "ludo-7753c.firebaseapp.com",
    projectId: "ludo-7753c",
    storageBucket: "ludo-7753c.firebasestorage.app",
    messagingSenderId: "780949213750",
    appId: "1:780949213750:web:c54afff4efd44948163e97",
    measurementId: "G-SCSFRTD857"
};

// --- 3. Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// --- 4. DOM Elements (Must match your HTML IDs) ---
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const dashboard = document.getElementById('user-dashboard');
const authContainer = document.getElementById('auth-container');

// --- 5. Toggle Login/Signup Views ---
const linkToSignup = document.getElementById('link-to-signup');
const linkToLogin = document.getElementById('link-to-login');

if (linkToSignup) {
    linkToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });
}

if (linkToLogin) {
    linkToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
}

// --- 6. Handle Sign Up ---
const btnSignup = document.getElementById('btn-signup');
if (btnSignup) {
    btnSignup.addEventListener('click', async () => {
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        const username = document.getElementById('signup-username').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // Add username to the profile immediately
            await updateProfile(userCredential.user, { displayName: username });
            alert("Registration Successful! Welcome " + username);
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
}

// --- 7. Handle Login ---
const btnLogin = document.getElementById('btn-login');
if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // The onAuthStateChanged listener will handle the UI switch automatically
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    });
}

// --- 8. Handle Logout ---
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert("Logged out successfully");
        });
    });
}

// --- 9. Dashboard Logic (Update Name/Pass) ---
const btnUpdateName = document.getElementById('btn-update-name');
if (btnUpdateName) {
    btnUpdateName.addEventListener('click', async () => {
        const newName = document.getElementById('new-username').value;
        if(auth.currentUser && newName) {
            try {
                await updateProfile(auth.currentUser, { displayName: newName });
                document.getElementById('display-username').innerText = newName;
                alert("Username updated!");
            } catch (error) {
                alert("Error: " + error.message);
            }
        }
    });
}

// --- 10. Auth State Listener ---
// This runs whenever the user logs in, out, or refreshes the page
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged IN
        if(authContainer) authContainer.style.display = 'none';
        if(dashboard) dashboard.style.display = 'block';
        
        // Fill dashboard data
        const displayUser = document.getElementById('display-username');
        const displayEmail = document.getElementById('display-email');
        
        if(displayUser) displayUser.innerText = user.displayName || "User";
        if(displayEmail) displayEmail.innerText = user.email;

    } else {
        // User is logged OUT
        if(authContainer) authContainer.style.display = 'block';
        if(dashboard) dashboard.style.display = 'none';
        if(loginSection) loginSection.style.display = 'block';
        if(signupSection) signupSection.style.display = 'none';
    }
});
