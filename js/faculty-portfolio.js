/* ==========================================
   IYA Faculty Portfolio
   Render, Search, Expand
========================================== */

let allFaculty = [];

const facultySearch = document.getElementById("facultySearch");
const facultyList = document.getElementById("facultyList");

function fmtNum(v) {
    if (v === null || v === undefined) return "—";
    return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function renderItem(item, term) {
    let meta = `${fmtNum(item.units)} unit${item.units === 1 ? "" : "s"}`;

    if (item.is_course) {
        const enrollKey = term === "fall" ? "enrollment_fall2026" : "enrollment_spring2027";
        const hasEnroll = item[enrollKey] !== undefined && item[enrollKey] !== null;

        if (hasEnroll && item.enrollment_source === "stated_in_workbook") {
            meta += ` &middot; Enrollment: ${fmtNum(item[enrollKey])} <span style="opacity:.6;">(reported)</span>`;
            if (item.sch_fall2026 !== undefined && item.sch_fall2026 !== null) {
                meta += ` &middot; SCH: ${fmtNum(item.sch_fall2026)}`;
            }
        } else if (hasEnroll && item.enrollment_source === "matched_course_data") {
            meta += ` &middot; Enrollment: ${fmtNum(item[enrollKey])} &middot; SCH: ${fmtNum(item.sch_fall2026)}`;
        } else if (item.enrollment_note) {
            meta += ` &middot; <span style="opacity:.7;">${item.enrollment_note}</span>`;
        } else {
            meta += ` &middot; <span style="opacity:.7;">No matching course data found</span>`;
        }
    }

    const badge = item.is_course ? `<span class="item-badge">COURSE</span>` : "";

    return `
        <div class="item-row">
            <div class="item-desc">${item.description}${badge}</div>
            <div class="item-meta">${meta}</div>
        </div>
    `;
}

function renderFacultyCard(f) {
    const card = document.createElement("div");
    card.className = "card faculty-card";

    card.innerHTML = `
        <div class="faculty-card-header">
            <div>
                <h3>${f.name}</h3>
                <div class="faculty-title-lines">${f.title_lines.join(" &middot; ")}</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <div class="faculty-year-total">${fmtNum(f.year_total_units)} units / year</div>
                <span class="expand-icon">&#9660;</span>
            </div>
        </div>
        <div class="faculty-detail">
            <div class="term-columns">
                <div class="term-block">
                    <h4>Fall 2026</h4>
                    <div class="term-total">${fmtNum(f.fall_2026.semester_total_units)} units this semester</div>
                    ${f.fall_2026.items.map(i => renderItem(i, "fall")).join("")}
                </div>
                <div class="term-block">
                    <h4>Spring 2027</h4>
                    <div class="term-total">${fmtNum(f.spring_2027.semester_total_units)} units this semester</div>
                    ${f.spring_2027.items.map(i => renderItem(i, "spring")).join("")}
                </div>
            </div>
        </div>
    `;

    card.addEventListener("click", () => {
        card.classList.toggle("expanded");
    });

    return card;
}

function renderList(faculty) {
    facultyList.innerHTML = "";
    if (faculty.length === 0) {
        facultyList.innerHTML = `<div class="card" style="text-align:center; color:#666;">No faculty match your search.</div>`;
        return;
    }
    faculty.forEach(f => {
        facultyList.appendChild(renderFacultyCard(f));
    });
}

facultySearch.addEventListener("input", () => {
    const q = facultySearch.value.trim().toLowerCase();
    const filtered = allFaculty.filter(f => f.name.toLowerCase().includes(q));
    renderList(filtered);
});

fetch("data/faculty_portfolio.json")
    .then(res => res.json())
    .then(data => {
        allFaculty = data.faculty.sort((a, b) => a.name.localeCompare(b.name));
        renderList(allFaculty);
    })
    .catch(err => {
        facultyList.innerHTML = `<div class="card">Could not load faculty portfolio data.</div>`;
        console.error(err);
    });
