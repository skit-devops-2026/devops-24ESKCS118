// =============================================
// BRADDYX — AUTHENTICATION JAVASCRIPT
// =============================================


// ================= REGISTER FORM =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms =
            document.getElementById("terms").checked;

        const errorMessage =
            document.getElementById("formError");

        const successMessage =
            document.getElementById("formSuccess");


        // Clear previous messages

        errorMessage.style.display = "none";
        successMessage.style.display = "none";


        // ================= VALIDATION =================

        if (name.length < 2) {

            showError("Please enter your full name.");

            return;
        }


        if (!email.includes("@")) {

            showError("Please enter a valid email address.");

            return;
        }


        if (password.length < 8) {

            showError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            showError(
                "Passwords do not match."
            );

            return;
        }


        if (!terms) {

            showError(
                "Please accept the Terms of Service and Privacy Policy."
            );

            return;
        }


        // ================= SUCCESS =================

        successMessage.textContent =
            "Account details validated successfully!";

        successMessage.style.display = "block";

        console.log("Registration data:", {
            name: name,
            email: email
        });

    });


    // ================= ERROR FUNCTION =================

    function showError(message) {

        const errorMessage =
            document.getElementById("formError");

        errorMessage.textContent = message;

        errorMessage.style.display = "block";

    }

}


// ================= PASSWORD TOGGLE =================

const passwordToggle =
    document.getElementById("passwordToggle");

const passwordInput =
    document.getElementById("password");


if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            passwordToggle.textContent = "Hide";

        } else {

            passwordInput.type = "password";

            passwordToggle.textContent = "Show";

        }

    });

}


// ================= CONFIRM PASSWORD TOGGLE =================

const confirmPasswordToggle =
    document.getElementById("confirmPasswordToggle");

const confirmPasswordInput =
    document.getElementById("confirmPassword");


if (confirmPasswordToggle && confirmPasswordInput) {

    confirmPasswordToggle.addEventListener("click", function () {

        if (confirmPasswordInput.type === "password") {

            confirmPasswordInput.type = "text";

            confirmPasswordToggle.textContent = "Hide";

        } else {

            confirmPasswordInput.type = "password";

            confirmPasswordToggle.textContent = "Show";

        }

    });

}
// =============================================
// BRADDYX — LOGIN
// =============================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const errorMessage =
            document.getElementById("loginError");

        const successMessage =
            document.getElementById("loginSuccess");


        errorMessage.style.display = "none";
        successMessage.style.display = "none";


        // Basic validation

        if (!email || !email.includes("@")) {

            errorMessage.textContent =
                "Please enter a valid email address.";

            errorMessage.style.display = "block";

            return;
        }


        if (!password) {

            errorMessage.textContent =
                "Please enter your password.";

            errorMessage.style.display = "block";

            return;
        }


        // Temporary frontend success

        successMessage.textContent =
            "Login details validated successfully!";

        successMessage.style.display = "block";


        console.log("Login attempt:", {
            email: email
        });

    });

}


// ================= LOGIN PASSWORD TOGGLE =================

const loginPasswordToggle =
    document.getElementById("loginPasswordToggle");

const loginPassword =
    document.getElementById("loginPassword");


if (loginPasswordToggle && loginPassword) {

    loginPasswordToggle.addEventListener("click", function () {

        if (loginPassword.type === "password") {

            loginPassword.type = "text";

            loginPasswordToggle.textContent = "Hide";

        } else {

            loginPassword.type = "password";

            loginPasswordToggle.textContent = "Show";

        }

    });

}