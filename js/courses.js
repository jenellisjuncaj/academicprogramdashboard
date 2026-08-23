/* ==========================================
   IYA Course Analytics
   Search, Filter, Sort
========================================== */

let allCourses = [];
let currentSort = { key: "total_sch", dir: "desc" };

const searchInput = document.getElementById("searchInput");
const domainSelect = document.getElementById("domainSelect");
const instructorSelect = document.getElementById("instructorSelect");
const sortSelect = document.getElementById("sortSelect");
const coursesBody = document.getElementById("coursesBody");
const resultsCount = document.getElementById("resultsCount");
const noResults = document.getElementById("noResults");

function fmtNum(v) {
    if (v === null || v === undefined || v === "") return "—";
    if (typeof v !== "number") return v;
    return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function fmtGrowth(v) {
    if (v === null || v === undefined || v === "") return "—";
    const pct = (v * 100).toFixed(1) + "%";
    if (v > 0) return `<span class="growth-up">+${pct}</span>`;
    if (v < 0) return `<span class="growth-down">${pct}</span>`;
    return `<span class="growth-flat">${pct}</span>`;
}

function populateInstructors(courses) {
    const names = new Set();
    courses.forEach(c => {
        if (!c.instructor) return;
        c.instructor.split(/[;,]/).forEach(part => {
            const n = part.trim();
            if (n) names.add(n);
        });
    });
    const sorted = Array.from(names).sort();
    sorted.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        instructorSelect.appendChild(opt);
    });
}

function applyFiltersAndSort() {
    const query = searchInput.value.trim().toLowerCase();
    const instructor = instructorSelect.value;
    const domain = domainSelect.value;

    let filtered = allCourses.filter(c => {
        const matchesSearch =
            !query ||
            (c.course && c.course.toLowerCase().includes(query)) ||
            (c.title && c.title.toLowerCase().includes(query));

        const matchesInstructor =
            !instructor ||
            (c.instructor && c.instructor.toLowerCase().includes(instructor.toLowerCase()));

        const matchesDomain =
            !domain ||
            (domain === "unassigned" ? !c.domain : c.domain === domain);

        return matchesSearch && matchesInstructor && matchesDomain;
    });

    filtered.sort((a, b) => {
        let av = a[currentSort.key];
        let bv = b[currentSort.key];

        if (av === null || av === undefined) av = currentSort.dir === "asc" ? Infinity : -Infinity;
        if (bv === null || bv === undefined) bv = currentSort.dir === "asc" ? Infinity : -Infinity;

        if (typeof av === "string" || typeof bv === "string") {
            av = String(av).toLowerCase();
            bv = String(bv).toLowerCase();
            if (av < bv) return currentSort.dir === "asc" ? -1 : 1;
            if (av > bv) return currentSort.dir === "asc" ? 1 : -1;
            return 0;
        }

        return currentSort.dir === "asc" ? av - bv : bv - av;
    });

    renderTable(filtered);
}

function renderTable(courses) {
    coursesBody.innerHTML = "";

    if (courses.length === 0) {
        noResults.style.display = "block";
        resultsCount.textContent = "0 courses found";
        return;
    }

    noResults.style.display = "none";
    resultsCount.textContent = `${courses.length} course${courses.length === 1 ? "" : "s"} found`;

    courses.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.course || "—"}</td>
            <td>${c.title || "—"}</td>
            <td>${c.instructor || "—"}</td>
            <td>${c.domain || "—"}</td>
            <td>${fmtNum(c.units)}</td>
            <td>${fmtNum(c.enrollment_20243)}</td>
            <td>${fmtNum(c.enrollment_20253)}</td>
            <td>${fmtNum(c.enrollment_20263)}</td>
            <td>${fmtNum(c.total_sch)}</td>
            <td>${fmtGrowth(c.sch_growth)}</td>
        `;
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => {
            openCourseDrawer(c);
        });

        coursesBody.appendChild(tr);
    });
}

function updateSortArrows() {
    document.querySelectorAll("th.sortable").forEach(th => {
        const arrow = th.querySelector(".sort-arrow");
        if (th.dataset.key === currentSort.key) {
            arrow.classList.add("active");
            arrow.textContent = currentSort.dir === "asc" ? "↑" : "↓";
        } else {
            arrow.classList.remove("active");
            arrow.textContent = "↕";
        }
    });
}

document.querySelectorAll("th.sortable").forEach(th => {
    th.addEventListener("click", () => {
        const key = th.dataset.key;
        if (currentSort.key === key) {
            currentSort.dir = currentSort.dir === "asc" ? "desc" : "asc";
        } else {
            currentSort.key = key;
            currentSort.dir = "desc";
        }
        updateSortArrows();
        applyFiltersAndSort();
    });
});

sortSelect.addEventListener("change", () => {
    const [key, dir] = sortSelect.value.split("-");
    currentSort = { key, dir };
    updateSortArrows();
    applyFiltersAndSort();
});

searchInput.addEventListener("input", applyFiltersAndSort);
instructorSelect.addEventListener("change", applyFiltersAndSort);
domainSelect.addEventListener("change", applyFiltersAndSort);

function openCourseDrawer(course) {
    document.getElementById("drawerCourse").textContent = course.course || "—";
    document.getElementById("drawerTitle").textContent = course.title || "";
    document.getElementById("drawerInstructor").textContent = course.instructor || "—";
    document.getElementById("drawerUnits").textContent = fmtNum(course.units);
    document.getElementById("drawerSCH").textContent = fmtNum(course.total_sch);
    document.getElementById("drawerGrowth").innerHTML = fmtGrowth(course.sch_growth);

    renderCourseChart(course);

    document.getElementById("courseDrawer").classList.add("open");
}

let courseChartInstance = null;

function renderCourseChart(course) {
    const ctx = document.getElementById("courseChart");
    if (!ctx) return;

    if (courseChartInstance) {
        courseChartInstance.destroy();
    }

    courseChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Fall 20243", "Fall 20253", "Fall 20263"],
            datasets: [
                {
                    label: "Enrollment",
                    data: [
                        course.enrollment_20243,
                        course.enrollment_20253,
                        course.enrollment_20263
                    ],
                    borderColor: "#8C1515",
                    backgroundColor: "rgba(140,21,21,.15)",
                    borderWidth: 3,
                    pointRadius: 5,
                    tension: 0.3,
                    fill: false,
                    yAxisID: "y"
                },
                {
                    label: "Student Credit Hours",
                    data: [
                        course.sch_20243,
                        course.sch_20253,
                        course.sch_20263
                    ],
                    borderColor: "#4D7A5A",
                    backgroundColor: "rgba(77,122,90,.15)",
                    borderWidth: 3,
                    pointRadius: 5,
                    tension: 0.3,
                    fill: false,
                    yAxisID: "y1"
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
                    text: "Enrollment & SCH Trend"
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    type: "linear",
                    position: "left",
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Enrollment"
                    }
                },
                y1: {
                    type: "linear",
                    position: "right",
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: "SCH"
                    }
                }
            }
        }
    });
}

document.addEventListener("click", e => {
    if (e.target.id === "closeDrawer") {
        document.getElementById("courseDrawer").classList.remove("open");
    }
});

fetch("data/courses.json")
    .then(res => res.json())
    .then(data => {
        allCourses = data.courses;
        populateInstructors(allCourses);
        updateSortArrows();
        applyFiltersAndSort();
    })
    .catch(err => {
        coursesBody.innerHTML = "";
        noResults.textContent = "Could not load course data.";
        noResults.style.display = "block";
        console.error(err);
    });
