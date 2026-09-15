document.addEventListener("DOMContentLoaded", () => {

    let attendanceData = [];

    const analyzeBtn = document.getElementById("analyzeBtn");


    // =====================================================
    // ANALYZE ERP REPORT
    // =====================================================

    analyzeBtn.addEventListener("click", analyzeAttendance);


    function analyzeAttendance() {

        const input =
            document.getElementById("erpInput").value.trim();

        const error =
            document.getElementById("inputError");


        if (!input) {
            error.textContent =
                "Please paste your ERP attendance report first.";
            return;
        }


        attendanceData = parseERP(input);


        if (attendanceData.length === 0) {

            error.textContent =
                "I couldn't detect attendance data. Try pasting the complete ERP attendance report.";

            return;
        }


        error.textContent = "";

        displayResults();

    }



    // =====================================================
    // PARSE ERP DATA
    // =====================================================

    function parseERP(text) {

        const lines =
            text
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line.length > 0);


        const data = [];


        lines.forEach(line => {

            // Ignore headings
            if (
                line.toLowerCase().startsWith("attendance report") ||
                line.toLowerCase().includes("subject code")
            ) {
                return;
            }


            // Remove row number
            line =
                line.replace(/^\d+\s+/, "");


            /*
                Expected ERP format:

                CODE
                SUBJECT
                TYPE
                PRESENT
                OD
                MAKEUP
                ABSENT
                PERCENTAGE
            */

            const match =
                line.match(
                    /^(\S+)\s+(.+?)\s+(Lecture|Lab)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+(?:\.\d+)?)$/
                );


            if (!match) {
                return;
            }


            data.push({

                subjectCode: match[1],

                subject: match[2],

                subjectType: match[3],

                present: Number(match[4]),

                od: Number(match[5]),

                makeup: Number(match[6]),

                absent: Number(match[7]),

                percentage: Number(match[8])

            });

        });


        return data;

    }



    // =====================================================
    // CALCULATE TOTALS
    // =====================================================

    function calculateTotals() {

        let present = 0;
        let od = 0;
        let makeup = 0;
        let absent = 0;


        attendanceData.forEach(item => {

            present += item.present;

            od += item.od;

            makeup += item.makeup;

            absent += item.absent;

        });


        /*
         =====================================================
         IMPORTANT ERP LOGIC

         Present = attended
         OD      = attended
         Makeup  = attended

         BUT Makeup does NOT increase total classes.

         Therefore:

         Effective Present =
         Present + OD + Makeup

         Total Classes =
         Present + OD + Absent
         =====================================================
        */


        const effectivePresent =
            present + od + makeup;


        const totalClasses =
            present + od + absent;


        const overallPercentage =
            totalClasses > 0
                ? (effectivePresent / totalClasses) * 100
                : 0;


        return {

            present,

            od,

            makeup,

            absent,

            effectivePresent,

            totalClasses,

            overallPercentage

        };

    }



    // =====================================================
    // DISPLAY ALL RESULTS
    // =====================================================

    function displayResults() {

        const results =
            document.getElementById("results");


        if (results) {
            results.classList.remove("hidden");
        }


        const totals =
            calculateTotals();


        // Overall percentage

        const overallPercent =
            document.getElementById(
                "overallPercent"
            );


        if (overallPercent) {

            overallPercent.textContent =
                totals.overallPercentage.toFixed(2) + "%";

        }


        // Present

        const totalPresent =
            document.getElementById(
                "totalPresent"
            );


        if (totalPresent) {

            totalPresent.textContent =
                totals.effectivePresent;

        }


        // Absent

        const totalAbsent =
            document.getElementById(
                "totalAbsent"
            );


        if (totalAbsent) {

            totalAbsent.textContent =
                totals.absent;

        }


        // Risk subjects

        const riskSubjects =
            attendanceData.filter(
                item => item.percentage < 75
            ).length;


        const riskElement =
            document.getElementById(
                "riskSubjects"
            );


        if (riskElement) {

            riskElement.textContent =
                riskSubjects;

        }


        displayAnalysis();

        displayTable();

        displayRecovery();

        populateSubjects();

    }



    // =====================================================
    // OVERALL ANALYSIS
    // =====================================================

    function displayAnalysis() {

        const totals =
            calculateTotals();


        const overall =
            totals.overallPercentage;


        const risky =
            attendanceData.filter(
                item => item.percentage < 75
            );


        const title =
            document.getElementById(
                "analysisTitle"
            );


        const text =
            document.getElementById(
                "analysisText"
            );


        if (!title || !text) {
            return;
        }


        if (overall >= 85) {

            title.textContent =
                "Your overall attendance is strong.";


            text.textContent =
                `You're currently at ${overall.toFixed(2)}%. You have a comfortable buffer above the 75% requirement.`;

        }

        else if (overall >= 75) {

            title.textContent =
                "You're above the 75% target.";


            text.textContent =
                `Your overall attendance is ${overall.toFixed(2)}%. However, ${risky.length} subject(s) are below 75%, so check the subject-wise breakdown carefully.`;

        }

        else {

            title.textContent =
                "Your attendance needs attention.";


            text.textContent =
                `Your overall attendance is ${overall.toFixed(2)}%. ${risky.length} subject(s) are below the 75% target.`;

        }

    }



    // =====================================================
    // SUBJECT TABLE
    // =====================================================

    function displayTable() {

        const table =
            document.getElementById(
                "attendanceTable"
            );


        if (!table) {
            return;
        }


        table.innerHTML = "";


        attendanceData.forEach(item => {

            let status;
            let statusClass;


            if (item.percentage >= 75) {

                status = "Safe";
                statusClass = "safe";

            }

            else if (item.percentage >= 70) {

                status = "Near Target";
                statusClass = "warning";

            }

            else {

                status = "Low";
                statusClass = "danger";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="subject-name">
                        ${escapeHTML(item.subject)}
                    </div>

                    <small>
                        ${escapeHTML(item.subjectCode)}
                    </small>

                </td>


                <td>
                    ${item.present + item.od + item.makeup}
                </td>


                <td>
                    ${item.absent}
                </td>


                <td>
                    ${item.present + item.od + item.absent}
                </td>


                <td>

                    <div class="attendance-value">
                        ${item.percentage.toFixed(2)}%
                    </div>

                    <div class="mini-bar">

                        <div
                            style="width:${Math.min(item.percentage, 100)}%">
                        </div>

                    </div>

                </td>


                <td>

                    <span class="badge ${statusClass}">
                        ${status}
                    </span>

                </td>

            `;


            table.appendChild(row);

        });

    }



    // =====================================================
    // RECOVERY CALCULATION
    // =====================================================

    function displayRecovery() {

        const container =
            document.getElementById(
                "recoveryContainer"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        attendanceData.forEach(item => {

            if (item.percentage >= 75) {

                const row =
                    document.createElement("div");

                row.className =
                    "recovery-row";


                row.innerHTML = `

                    <div>

                        <div class="recovery-subject">
                            ${escapeHTML(item.subject)}
                        </div>

                        <div class="recovery-info">
                            ${item.percentage.toFixed(2)}% — target achieved.
                        </div>

                    </div>

                    <div class="recovery-number">
                        ✓
                    </div>

                `;


                container.appendChild(row);

                return;

            }


            /*
             * Current attended includes:
             *
             * Present + OD + Makeup
             *
             * BUT makeup is already inside the
             * effective present count and doesn't
             * increase total.
             */


            const effectivePresent =
                item.present +
                item.od +
                item.makeup;


            const total =
                item.present +
                item.od +
                item.absent;


            const needed =
                classesNeededFor75(
                    effectivePresent,
                    total
                );


            const row =
                document.createElement("div");


            row.className =
                "recovery-row";


            row.innerHTML = `

                <div>

                    <div class="recovery-subject">
                        ${escapeHTML(item.subject)}
                    </div>

                    <div class="recovery-info">
                        Current: ${item.percentage.toFixed(2)}%
                    </div>

                </div>


                <div class="recovery-number">

                    ${needed}

                    <small>
                        classes
                    </small>

                </div>

            `;


            container.appendChild(row);

        });

    }



    // =====================================================
    // CLASSES NEEDED TO REACH 75%
    // =====================================================

    function classesNeededFor75(
        present,
        total
    ) {

        if (
            total > 0 &&
            present / total >= 0.75
        ) {

            return 0;

        }


        let required = 0;


        while (
            (present + required) /
            (total + required)
            < 0.75
        ) {

            required++;

        }


        return required;

    }



    // =====================================================
    // POPULATE SUBJECT DROPDOWN
    // =====================================================

    function populateSubjects() {

        const select =
            document.getElementById(
                "subjectSelect"
            );


        if (!select) {
            return;
        }


        select.innerHTML =
            '<option value="">Select a subject</option>';


        attendanceData.forEach(
            (item, index) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    index;


                option.textContent =
                    `${item.subjectCode} — ${item.subject}`;


                select.appendChild(option);

            }
        );

    }



    // =====================================================
    // SUBJECT SELECTION
    // =====================================================

    const subjectSelect =
        document.getElementById(
            "subjectSelect"
        );


    if (subjectSelect) {

        subjectSelect.addEventListener(
            "change",
            () => {

                const current =
                    document.getElementById(
                        "subjectCurrent"
                    );


                if (
                    subjectSelect.value === ""
                ) {

                    if (current) {
                        current.classList.add("hidden");
                    }

                    return;

                }


                const index =
                    Number(
                        subjectSelect.value
                    );


                const item =
                    attendanceData[index];


                if (!item) {
                    return;
                }


                if (current) {
                    current.classList.remove("hidden");
                }


                document.getElementById(
                    "subjectCurrentPercent"
                ).textContent =
                    item.percentage.toFixed(2) + "%";


                document.getElementById(
                    "subjectPresent"
                ).textContent =
                    item.present +
                    item.od +
                    item.makeup;


                document.getElementById(
                    "subjectAbsent"
                ).textContent =
                    item.absent;

            }
        );

    }



    // =====================================================
    // SUBJECT-WISE PLANNER
    // =====================================================

    const subjectPlanBtn =
        document.getElementById(
            "subjectPlanBtn"
        );


    if (subjectPlanBtn) {

        subjectPlanBtn.addEventListener(
            "click",
            analyzeSubjectPlan
        );

    }


    function analyzeSubjectPlan() {

        const index =
            Number(
                document.getElementById(
                    "subjectSelect"
                ).value
            );


        if (
            !attendanceData[index]
        ) {

            alert(
                "Please select a subject first."
            );

            return;

        }


        const item =
            attendanceData[index];


        const attend =
            getNumber(
                "subjectAttend"
            );


        const leave =
            getNumber(
                "subjectLeave"
            );


        const makeup =
            getNumber(
                "subjectMakeup"
            );


        /*
         * Attend:
         * +1 effective present
         * +1 total
         *
         * Leave:
         * +0 present
         * +1 total
         *
         * Makeup:
         * +1 effective present
         * +0 total
         */


        const currentPresent =
            item.present +
            item.od +
            item.makeup;


        const currentTotal =
            item.present +
            item.od +
            item.absent;


        const projectedPresent =
            currentPresent +
            attend +
            makeup;


        const projectedTotal =
            currentTotal +
            attend +
            leave;


        const percentage =
            projectedTotal > 0
                ? (projectedPresent /
                    projectedTotal) * 100
                : 0;


        showSubjectPlanResult(
            projectedPresent,
            projectedTotal,
            percentage
        );

    }



    // =====================================================
    // SUBJECT PLAN RESULT
    // =====================================================

    function showSubjectPlanResult(
        present,
        total,
        percentage
    ) {

        const result =
            document.getElementById(
                "subjectPlanResult"
            );


        if (result) {
            result.classList.remove("hidden");
        }


        document.getElementById(
            "subjectProjectedPercent"
        ).textContent =
            percentage.toFixed(2) + "%";


        const status =
            document.getElementById(
                "subjectStatus"
            );


        const message =
            document.getElementById(
                "subjectPlanMessage"
            );


        if (percentage >= 75) {

            status.textContent =
                "✓ SAFE";


            status.className =
                "plan-status safe";


            message.textContent =
                `This plan gives you ${percentage.toFixed(2)}% attendance for this subject, keeping you above the 75% target.`;

        }

        else {

            status.textContent =
                "⚠ BELOW 75%";


            status.className =
                "plan-status danger";


            const needed =
                classesNeededFor75(
                    present,
                    total
                );


            message.textContent =
                `This plan brings your attendance to ${percentage.toFixed(2)}%. You need ${needed} additional attended class${needed === 1 ? "" : "es"} to reach 75%.`;

        }

    }



    // =====================================================
    // COMBINED OVERALL PLANNER
    // =====================================================

    const calculatePlanBtn =
        document.getElementById(
            "calculatePlanBtn"
        );


    if (calculatePlanBtn) {

        calculatePlanBtn.addEventListener(
            "click",
            calculateCombinedPlan
        );

    }



    function calculateCombinedPlan() {

        const attend =
            getNumber(
                "planAttend"
            );


        const leave =
            getNumber(
                "planLeave"
            );


        const makeup =
            getNumber(
                "planMakeup"
            );


        const totals =
            calculateTotals();


        /*
         * Attend:
         * +1 present
         * +1 total
         *
         * Leave:
         * +1 total
         *
         * Makeup:
         * +1 present
         * +0 total
         */


        const projectedPresent =
            totals.effectivePresent +
            attend +
            makeup;


        const projectedAbsent =
            totals.absent +
            leave;


        const projectedTotal =
            totals.totalClasses +
            attend +
            leave;


        const projectedPercentage =
            projectedTotal > 0
                ? (projectedPresent /
                    projectedTotal) * 100
                : 0;


        displayPlanResult({

            projectedPresent,

            projectedAbsent,

            projectedTotal,

            makeup,

            percentage:
                projectedPercentage

        });

    }



    // =====================================================
    // OVERALL PLAN RESULT
    // =====================================================

    function displayPlanResult(result) {

        const container =
            document.getElementById(
                "planResult"
            );


        if (container) {
            container.classList.remove("hidden");
        }


        document.getElementById(
            "projectedPercent"
        ).textContent =
            result.percentage.toFixed(2) + "%";


        document.getElementById(
            "projectedPresent"
        ).textContent =
            result.projectedPresent;


        document.getElementById(
            "projectedAbsent"
        ).textContent =
            result.projectedAbsent;


        document.getElementById(
            "projectedTotal"
        ).textContent =
            result.projectedTotal;


        document.getElementById(
            "projectedMakeup"
        ).textContent =
            result.makeup;


        const status =
            document.getElementById(
                "planStatus"
            );


        const message =
            document.getElementById(
                "planMessage"
            );


        const recommendation =
            document.getElementById(
                "bestPlanText"
            );


        if (result.percentage >= 75) {

            status.textContent =
                "✓ SAFE — ABOVE 75%";


            status.className =
                "plan-status safe";


            message.textContent =
                `Your planned schedule gives you ${result.percentage.toFixed(2)}% attendance.`;


            recommendation.textContent =
                "This plan keeps you above the 75% target. You can use the planner to adjust your attendance, leave and makeup numbers before making your decision.";

        }

        else {

            status.textContent =
                "⚠ BELOW 75%";


            status.className =
                "plan-status danger";


            const needed =
                classesNeededFor75(
                    result.projectedPresent,
                    result.projectedTotal
                );


            message.textContent =
                `Your plan would bring attendance down to ${result.percentage.toFixed(2)}%.`;


            recommendation.textContent =
                `You would need ${needed} additional attended class${needed === 1 ? "" : "es"} after this plan to reach 75%.`;

        }

    }



    // =====================================================
    // GET NUMBER SAFELY
    // =====================================================

    function getNumber(id) {

        const element =
            document.getElementById(id);


        if (!element) {
            return 0;
        }


        const value =
            Number(element.value);


        if (
            !Number.isFinite(value) ||
            value < 0
        ) {

            return 0;

        }


        return Math.floor(value);

    }



    // =====================================================
    // DARK / LIGHT MODE
    // =====================================================

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );


                themeToggle.textContent =
                    document.body.classList.contains(
                        "dark-mode"
                    )
                        ? "☾"
                        : "☀";

            }
        );

    }



    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }

});