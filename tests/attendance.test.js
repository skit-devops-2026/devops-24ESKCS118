function calculatePercentage(present, total) {
    if (total === 0) {
        return 0;
    }

    return (present / total) * 100;
}

function calculateTotals(data) {
    let total = 0;
    let present = 0;
    let absent = 0;
    let makeup = 0;

    data.forEach(item => {
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


// TEST 1
const result1 = calculatePercentage(75, 100);

if (result1 !== 76) {
    throw new Error("Attendance percentage calculation failed");
}


// TEST 2
const result2 = calculatePercentage(50, 100);

if (result2 !== 50) {
    throw new Error("50% attendance calculation failed");
}


// TEST 3
const data = [
    {
        present: 10,
        od: 2,
        makeup: 1,
        absent: 3
    }
];

const totals = calculateTotals(data);

if (totals.total !== 15) {
    throw new Error("Total classes calculation failed");
}

if (totals.present !== 11) {
    throw new Error("Present classes calculation failed");
}

if (totals.absent !== 3) {
    throw new Error("Absent classes calculation failed");
}

console.log("All BraddyX attendance tests passed!");