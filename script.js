// Default login credentials
const validUser = "admin";
const validPass = "1234";
let loginAttempts = 0;
let lockoutTime = 30; // 30 seconds lockout
let captchaA, captchaB, captchaResult; // CAPTCHA values

// Function to generate CAPTCHA
function generateCaptcha() {
    captchaA = Math.floor(Math.random() * 10) + 1;
    captchaB = Math.floor(Math.random() * 10) + 1;
    captchaResult = captchaA + captchaB;
    document.getElementById("captchaText").innerText = `What is ${captchaA} + ${captchaB}?`;
}

// Function to handle login
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const captchaAnswer = parseInt(document.getElementById("captchaAnswer").value);
    const captchaContainer = document.getElementById("captchaContainer");
    const lockMessage = document.getElementById("lockMessage");
    const loginButton = document.getElementById("loginButton");

    if (localStorage.getItem("lockedOut") === "true") {
        alert("Too many failed attempts! Please wait.");
        return;
    }

    // Check if CAPTCHA is required
    if (loginAttempts >= 3) {
        if (captchaContainer.classList.contains("hidden")) {
            captchaContainer.classList.remove("hidden");
            generateCaptcha();
            alert("Too many failed attempts! Solve the CAPTCHA to continue.");
            return;
        }
        if (captchaAnswer !== captchaResult) {
            alert("Incorrect CAPTCHA! Try again.");
            generateCaptcha(); // Refresh CAPTCHA
            return;
        }
    }

    // Validate login
    if (username === validUser && password === validPass) {
        sessionStorage.setItem("loggedIn", "true");
        document.getElementById("loginContainer").classList.add("hidden");
        document.getElementById("cipherContainer").classList.remove("hidden");
    } else {
        loginAttempts++;
        alert(`Invalid credentials! Attempt ${loginAttempts}/3`);

        if (loginAttempts >= 3) {
            captchaContainer.classList.remove("hidden"); // Show CAPTCHA
        }

        if (loginAttempts >= 5) {
            lockMessage.classList.remove("hidden");
            lockMessage.innerText = `Too many attempts! Try again in ${lockoutTime} seconds.`;
            localStorage.setItem("lockedOut", "true");
            loginButton.disabled = true;
            loginButton.classList.add("disabled");

            let countdown = setInterval(() => {
                lockoutTime--;
                lockMessage.innerText = `Too many attempts! Try again in ${lockoutTime} seconds.`;
                if (lockoutTime <= 0) {
                    clearInterval(countdown);
                    localStorage.removeItem("lockedOut");
                    loginAttempts = 0;
                    lockMessage.classList.add("hidden");
                    loginButton.disabled = false;
                    loginButton.classList.remove("disabled");
                    lockoutTime = 30;
                }
            }, 1000);
        }
    }
}

// Function to check login session
window.onload = function () {
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

// Caesar Cipher function
function caesarCipher(text, shift, encrypt = true) {
    return text.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            const base = char.charCodeAt(0) >= 97 ? 97 : 65;
            const offset = encrypt ? shift : -shift;
            return String.fromCharCode(((char.charCodeAt(0) - base + offset + 26) % 26) + base);
        }
        return char;
    }).join('');
}

// Encrypt function
function encrypt() {
    const inputText = document.getElementById('inputText').value;
    const shift = parseInt(document.getElementById('shiftKey').value);

    if (isNaN(shift) || shift < 1 || shift > 25) {
        alert("Please enter a valid shift key (1-25).");
        return;
    }

    const encryptedText = caesarCipher(inputText, shift, true);
    document.getElementById('outputText').value = encryptedText;
}

// Decrypt function
function decrypt() {
    const encryptedText = document.getElementById('inputText').value;
    const shift = parseInt(document.getElementById('shiftKey').value);

    if (isNaN(shift) || shift < 1 || shift > 25) {
        alert("Please enter a valid shift key (1-25).");
        return;
    }

    const decryptedText = caesarCipher(encryptedText, shift, false);
    document.getElementById('outputText').value = decryptedText;
}

// Copy to clipboard function
function copyToClipboard() {
    const outputText = document.getElementById('outputText');
    outputText.select();
    document.execCommand("copy");
    alert("Copied to clipboard!");
}
