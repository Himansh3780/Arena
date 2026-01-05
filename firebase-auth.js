// --- 1. Import Firebase from CDN (Required for GitHub Pages) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- 2. Your Configuration ---
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
const auth = getAuth(app);

// --- 4. Get HTML Elements ---
const authContainer = document.getElementById('auth-container');
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const userDashboard = document.getElementById('user-dashboard');

// Inputs & Buttons
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const btnLogout = document.getElementById('btn-logout');
const btnUpdateName = document.getElementById('btn-update-name');

// Text Links
const linkToSignup = document.getElementById('link-to-signup');
const linkToLogin = document.getElementById('link-to-login');

// --- 5. Toggle Login / Signup Forms ---
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
if (btnSignup) {
    btnSignup.addEventListener('click', async () => {
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        const username = document.getElementById('signup-username').value;

        if (!email || !pass || !username) {
            alert("Please fill in all fields.");
            return;
        }

        btnSignup.innerText = "Registering...";
        
        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // Update username immediately
            await updateProfile(userCredential.user, { displayName: username });
            
            alert("Registration Successful! Welcome, " + username);
            // UI updates automatically via onAuthStateChanged
        } catch (error) {
            let msg = error.message;
            if(error.code === 'auth/email-already-in-use') msg = "This email is already registered.";
            if(error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
            alert("Error: " + msg);
        } finally {
            btnSignup.innerText = "REGISTER";
        }
    });
}

// --- 7. Handle Login ---
if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        if (!email || !pass) {
            alert("Please enter email and password.");
            return;
        }

        btnLogin.innerText = "Logging in...";

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // UI updates automatically via onAuthStateChanged
        } catch (error) {
            let msg = error.message;
            if(error.code === 'auth/invalid-credential') msg = "Incorrect email or password.";
            alert("Login Failed: " + msg);
        } finally {
            btnLogin.innerText = "LOGIN";
        }
    });
}

// --- 8. Handle Logout ---
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert("Logged out successfully");
            // Reload page to reset everything cleanly
            window.location.reload(); 
        }).catch((error) => {
            console.error(error);
        });
    });
}

// --- 9. Handle Profile Update ---
if (btnUpdateName) {
    btnUpdateName.addEventListener('click', async () => {
        const newName = document.getElementById('new-username').value;
        
        if (auth.currentUser && newName) {
            btnUpdateName.innerText = "...";
            try {
                await updateProfile(auth.currentUser, { displayName: newName });
                document.getElementById('display-username').innerText = newName;
                document.getElementById('new-username').value = ""; // Clear input
                alert("Username updated to " + newName);
            } catch (error) {
                alert("Error updating profile: " + error.message);
            } finally {
                btnUpdateName.innerText = "Save";
            }
        } else {
            alert("Please enter a new name.");
        }
    });
}

// --- 10. MAIN LISTENER: Check if user is logged in ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // === USER IS LOGGED IN ===
        console.log("User Logged In:", user.email);
        
        // Hide Login Box, Show Dashboard
        if(authContainer) authContainer.style.display = 'none';
        if(userDashboard) userDashboard.style.display = 'block';

        // Update Dashboard Text
        const nameDisplay = document.getElementById('display-username');
        const emailDisplay = document.getElementById('display-email');
        
        if(nameDisplay) nameDisplay.innerText = user.displayName || "Player";
        if(emailDisplay) emailDisplay.innerText = user.email;

    } else {
        // === USER IS LOGGED OUT ===
        console.log("User Logged Out");

        // Show Login Box, Hide Dashboard
        if(authContainer) authContainer.style.display = 'block';
        if(userDashboard) userDashboard.style.display = 'none';
        
        // Ensure Login form is shown first
        if(loginSection) loginSection.style.display = 'block';
        if(signupSection) signupSection.style.display = 'none';
    }
});
