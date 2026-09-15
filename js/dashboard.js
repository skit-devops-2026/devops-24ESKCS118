document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // USER DATA
    // =====================================================

    const user = {

        name: "Divyanshi",

        attendance: 74.15,

        placement: 0,

        tasksCompleted: 0,

        skillScore: 0

    };


    // =====================================================
    // LOAD USER INFORMATION
    // =====================================================

    document.getElementById(
        "userName"
    ).textContent = user.name;


    document.getElementById(
        "welcomeName"
    ).textContent = user.name;



    // =====================================================
    // ATTENDANCE
    // =====================================================

    document.getElementById(
        "attendanceValue"
    ).textContent =
        user.attendance.toFixed(2) + "%";


    document.getElementById(
        "attendanceBar"
    ).style.width =
        Math.min(user.attendance, 100) + "%";



    // =====================================================
    // PLACEMENT
    // =====================================================

    document.getElementById(
        "placementValue"
    ).textContent =
        user.placement + "%";


    document.getElementById(
        "placementBar"
    ).style.width =
        user.placement + "%";


    document.getElementById(
        "roadmapPercent"
    ).textContent =
        user.placement + "%";



    // =====================================================
    // OTHER STATS
    // =====================================================

    document.getElementById(
        "tasksValue"
    ).textContent =
        user.tasksCompleted;


    document.getElementById(
        "skillValue"
    ).textContent =
        user.skillScore;



    // =====================================================
    // DATE
    // =====================================================

    const today =
        new Date();


    const dateText =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "currentDate"
    ).textContent =
        dateText;



    // =====================================================
    // TASK SYSTEM
    // =====================================================

    const checkboxes =
        document.querySelectorAll(
            ".task-checkbox"
        );


    function updateTasks() {

        let completed = 0;


        checkboxes.forEach(
            checkbox => {

                const item =
                    checkbox.closest(
                        ".task-item"
                    );


                if (checkbox.checked) {

                    completed++;

                    item.classList.add(
                        "completed"
                    );

                }

                else {

                    item.classList.remove(
                        "completed"
                    );

                }

            }
        );


        document.getElementById(
            "taskCount"
        ).textContent =
            `${completed} / ${checkboxes.length}`;


        document.getElementById(
            "tasksValue"
        ).textContent =
            completed;

    }


    checkboxes.forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                updateTasks
            );

        }
    );



    // =====================================================
    // DARK / LIGHT MODE
    // =====================================================

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            const dark =
                document.body.classList.contains(
                    "dark-mode"
                );


            themeToggle.textContent =
                dark ? "☾" : "☀";


            localStorage.setItem(
                "braddyxTheme",
                dark ? "dark" : "light"
            );

        }
    );


    // Restore theme

    const savedTheme =
        localStorage.getItem(
            "braddyxTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent = "☾";

    }



    // =====================================================
    // AI BUDDY
    // =====================================================

    const aiMessages = [

        "Add your goals and progress and I'll help you decide what to focus on next.",

        "Your attendance is important, but your placement preparation needs consistent progress too.",

        "Start small today: one DSA problem, one concept revision and some project work.",

        "Once we connect your real progress, I'll personalize your roadmap automatically."

    ];


    let aiIndex = 0;


    document
        .getElementById("openAiBtn")
        .addEventListener(
            "click",
            () => {

                aiIndex =
                    (aiIndex + 1) %
                    aiMessages.length;


                document.getElementById(
                    "aiMessage"
                ).textContent =
                    aiMessages[aiIndex];

            }
        );


    document
        .getElementById("aiQuick")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("ai")
                    .scrollIntoView({
                        behavior: "smooth"
                    });


                setTimeout(
                    () => {

                        document
                            .getElementById("openAiBtn")
                            .click();

                    },
                    500
                );

            }
        );



    // =====================================================
    // ROADMAP BUTTONS
    // =====================================================

    function roadmapAction() {

        alert(
            "Placement Roadmap module is coming next."
        );

    }


    document
        .getElementById("roadmapBtn")
        .addEventListener(
            "click",
            roadmapAction
        );


    document
        .getElementById("roadmapQuick")
        .addEventListener(
            "click",
            roadmapAction
        );



    // =====================================================
    // LOGOUT
    // =====================================================

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            () => {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (confirmLogout) {

                    // Temporary until backend authentication

                    window.location.href =
                        "login.html";

                }

            }
        );

});