/* =====================================================
   BRADDYX — ATTENDANCE INTELLIGENCE
   ===================================================== */


/* ================= DATA ================= */

let attendanceData = [];

let attendanceTotals = {
    total: 0,
    present: 0,
    absent: 0,
    makeup: 0
};


/* ================= ELEMENTS ================= */

const input = document.getElementById("attendanceInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");

const tableBody = document.getElementById("attendanceTableBody");

const overallPercentage = document.getElementById("overallPercentage");
const circlePercentage = document.getElementById("circlePercentage");
const overallProgress = document.getElementById("overallProgress");

const totalClasses = document.getElementById("totalClasses");
const totalPresent = document.getElementById("totalPresent");
const totalAbsent = document.getElementById("totalAbsent");

const overallMessage = document.getElementById("overallMessage");
const errorMessage = document.getElementById("errorMessage");

const attendInput = document.getElementById("attendClasses");
const leaveInput = document.getElementById("leaveClasses");
const makeupInput = document.getElementById("makeupClasses");

const calculatePlanBtn =
    document.getElementById("calculatePlanBtn");

const projectedPercentage =
    document.getElementById("projectedPercentage");

const projectedProgress =
    document.getElementById("projectedProgress");

const afterAttend =
    document.getElementById("afterAttend");

const afterLeave =
    document.getElementById("afterLeave");

const afterMakeup =
    document.getElementById("afterMakeup");

const planningAnalysis =
    document.getElementById("planningAnalysis");

const planningResult =
    document.getElementById("planningResult");


/* ================= PARSE ERP ================= */

function parseAttendance(text) {

    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);


    const subjects = [];


    for (const line of lines) {

        /*
            Expected ending:

            Present OD Makeup Absent Percentage

            Example:

            1 CSUL501 Design and Analysis...
            Lecture 15 2 0 5 77.27
        */

        const match = line.match(
            /^(?:\d+\s+)?(\S+)\s+(.+?)\s+(Lecture|Lab)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+(?:\.\d+)?)$/
        );


        if (!match) {
            continue;
        }


        const code = match[1];

        const subject = match[2];

        const type = match[3];

        const present = Number(match[4]);

        const od = Number(match[5]);

        const makeup = Number(match[6]);

        const absent = Number(match[7]);

        const percentage = Number(match[8]);


        subjects.push({
            code,
            subject,
            type,
            present,
            od,
            makeup,
            absent,
            percentage
        });
    }


    return subjects;
}


/* ================= CALCULATE TOTALS ================= */

function calculateTotals(data) {

    let total = 0;

    let present = 0;

    let absent = 0;

    let makeup = 0;


    data.forEach(item => {

        /*
            IMPORTANT:

            Makeup is included in Present,
            but Makeup is NOT included in Total.

            Therefore:

            Total = Present + OD + Absent

            Effective Present = Present + Makeup
        */

        total += item.present + item.od + item.absent;

        present += item.present + item.makeup;

        absent += item.absent;

        makeup += item.makeup;
    });


    return {
        total,
        present,
        absent,
        makeup
    };
}


/* ================= OVERALL PERCENTAGE ================= */

function calculatePercentage(present, total) {

    if (total === 0) {
        return 0;
    }

    return (present / total) * 100;
}


/* ================= ANALYZE ================= */

function analyzeAttendance() {

    errorMessage.textContent = "";

    const text = input.value.trim();


    if (!text) {

        errorMessage.textContent =
            "Please paste your ERP attendance report first.";

        return;
    }


    const data = parseAttendance(text);


    if (data.length === 0) {

        errorMessage.textContent =
            "Couldn't detect attendance data. Please paste the complete ERP report.";

        return;
    }


    attendanceData = data;

    attendanceTotals = calculateTotals(data);


    updateOverview();

    updateTable();

    calculatePlan();


    planningResult.style.display = "block";
}


/* ================= UPDATE OVERVIEW ================= */

function updateOverview() {

    const total = attendanceTotals.total;

    const present = attendanceTotals.present;

    const absent = attendanceTotals.absent;


    const percentage =
        calculatePercentage(present, total);


    const rounded =
        percentage.toFixed(2);


    overallPercentage.textContent =
        `${rounded}%`;

    circlePercentage.textContent =
        `${Math.round(percentage)}%`;


    totalClasses.textContent =
        total;

    totalPresent.textContent =
        present;

    totalAbsent.textContent =
        absent;


    overallProgress.style.width =
        `${Math.min(percentage, 100)}%`;


    if (percentage >= 75) {

        overallMessage.textContent =
            "Your overall attendance is currently above 75%.";

    } else {

        overallMessage.textContent =
            "Your overall attendance is below 75%. Plan upcoming classes carefully.";
    }
}


