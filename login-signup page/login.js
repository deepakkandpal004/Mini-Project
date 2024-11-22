// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");
const loginSection = document.querySelector(".form.login");
const signupSection = document.querySelector(".form.signup");
const imageSection = document.querySelector(".image-section");
const loading = document.querySelector(".loading");

// Toggle between login and signup forms
signupLink.addEventListener("click", () => {
    loginSection.style.display = "none";
    signupSection.style.display = "block";
    imageSection.querySelector("h2").textContent = "Hello, Friend!";
    imageSection.querySelector("p").textContent = "Register with your personal details to use all of site features";
});

loginLink.addEventListener("click", () => {
    signupSection.style.display = "none";
    loginSection.style.display = "block";
    imageSection.querySelector("h2").textContent = "Welcome Back!";
    imageSection.querySelector("p").textContent = "Enter your personal details to use all of site features";
});

// Form validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateName(name) {
    return name.length >= 2;
}

function showLoading() {
    loading.style.display = "flex";
}

function hideLoading() {
    loading.style.display = "none";
}

// Login form submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    document.querySelectorAll(".error").forEach(error => error.style.display = "none");
    document.getElementById("loginSuccess").style.display = "none";

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!validateEmail(email)) {
        document.getElementById("loginEmailError").textContent = "Please enter a valid email";
        document.getElementById("loginEmailError").style.display = "block";
        isValid = false;
    }

    if (!validatePassword(password)) {
        document.getElementById("loginPasswordError").textContent = "Password must be at least 8 characters";
        document.getElementById("loginPasswordError").style.display = "block";
        isValid = false;
    }

    if (isValid) {
        showLoading();
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        hideLoading();
        document.getElementById("loginSuccess").style.display = "block";
        console.log("Login successful", { email, password });
    }
});

// Signup form submission
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    document.querySelectorAll(".error").forEach(error => error.style.display = "none");
    document.getElementById("signupSuccess").style.display = "none";

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;

    if (!validateName(name)) {
        document.getElementById("signupNameError").textContent = "Name must be at least 2 characters";
        document.getElementById("signupNameError").style.display = "block";
        isValid = false;
    }

    if (!validateEmail(email)) {
        document.getElementById("signupEmailError").textContent = "Please enter a valid email";
        document.getElementById("signupEmailError").style.display = "block";
        isValid = false;
    }

    if (!validatePassword(password)) {
        document.getElementById("signupPasswordError").textContent = "Password must be at least 8 characters";
        document.getElementById("signupPasswordError").style.display = "block";
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById("signupConfirmPasswordError").textContent = "Passwords do not match";
        document.getElementById("signupConfirmPasswordError").style.display = "block";
        isValid = false;
    }

    if (isValid) {
        showLoading();
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        hideLoading();
        document.getElementById("signupSuccess").style.display = "block";
        console.log("Signup successful", { name, email, password });
    }
});