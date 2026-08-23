/* ==========================================
   IYA Academic Portfolio Dashboard
   Chart.js Configuration
========================================== */

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = "#1F2D20";
Chart.defaults.plugins.legend.labels.boxWidth = 14;
Chart.defaults.plugins.legend.labels.padding = 20;

/* ==========================================
   COLORS
========================================== */

const COLORS = {
    design: "#4D7A5A",
    business: "#B88A2A",
    technology: "#4C6F91",
    cbrl: "#B65E3C",
    uscRed: "#8C1515",
    forest: "#1F2D20"
};

/* ==========================================
   ENROLLMENT + SCH TREND
========================================== */

const enrollmentCtx = document.getElementById("enrollmentChart");

if (enrollmentCtx) {
    new Chart(enrollmentCtx, {
        type: "line",
        data: {
            labels: [
                "Fall 20243",
                "Fall 20253",
                "Fall 20263"
            ],
            datasets: [
                {
                    label: "Enrollment",
                    data: [1055, 1412, 1760],
                    borderColor: COLORS.design,
                    backgroundColor: "rgba(77,122,90,.15)",
                    borderWidth: 4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.35,
                    fill: false
                },
                {
                    label: "Student Credit Hours",
                    data: [3454, 4678, 5858],
                    borderColor: COLORS.uscRed,
                    backgroundColor: "rgba(140,21,21,.15)",
                    borderWidth: 4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.35,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: "Enrollment and Student Credit Hour Growth"
                }
            }
        }
    });
}

/* ==========================================
   DOMAIN SCH
========================================== */

const domainCtx = document.getElementById("domainChart");

if (domainCtx) {
    new Chart(domainCtx, {
        type: "bar",
        data: {
            labels: [
                "Design",
                "Business",
                "Technology",
                "CBRL"
            ],
            datasets: [
                {
                    label: "Three-Year SCH",
                    data: [5780, 3279, 1989, 1614],
                    backgroundColor: [
                        COLORS.design,
                        COLORS.business,
                        COLORS.technology,
                        COLORS.cbrl
                    ],
                    borderRadius: 10
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
                title: {
                    display: true,
                    text: "Student Credit Hours by Academic Domain"
                }
            }
        }
    });
}

/* ==========================================
   FACULTY WORKLOAD
========================================== */

const facultyCtx = document.getElementById("facultyChart");

if (facultyCtx) {
    new Chart(facultyCtx, {
        type: "bar",
        data: {
            labels: [
                "Doug Thomas",
                "Michael Kanazawa",
                "Aaron Siegel",
                "Grant Delgatty",
                "Yihyun Lim"
            ],
            datasets: [
                {
                    label: "Total SCH",
                    data: [1204, 1172, 989.5, 896, 838],
                    backgroundColor: COLORS.uscRed,
                    borderRadius: 10
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Top Faculty by Student Credit Hours"
                }
            }
        }
    });
}

/* ==========================================
   OPTIONAL FUTURE CHARTS
==========================================

Future additions:

1. Classroom Utilization
2. Faculty Domains
3. Enrollment by Program
4. Academic Success Planning
5. Gantt-style Course Rotation
6. Ad Astra Benchmarks

========================================== */
