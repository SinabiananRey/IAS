// Default login credentials
const validUser = "admin";
const validPass = "1234";
let loginAttempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
const lockoutTime = 30; // 30 seconds lockout

// Function to handle login
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const lockMessage = document.getElementById("lockMessage");
    const loginButton = document.getElementById("loginButton");

    let lockedOutUntil = localStorage.getItem("lockedOutUntil");
    
    if (lockedOutUntil && Date.now() < lockedOutUntil) {
        alert("Too many failed attempts! Please wait.");
        return;
    }

    if (username === validUser && password === validPass) {
        sessionStorage.setItem("loggedIn", "true");
        document.getElementById("loginContainer").classList.add("hidden");
        document.getElementById("cipherContainer").classList.remove("hidden");
        localStorage.removeItem("loginAttempts"); // Reset attempts on success
        localStorage.removeItem("lockedOutUntil");
    } else {
        loginAttempts++;
        localStorage.setItem("loginAttempts", loginAttempts);
        alert(`Invalid credentials! Attempt ${loginAttempts}/3`);

        if (loginAttempts >= 3) {
            lockMessage.classList.remove("hidden");
            lockMessage.innerText = `Too many attempts! Try again in ${lockoutTime} seconds.`;
            
            // Store the lockout expiration timestamp
            let unlockTime = Date.now() + lockoutTime * 1000;
            localStorage.setItem("lockedOutUntil", unlockTime);

            loginButton.disabled = true;
            loginButton.classList.add("disabled");

            let countdown = setInterval(() => {
                let remainingTime = Math.ceil((unlockTime - Date.now()) / 1000);
                if (remainingTime <= 0) {
                    clearInterval(countdown);
                    localStorage.removeItem("lockedOutUntil");
                    localStorage.removeItem("loginAttempts");
                    lockMessage.classList.add("hidden");
                    loginButton.disabled = false;
                    loginButton.classList.remove("disabled");
                    loginAttempts = 0;
                } else {
                    lockMessage.innerText = `Too many attempts! Try again in ${remainingTime} seconds.`;
                }
            }, 1000);
        }
    }
}

// Function to check login session
window.onload = function () {
    let lockedOutUntil = localStorage.getItem("lockedOutUntil");

    if (lockedOutUntil && Date.now() < lockedOutUntil) {
        let remainingTime = Math.ceil((lockedOutUntil - Date.now()) / 1000);
        document.getElementById("lockMessage").classList.remove("hidden");
        document.getElementById("lockMessage").innerText = `Too many attempts! Try again in ${remainingTime} seconds.`;
        document.getElementById("loginButton").disabled = true;
        document.getElementById("loginButton").classList.add("disabled");

        let countdown = setInterval(() => {
            remainingTime = Math.ceil((lockedOutUntil - Date.now()) / 1000);
            if (remainingTime <= 0) {
                clearInterval(countdown);
                localStorage.removeItem("lockedOutUntil");
                localStorage.removeItem("loginAttempts");
                document.getElementById("lockMessage").classList.add("hidden");
                document.getElementById("loginButton").disabled = false;
                document.getElementById("loginButton").classList.remove("disabled");
            } else {
                document.getElementById("lockMessage").innerText = `Too many attempts! Try again in ${remainingTime} seconds.`;
            }
        }, 1000);
    }

    if (sessionStorage.getItem("loggedIn") === "true") {
        document.getElementById("loginContainer").classList.add("hidden");
        document.getElementById("cipherContainer").classList.remove("hidden");
    }
};

// Function to log out
function logout() {
    sessionStorage.removeItem("loggedIn");
    document.getElementById("loginContainer").classList.remove("hidden");
    document.getElementById("cipherContainer").classList.add("hidden");
}

// Function to encrypt using Caesar Cipher
function encrypt() {
    let text = document.getElementById("plaintext").value;
    let shift = parseInt(document.getElementById("shift").value);
    if (!text || isNaN(shift)) {
        alert("Please enter text and shift value!");
        return;
    }

    let result = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char.match(/[a-z]/i)) {
            let code = text.charCodeAt(i);
            let base = code >= 65 && code <= 90 ? 65 : 97;
            char = String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
        }

        result += char;
    }

    document.getElementById("cipherResult").innerText = `Encrypted: ${result}`;
    document.getElementById("copyButton").classList.remove("hidden");
}

// Function to decrypt using Caesar Cipher
function decrypt() {
    let text = document.getElementById("plaintext").value;
    let shift = parseInt(document.getElementById("shift").value);
    if (!text || isNaN(shift)) {
        alert("Please enter text and shift value!");
        return;
    }

    let result = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char.match(/[a-z]/i)) {
            let code = text.charCodeAt(i);
            let base = code >= 65 && code <= 90 ? 65 : 97;
            char = String.fromCharCode(((code - base - shift) % 26 + 26) % 26 + base);
        }

        result += char;
    }

    document.getElementById("cipherResult").innerText = `Decrypted: ${result}`;
    document.getElementById("copyButton").classList.remove("hidden");
}

// Function to copy text to clipboard
function copyToClipboard() {
    navigator.clipboard.writeText(document.getElementById("cipherResult").innerText.split(": ")[1]);
    alert("Copied to clipboard!");
}