/* ================= TABLE ================= */

function updateTable() {

    tableBody.innerHTML = "";


    attendanceData.forEach(item => {

        const row =
            document.createElement("tr");


        let statusClass = "danger";

        let statusText = "Low";


        if (item.percentage >= 75) {

            statusClass = "good";

            statusText = "Good";

        } else if (item.percentage >= 65) {

            statusClass = "warning";

            statusText = "Watch";
        }


        row.innerHTML = `

            <td>
                ${item.subject}
                <br>
                <small>${item.code}</small>
            </td>

            <td>${item.type}</td>

            <td>${item.present}</td>

            <td>${item.od}</td>

            <td>${item.makeup}</td>

            <td>${item.absent}</td>

            <td>
                <strong>
                    ${item.percentage.toFixed(2)}%
                </strong>
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${statusText}
                </span>
            </td>
        `;


        tableBody.appendChild(row);
    });
}


/* ================= PLAN CALCULATION ================= */

function calculatePlan() {

    if (attendanceData.length === 0) {

        planningAnalysis.textContent =
            "Analyze your attendance first.";

        return;
    }


    const attend =
        Math.max(0, Number(attendInput.value) || 0);

    const leave =
        Math.max(0, Number(leaveInput.value) || 0);

    const makeup =
        Math.max(0, Number(makeupInput.value) || 0);


    const currentTotal =
        attendanceTotals.total;

    const currentPresent =
        attendanceTotals.present;


    /*
        ATTEND:

        New class is added to total
        and present.
    */

    const attendPercentage =
        calculatePercentage(
            currentPresent + attend,
            currentTotal + attend
        );


    /*
        LEAVE:

        New class is added to total
        but not present.
    */

    const leavePercentage =
        calculatePercentage(
            currentPresent,
            currentTotal + leave
        );


    /*
        MAKEUP:

        Makeup counts as present,
        but does NOT increase total.
    */

    const makeupPercentage =
        calculatePercentage(
            currentPresent + makeup,
            currentTotal
        );


    /*
        FINAL COMBINED PLAN:

        Attend → increases total + present

        Leave → increases total only

        Makeup → present only
    */

    const finalPresent =
        currentPresent + attend + makeup;

    const finalTotal =
        currentTotal + attend + leave;


    const finalPercentage =
        calculatePercentage(
            finalPresent,
            finalTotal
        );


    afterAttend.textContent =
        `${attendPercentage.toFixed(2)}%`;

    afterLeave.textContent =
        `${leavePercentage.toFixed(2)}%`;

    afterMakeup.textContent =
        `${makeupPercentage.toFixed(2)}%`;


    projectedPercentage.textContent =
        `${finalPercentage.toFixed(2)}%`;


    projectedProgress.style.width =
        `${Math.min(finalPercentage, 100)}%`;


    if (finalPercentage >= 75) {

        planningAnalysis.textContent =
            `With ${attend} class(es) attended, ${leave} left and ${makeup} makeup class(es), your projected attendance is ${finalPercentage.toFixed(2)}%, which is above 75%.`;

    } else {

        planningAnalysis.textContent =
            `With ${attend} class(es) attended, ${leave} left and ${makeup} makeup class(es), your projected attendance is ${finalPercentage.toFixed(2)}%. You would still be below 75%.`;
    }
}


/* ================= BUTTONS ================= */

analyzeBtn.addEventListener(
    "click",
    analyzeAttendance
);


calculatePlanBtn.addEventListener(
    "click",
    calculatePlan
);


clearBtn.addEventListener(
    "click",
    () => {

        input.value = "";

        attendanceData = [];

        attendanceTotals = {
            total: 0,
            present: 0,
            absent: 0,
            makeup: 0
        };


        overallPercentage.textContent = "—";

        circlePercentage.textContent = "—";

        totalClasses.textContent = "—";

        totalPresent.textContent = "—";

        totalAbsent.textContent = "—";

        overallProgress.style.width = "0%";

        projectedProgress.style.width = "0%";

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-row">
                    Analyze your ERP report to see subjects here.
                </td>
            </tr>
        `;

        overallMessage.textContent =
            "Paste your ERP attendance report below to analyze it.";

        errorMessage.textContent = "";

        projectedPercentage.textContent = "—";

        afterAttend.textContent = "—";

        afterLeave.textContent = "—";

        afterMakeup.textContent = "—";

        planningAnalysis.textContent =
            "Analyze your attendance first.";
    }
);


/* ================= DARK MODE ================= */

const themeToggle =
    document.getElementById("themeToggle");


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );
    }
);