// =============================================
// BRADDYX — MAIN JAVASCRIPT
// =============================================


// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

    console.log("BraddyX loaded successfully 🚀");

});


// ================= SMOOTH SCROLL =================

// Handles links such as:
// #home
// #features
// #modules
// #how-it-works

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        // Ignore buttons/links with only "#"
        if (targetId === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


// ================= BUTTON PLACEHOLDERS =================

// Login, Register and Dashboard functionality
// will be connected when we create the authentication system.


// ================= FUTURE BRADDYX FEATURES =================
//
// Authentication
// Dark / Light Mode
// User Profile
// Dashboard
// Attendance
// DSA
// Core CS
// Skills & Projects
// Placement
// Resume
// Roadmap
// Analytics
// AI Buddy
//
// These will be added in separate JS files
// as the project grows.