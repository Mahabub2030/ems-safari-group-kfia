
/* ============================================================
   DATA GENERATION
   ============================================================ */
const saudiFirst = ["Abdullah", "Mohammed", "Ahmed", "Khalid", "Faisal", "Turki", "Saad", "Nasser", "Fahad", "Sultan", "Omar", "Yousef", "Bandar", "Talal", "Majed", "Rakan"];
const saudiLast = ["Al-Qahtani", "Al-Ghamdi", "Al-Otaibi", "Al-Harbi", "Al-Zahrani", "Al-Shehri", "Al-Dosari", "Al-Malki", "Al-Anazi", "Al-Mutairi"];

const expatPools = {
  "India": { flag: "🇮🇳", first: ["Rajesh", "Suresh", "Anil", "Vijay", "Ramesh", "Manoj", "Sanjay", "Deepak", "Arun", "Prakash"], last: ["Kumar", "Patel", "Sharma", "Singh", "Nair", "Reddy", "Gupta", "Menon", "Iyer", "Yadav"] },
  "Pakistan": { flag: "🇵🇰", first: ["Imran", "Tariq", "Asif", "Waqar", "Shahid", "Zulfiqar", "Naveed", "Rashid", "Farhan", "Adeel"], last: ["Khan", "Mahmood", "Ali", "Hussain", "Iqbal", "Chaudhry", "Butt", "Malik", "Sheikh", "Raza"] },
  "Philippines": { flag: "🇵🇭", first: ["Jose", "Ramon", "Mark", "Angelo", "Ricardo", "Ernesto", "Danilo", "Rodel", "Ferdinand", "Noel"], last: ["Santos", "Cruz", "Reyes", "Bautista", "Garcia", "Mendoza", "Torres", "Flores", "Ramos", "Aquino"] },
  "Egypt": { flag: "🇪🇬", first: ["Mahmoud", "Ahmed", "Karim", "Youssef", "Mostafa", "Hassan", "Tarek", "Sherif", "Amr", "Waleed"], last: ["Hassan", "Fathy", "Said", "Ibrahim", "Mansour", "El-Sayed", "Kamal", "Farouk", "Abdelrahman", "Nour"] },
  "Bangladesh": { flag: "🇧🇩", first: ["Rafiq", "Shahid", "Kamal", "Jahangir", "Habibur", "Mizanur", "Rashedul", "Nasir", "Shakil", "Anisur"], last: ["Islam", "Hossain", "Ahmed", "Rahman", "Chowdhury", "Karim", "Uddin", "Alam", "Miah", "Khan"] },
  "Jordan": { flag: "🇯🇴", first: ["Ziad", "Hussein", "Firas", "Ala'a", "Basil", "Nabil", "Rami", "Samer", "Loai", "Anas"], last: ["Nasser", "Khalil", "Odeh", "Haddad", "Qasem", "Freij", "Zoubi", "Hijazi", "Barakat", "Salameh"] },
  "Nepal": { flag: "🇳🇵", first: ["Bikash", "Suman", "Prakash", "Dipesh", "Rajan", "Bijay", "Santosh", "Nabin", "Deepak", "Sagar"], last: ["Thapa", "Shrestha", "Gurung", "Rai", "Tamang", "Karki", "Adhikari", "Basnet", "Magar", "Bista"] },
  "Sudan": { flag: "🇸🇩", first: ["Osman", "Ibrahim", "Mustafa", "Salah", "Adam", "Bakri", "Hisham", "Amin", "Tariq", "Sami"], last: ["Idris", "Suleiman", "Awad", "Hamid", "Ahmed", "Elzein", "Ballal", "Mekki", "Fadl", "Abbas"] }
};
const nationalities = ["Saudi Arabia", ...Object.keys(expatPools)];
const nationalityFlags = { "Saudi Arabia": "🇸🇦", ...Object.fromEntries(Object.entries(expatPools).map(([k, v]) => [k, v.flag])) };

const departments = ["Operations", "Maintenance", "Safety (HSE)", "Electrical", "Mechanical", "Civil", "Administration", "Logistics"];
const crafts = ["Electrician", "Welder", "Pipefitter", "Safety Officer", "Mechanic", "Civil Laborer", "Scaffolder", "Rigger", "Crane Operator", "Foreman", "HR Coordinator", "Supervisor"];
const shifts = ["Day Shift", "Night Shift", "Off Duty", "Standby"];
const dutyStatuses = ["On Duty", "On Leave", "Site Transfer"];
const jobSites = ["Dammam Yard 3", "King Fahad Int. Airport (KFIA)", "Jubail Site A", "Yanbu Refinery", "Ras Tanura Plant", "Riyadh HQ Depot"];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pad(n, len) { return String(n).padStart(len, "0"); }
function fmtDate(d) { return d.toISOString().slice(0, 10); }

function safeCreateIcons() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    try { lucide.createIcons(); } catch (err) { console.warn("Icon render skipped:", err); }
  }
}

function genIqamaNumber() {
  return (rand(["1", "2"])) + Array.from({ length: 9 }, () => randInt(0, 9)).join("");
}

const today = new Date();
let employees = [];
let vacationRequests = [];
let equipmentList = [];

function calculateDocumentStatus(expiryDate) {
  const daysRemaining = Math.ceil((expiryDate - today) / 86400000);
  let status;
  if (daysRemaining < 0) status = "Expired";
  else if (daysRemaining <= 14) status = "Critical";
  else if (daysRemaining <= 30) status = "Expiring Soon";
  else status = "Valid";
  return { daysRemaining, status };
}

function normalizeEmployeeData(data) {
  return data.map(e => {
    const issueDate = new Date(e.issueDate);
    const expiryDate = new Date(e.expiryDate);
    const dacoIssueDate = new Date(e.dacoIssueDate);
    const dacoExpiryDate = new Date(e.dacoExpiryDate);
    const iqama = calculateDocumentStatus(expiryDate);
    const daco = calculateDocumentStatus(dacoExpiryDate);
    return { ...e, issueDate, expiryDate, dacoIssueDate, dacoExpiryDate, daysRemaining: iqama.daysRemaining, status: iqama.status, dacoDaysRemaining: daco.daysRemaining, dacoStatus: daco.status };
  });
}

function buildVacationRequests() {
  const leaveTypes = ["Annual", "Emergency", "Medical"];
  const approvalStatuses = ["Approved", "Pending", "Rejected"];
  vacationRequests = [];
  employees.filter(e => Math.random() < 0.4).slice(0, 26).forEach((e, idx) => {
    const start = new Date(today.getTime() + randInt(-10, 45) * 86400000);
    const end = new Date(start.getTime() + randInt(7, 30) * 86400000);
    vacationRequests.push({ name: e.name, id: e.id, leaveType: rand(leaveTypes), start, end, visaStatus: rand(["Issued", "Pending", "Not Required"]), flight: rand(["SV 1042 - DMM", "SV 2207 - RUH", "EK 815 - DXB", "QR 1102 - DOH", "Not Booked"]), approval: idx < 4 ? "Pending" : rand(approvalStatuses) });
  });
}

const equipmentCatalog = [
  { name: "Safety Helmet", category: "PPE" }, { name: "Full PPE Kit", category: "PPE" }, { name: "Safety Harness", category: "PPE" },
  { name: "Welding Machine", category: "Tools & Machinery" }, { name: "Power Drill", category: "Tools & Machinery" }, { name: "Portable Generator", category: "Tools & Machinery" },
  { name: "Two-Way Radio", category: "Communication" }, { name: "Pickup Truck", category: "Vehicles" }, { name: "Crew Bus", category: "Vehicles" },
  { name: "Mobile Crane", category: "Heavy Equipment" }, { name: "Forklift", category: "Heavy Equipment" }, { name: "Scaffold Tower", category: "Heavy Equipment" },
  { name: "Fire Extinguisher", category: "Safety" }, { name: "Gas Detector", category: "Safety" }
];
const equipmentStatuses = ["In Use", "Available", "Under Maintenance", "Retired"];

function buildEquipmentList() {
  equipmentList = [];
  for (let i = 1; i <= 48; i++) {
    const item = rand(equipmentCatalog); const status = rand(equipmentStatuses);
    const assignedEmp = status === "In Use" ? rand(employees) : null;
    const assignedDate = new Date(today.getTime() - randInt(15, 600) * 86400000);
    const nextInspection = new Date(today.getTime() + randInt(-15, 180) * 86400000);
    equipmentList.push({ id: "EQ-" + pad(3000 + i, 5), name: item.name, category: item.category, status, assignedTo: assignedEmp ? assignedEmp.name : "—", assignedDate, nextInspection });
  }
}

async function loadEmployeeData() {
  const response = await fetch("./employees.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load employees.json (${response.status})`);
  const data = await response.json();
  employees = normalizeEmployeeData(data);
  buildVacationRequests();
  buildEquipmentList();
}

const documentsList = [
  { title: "Safari Commercial Registration (CR)", category: "Legal & Corporate", date: "2025-01-15", size: "2.4 MB", img: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80", desc: "Official corporate commercial registration certificate issued by MOCI Saudi Arabia." },
  { title: "Aramco Vendor Safety Compliance", category: "Compliance", date: "2026-03-10", size: "4.1 MB", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80", desc: "Certified Aramco contractor safety assessment and clearance document." },
  { title: "GOSI Insurance Policy Certificate", category: "Insurance", date: "2026-01-01", size: "1.8 MB", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80", desc: "General Organization for Social Insurance coverage certificate for all company workforce." },
  { title: "Project Tollet Specs & Blueprint", category: "Engineering", date: "2026-06-28", size: "5.5 MB", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80", desc: "Technical specifications and master blueprints for smart rental property management project." },
  { title: "Standard Employment Contract Template", category: "HR & Legal", date: "2026-05-12", size: "850 KB", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80", desc: "Unified Saudi Labor Law compliant employment contract template." },
  { title: "MOL Work Permit Clearances", category: "Government", date: "2026-06-01", size: "3.2 MB", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80", desc: "Ministry of Labor batch work permit approval document." },
  { title: "ISO 9001 Quality Certification", category: "Compliance", date: "2024-11-20", size: "1.9 MB", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", desc: "Quality management systems certification for construction and maintenance services." },
  { title: "Dammam Yard Safety Protocol", category: "Safety (HSE)", date: "2026-02-14", size: "1.1 MB", img: "https://images.unsplash.com/photo-1541888946425-d0fbb18f7663?auto=format&fit=crop&w=600&q=80", desc: "Comprehensive occupational health and safety rulebook for Dammam Yard operations." }
];

/* ============================================================
   STATE & NAVIGATION
   ============================================================ */
let currentSection = "dashboard";
let chartsInitialized = false;
let natChartInstance = null;
let trendChartInstance = null;
let docBarChartInstance = null;

// Iqama State
let iqamaTab = "all";
let iqamaSearchVal = "";
let iqamaPage = 1;
const iqamaPageSize = 10;

// DACO ID State
let dacoTab = "all";
let dacoSearchVal = "";
let dacoPage = 1;
const dacoPageSize = 10;

// Manpower State
let mpSearchVal = "";
let mpDeptVal = "all";
let mpCraftVal = "all";
let mpStatusVal = "all";
let mpViewMode = "table";
let mpPage = 1;
const mpPageSize = 12;

let mpColumns = {
  id: true, name: true, nationality: true, craft: true,
  department: true, iqama: true, expiryDate: true,
  dutyStatus: true, jobSite: true, actions: true
};

// Equipment State
let equipTab = "all";
let equipSearchVal = "";
let equipPage = 1;
const equipPageSize = 10;

// Vacation State
let vacSearchVal = "";
let vacPage = 1;
const vacPageSize = 8;

// Documentation State
let docSearchVal = "";
let docRowsPerPage = "5";
let docCurrentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
  safeCreateIcons();
  setupNavigation();
  setupEventListeners();
  try {
    await loadEmployeeData();
    renderDashboard();
    renderIqamaPage();
    renderDacoPage();
    renderOrgPage();
    renderManpowerPage();
    renderEquipmentPage();
    renderVacationPage();
    renderDocumentationPage();
  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = `<div class="bg-white border border-rose-200 rounded-xl p-6 text-rose-700"><h2 class="font-bold text-lg">Employee data could not be loaded</h2><p class="text-sm mt-1">Please run this project through a local web server so <code>employees.json</code> can be fetched.</p></div>`;
  }
});

function setupNavigation() {
  const buttons = document.querySelectorAll("[data-page]");
  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const page = btn.getAttribute("data-page");
      switchPage(page);
    });
  });

  const collapseBtn = document.getElementById("collapseBtn");
  const sidebar = document.getElementById("sidebar");
  collapseBtn.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-collapsed");
    const isCollapsed = sidebar.classList.contains("sidebar-collapsed");
    collapseBtn.innerHTML = isCollapsed
      ? `<i data-lucide="panel-left-open" class="w-4 h-4 shrink-0"></i><span class="sidebar-label">Expand</span>`
      : `<i data-lucide="panel-left-close" class="w-4 h-4 shrink-0"></i><span class="sidebar-label">Collapse</span>`;
    safeCreateIcons();
  });
}

function switchPage(pageId) {
  currentSection = pageId;
  document.querySelectorAll(".page-panel").forEach(p => p.classList.remove("active"));
  const target = document.getElementById("page-" + pageId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(b => {
    if (b.getAttribute("data-page") === pageId) {
      b.classList.add("bg-purple-600", "text-white");
      b.classList.remove("text-slate-300", "hover:bg-slate-800", "hover:text-white");
    } else {
      b.classList.remove("bg-purple-600", "text-white");
      b.classList.add("text-slate-300", "hover:bg-slate-800", "hover:text-white");
    }
  });

  const titles = {
    dashboard: ["Executive Dashboard", "Safari Contracting Company — Dammam, Saudi Arabia"],
    iqama: ["Iqama & Document Tracker", "Residency validity and statutory document compliance"],
    daco: ["DACO ID Expiry Tracker", "DACO identification validity and expiry compliance"],
    org: ["Organization & Shift Craft", "Company structure, shift rosters, and craft deployment"],
    manpower: ["Total Manpower Directory", "Comprehensive workforce records and advanced filtering"],
    equipment: ["Equipment & Asset Management", "Machinery, PPE, vehicles, and tools tracking"],
    vacation: ["Vacation & Leave Management", "Leave requests, visa statuses, and travel timelines"],
    documentation: ["Documentation Gallery", "Official compliance certificates, manuals, and files"]
  };

  if (titles[pageId]) {
    document.getElementById("pageTitle").textContent = titles[pageId][0];
    document.getElementById("pageSubtitle").textContent = titles[pageId][1];
  }

  if (pageId === "dashboard") {
    setTimeout(renderCharts, 50);
  } else if (pageId === "documentation") {
    setTimeout(renderDocBarChart, 50);
  }
}

/* ============================================================
   RENDER DASHBOARD
   ============================================================ */
function renderDashboard() {
  const total = employees.length;
  const critical = employees.filter(e => e.status === "Critical" || e.status === "Expired").length;
  const onLeave = employees.filter(e => e.dutyStatus === "On Leave").length;
  const activeEq = equipmentList.filter(e => e.status === "In Use").length;

  const kpis = [
    { title: "Total Workforce", val: total, sub: "Active & Deployed", icon: "users", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Critical Iqamas", val: critical, sub: "Expiring &le;14 Days / Expired", icon: "alert-triangle", color: "text-rose-600", bg: "bg-rose-50" },
    { title: "On Leave / Vacation", val: onLeave, sub: "Out of Kingdom / Home", icon: "plane-takeoff", color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Active Equipment", val: activeEq, sub: "Assigned & Operational", icon: "wrench", color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  document.getElementById("kpiCards").innerHTML = kpis.map(k => `
    <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">${k.title}</p>
        <p class="text-2xl font-bold text-slate-900 mt-1 mono-num">${k.val}</p>
        <p class="text-xs text-slate-400 mt-0.5">${k.sub}</p>
      </div>
      <div class="w-12 h-12 rounded-xl ${k.bg} ${k.color} flex items-center justify-center shrink-0">
        <i data-lucide="${k.icon}" class="w-6 h-6"></i>
      </div>
    </div>
  `).join("");

  // Alert Panel
  const urgent = employees.filter(e => e.daysRemaining <= 14).sort((a, b) => a.daysRemaining - b.daysRemaining);
  const alertContainer = document.getElementById("alertPanel");
  if (urgent.length === 0) {
    alertContainer.innerHTML = `<p class="text-sm text-slate-500 col-span-4 py-3">No urgent Iqama renewals requiring immediate action (&le;14 days).</p>`;
  } else {
    alertContainer.innerHTML = urgent.slice(0, 4).map(e => `
      <div class="border border-rose-200 bg-rose-50/50 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">${e.daysRemaining < 0 ? "EXPIRED" : e.daysRemaining + " days left"}</span>
            <span class="text-xs text-slate-500 font-mono">${e.id}</span>
          </div>
          <p class="font-bold text-sm text-slate-900 mt-2">${e.name}</p>
          <p class="text-xs text-slate-600">${e.craft} • ${e.nationality} ${nationalityFlags[e.nationality] || ""}</p>
          <p class="text-xs font-mono text-slate-500 mt-1">Iqama: ${e.iqama}</p>
        </div>
        <div class="mt-4 pt-2 border-t border-rose-100 flex items-center justify-between">
          <span class="text-[11px] text-rose-600 font-medium">Expires: ${fmtDate(e.expiryDate)}</span>
          <button onclick="openIdCard('${e.id}')" class="text-xs font-semibold text-purple-600 hover:underline">View ID Card &rarr;</button>
        </div>
      </div>
    `).join("");
  }
  safeCreateIcons();
}

function renderCharts() {
  if (natChartInstance) natChartInstance.destroy();
  if (trendChartInstance) trendChartInstance.destroy();

  const natCounts = {};
  nationalities.forEach(n => natCounts[n] = 0);
  employees.forEach(e => { if (natCounts[e.nationality] !== undefined) natCounts[e.nationality]++; });

  const topNats = Object.entries(natCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const otherCount = Object.entries(natCounts).slice(5).reduce((acc, curr) => acc + curr[1], 0);
  const labels = [...topNats.map(x => x[0]), "Other Expat"];
  const dataVals = [...topNats.map(x => x[1]), otherCount];

  const natCtx = document.getElementById("nationalityChart").getContext("2d");
  natChartInstance = new Chart(natCtx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: dataVals,
        backgroundColor: ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#94a3b8"],
        borderWidth: 2,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } }
      },
      cutout: "65%"
    }
  });

  const trendCtx = document.getElementById("trendChart").getContext("2d");
  trendChartInstance = new Chart(trendCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        { label: "Departures / Vacations", data: [6, 8, 12, 10, 15, 22, 28, 24, 14, 9, 7, 11], backgroundColor: "#7c3aed", borderRadius: 4 },
        { label: "New Mobilizations", data: [10, 14, 9, 16, 18, 12, 10, 15, 20, 14, 12, 8], backgroundColor: "#3b82f6", borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top", labels: { boxWidth: 12, font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#f1f5f9" }, ticks: { precision: 0 } }
      }
    }
  });
}

/* ============================================================
   RENDER IQAMA TRACKER
   ============================================================ */
function renderIqamaPage() {
  const expired = employees.filter(e => e.status === "Expired").length;
  const critical = employees.filter(e => e.status === "Critical").length;
  const expiringSoon = employees.filter(e => e.status === "Expiring Soon").length;
  const valid = employees.filter(e => e.status === "Valid").length;

  const cards = [
    { label: "All Employees", count: employees.length, filter: "all", color: "border-slate-200 bg-white text-slate-900" },
    { label: "Valid (&gt;30 Days)", count: valid, filter: "Valid", color: "border-emerald-200 bg-emerald-50/50 text-emerald-900" },
    { label: "Expiring Soon (15-30 Days)", count: expiringSoon, filter: "Expiring Soon", color: "border-amber-200 bg-amber-50/50 text-amber-900" },
    { label: "Critical (&le;14 Days)", count: critical, filter: "Critical", color: "border-rose-200 bg-rose-50/50 text-rose-900" },
    { label: "Already Expired", count: expired, filter: "Expired", color: "border-purple-200 bg-purple-50/50 text-purple-900" }
  ];

  document.getElementById("iqamaAlertCards").innerHTML = cards.map(c => `
    <div onclick="setIqamaTab('${c.filter}')" class="border ${c.color} rounded-xl p-4 cursor-pointer transition-all hover:shadow-md">
      <p class="text-xs font-semibold uppercase tracking-wider opacity-75">${c.label}</p>
      <p class="text-2xl font-bold mt-1 mono-num">${c.count}</p>
    </div>
  `).join("");

  const pills = [
    { id: "all", label: "All" },
    { id: "Valid", label: "Valid" },
    { id: "Expiring Soon", label: "Expiring Soon" },
    { id: "Critical", label: "Critical (&le;14 Days)" },
    { id: "Expired", label: "Expired" }
  ];
  document.getElementById("iqamaFilterPills").innerHTML = pills.map(p => `
    <button onclick="setIqamaTab('${p.id}')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${iqamaTab === p.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
      ${p.label}
    </button>
  `).join("");

  let filtered = employees.filter(e => {
    if (iqamaTab !== "all" && e.status !== iqamaTab) return false;
    if (iqamaSearchVal) {
      const q = iqamaSearchVal.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.iqama.includes(q) || e.craft.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / iqamaPageSize) || 1;
  if (iqamaPage > totalPages) iqamaPage = totalPages;
  const start = (iqamaPage - 1) * iqamaPageSize;
  const paginated = filtered.slice(start, start + iqamaPageSize);

  const tbody = document.getElementById("iqamaTableBody");
  if (paginated.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">No matching employee records found.</td></tr>`;
  } else {
    tbody.innerHTML = paginated.map(e => {
      let badge = "";
      if (e.status === "Valid") badge = `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Valid</span>`;
      else if (e.status === "Expiring Soon") badge = `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Expiring Soon</span>`;
      else if (e.status === "Critical") badge = `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Critical (&le;14d)</span>`;
      else badge = `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Expired</span>`;

      return `
        <tr class="hover:bg-slate-50/80 transition-colors">
          <td class="px-4 py-3">
            <div class="font-medium text-slate-900">${e.name}</div>
            <div class="text-xs text-slate-500">${e.id} • ${e.craft}</div>
          </td>
          <td class="px-4 py-3 font-mono text-slate-700">${e.iqama}</td>
          <td class="px-4 py-3 text-slate-600">${fmtDate(e.issueDate)}</td>
          <td class="px-4 py-3 text-slate-600">${fmtDate(e.expiryDate)}</td>
          <td class="px-4 py-3 mono-num font-semibold ${e.daysRemaining < 0 ? 'text-purple-600' : e.daysRemaining <= 14 ? 'text-rose-600' : 'text-slate-800'}">
            ${e.daysRemaining < 0 ? Math.abs(e.daysRemaining) + "d overdue" : e.daysRemaining + " days"}
          </td>
          <td class="px-4 py-3">${badge}</td>
          <td class="px-4 py-3">
            <button onclick="openIdCard('${e.id}')" class="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors">
              ID Card &amp; QR
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  document.getElementById("iqamaPagination").innerHTML = `
    <span>Showing ${filtered.length > 0 ? start + 1 : 0} to ${Math.min(start + iqamaPageSize, filtered.length)} of ${filtered.length} entries</span>
    <div class="flex items-center gap-1">
      <button onclick="changeIqamaPage(${iqamaPage - 1})" ${iqamaPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Prev</button>
      <span class="px-3 py-1 font-medium">${iqamaPage} / ${totalPages}</span>
      <button onclick="changeIqamaPage(${iqamaPage + 1})" ${iqamaPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Next</button>
    </div>
  `;
  safeCreateIcons();
}

function setIqamaTab(tab) {
  iqamaTab = tab;
  iqamaPage = 1;
  renderIqamaPage();
}
function changeIqamaPage(p) {
  iqamaPage = p;
  renderIqamaPage();
}

document.getElementById("iqamaSearch").addEventListener("input", (e) => {
  iqamaSearchVal = e.target.value;
  iqamaPage = 1;
  renderIqamaPage();
});

/* ============================================================
   RENDER DACO ID EXPIRY TRACKER
   ============================================================ */
function renderDacoPage() {
  const expired = employees.filter(e => e.dacoStatus === "Expired").length;
  const critical = employees.filter(e => e.dacoStatus === "Critical").length;
  const expiringSoon = employees.filter(e => e.dacoStatus === "Expiring Soon").length;
  const valid = employees.filter(e => e.dacoStatus === "Valid").length;

  const cards = [
    { label: "All Employees", count: employees.length, filter: "all", color: "border-slate-200 bg-white text-slate-900" },
    { label: "Valid (>30 Days)", count: valid, filter: "Valid", color: "border-emerald-200 bg-emerald-50/50 text-emerald-900" },
    { label: "Expiring Soon (15-30 Days)", count: expiringSoon, filter: "Expiring Soon", color: "border-amber-200 bg-amber-50/50 text-amber-900" },
    { label: "Critical (≤14 Days)", count: critical, filter: "Critical", color: "border-rose-200 bg-rose-50/50 text-rose-900" },
    { label: "Already Expired", count: expired, filter: "Expired", color: "border-purple-200 bg-purple-50/50 text-purple-900" }
  ];
  document.getElementById("dacoAlertCards").innerHTML = cards.map(c => `<div onclick="setDacoTab('${c.filter}')" class="border ${c.color} rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"><p class="text-xs font-semibold uppercase tracking-wider opacity-75">${c.label}</p><p class="text-2xl font-bold mt-1 mono-num">${c.count}</p></div>`).join("");

  const pills = [
    { id: "all", label: "All" }, { id: "Valid", label: "Valid" }, { id: "Expiring Soon", label: "Expiring Soon" }, { id: "Critical", label: "Critical (≤14 Days)" }, { id: "Expired", label: "Expired" }
  ];
  document.getElementById("dacoFilterPills").innerHTML = pills.map(p => `<button onclick="setDacoTab('${p.id}')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dacoTab === p.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">${p.label}</button>`).join("");

  const filtered = employees.filter(e => {
    if (dacoTab !== "all" && e.dacoStatus !== dacoTab) return false;
    if (dacoSearchVal) {
      const q = dacoSearchVal.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.dacoId.toLowerCase().includes(q) || e.craft.toLowerCase().includes(q);
    }
    return true;
  });
  const totalPages = Math.ceil(filtered.length / dacoPageSize) || 1;
  if (dacoPage > totalPages) dacoPage = totalPages;
  const start = (dacoPage - 1) * dacoPageSize;
  const paginated = filtered.slice(start, start + dacoPageSize);
  const tbody = document.getElementById("dacoTableBody");
  tbody.innerHTML = paginated.length ? paginated.map(e => {
    const badge = e.dacoStatus === "Valid" ? `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Valid</span>` : e.dacoStatus === "Expiring Soon" ? `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Expiring Soon</span>` : e.dacoStatus === "Critical" ? `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Critical (≤14d)</span>` : `<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Expired</span>`;
    return `<tr class="hover:bg-slate-50/80 transition-colors"><td class="px-4 py-3"><div class="font-medium text-slate-900">${e.name}</div><div class="text-xs text-slate-500">${e.id} • ${e.craft}</div></td><td class="px-4 py-3 font-mono text-slate-700">${e.dacoId}</td><td class="px-4 py-3 text-slate-600">${fmtDate(e.dacoIssueDate)}</td><td class="px-4 py-3 text-slate-600">${fmtDate(e.dacoExpiryDate)}</td><td class="px-4 py-3 mono-num font-semibold ${e.dacoDaysRemaining < 0 ? 'text-purple-600' : e.dacoDaysRemaining <= 14 ? 'text-rose-600' : 'text-slate-800'}">${e.dacoDaysRemaining < 0 ? Math.abs(e.dacoDaysRemaining) + "d overdue" : e.dacoDaysRemaining + " days"}</td><td class="px-4 py-3">${badge}</td><td class="px-4 py-3"><button onclick="openIdCard('${e.id}')" class="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100">ID Card</button></td></tr>`;
  }).join("") : `<tr><td colspan="7" class="text-center py-8 text-slate-400">No matching DACO records found.</td></tr>`;
  document.getElementById("dacoPagination").innerHTML = `<span>Showing ${filtered.length ? start + 1 : 0} to ${Math.min(start + dacoPageSize, filtered.length)} of ${filtered.length} entries</span><div class="flex items-center gap-1"><button onclick="changeDacoPage(${dacoPage - 1})" ${dacoPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Prev</button><span class="px-3 py-1 font-medium">${dacoPage} / ${totalPages}</span><button onclick="changeDacoPage(${dacoPage + 1})" ${dacoPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Next</button></div>`;
  safeCreateIcons();
}
function setDacoTab(tab) { dacoTab = tab; dacoPage = 1; renderDacoPage(); }
function changeDacoPage(p) { dacoPage = p; renderDacoPage(); }

document.getElementById("dacoSearch").addEventListener("input", e => { dacoSearchVal = e.target.value; dacoPage = 1; renderDacoPage(); });

/* ============================================================
   RENDER ORG & SHIFT CRAFT
   ============================================================ */
function renderOrgPage() {
  const orgChart = document.getElementById("orgChart");
  orgChart.innerHTML = `
    <div class="flex flex-col items-center min-w-[700px] py-2">
      <div class="bg-slate-900 text-white rounded-xl px-5 py-3 text-center shadow-md">
        <p class="text-xs uppercase tracking-wider text-purple-400 font-bold">Chairman &amp; Managing Director</p>
        <p class="text-sm font-bold mt-0.5">Safari Contracting Executive Board</p>
      </div>
      <div class="w-0.5 h-6 bg-slate-300 my-1"></div>
      <div class="bg-purple-700 text-white rounded-xl px-5 py-3 text-center shadow-md">
        <p class="text-xs uppercase tracking-wider text-purple-200 font-bold">General Manager / Operations</p>
        <p class="text-sm font-bold mt-0.5">Dammam Regional HQ</p>
      </div>
      <div class="w-0.5 h-6 bg-slate-300 my-1"></div>
      <div class="grid grid-cols-4 gap-4 w-full px-4">
        <div class="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
          <p class="text-xs font-bold text-slate-700">Operations &amp; Maintenance</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Field Execution</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
          <p class="text-xs font-bold text-slate-700">Safety &amp; HSE Dept</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Compliance &amp; Audits</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
          <p class="text-xs font-bold text-slate-700">Engineering &amp; Technical</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Design &amp; QA/QC</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
          <p class="text-xs font-bold text-slate-700">Admin &amp; HR (M@h@bub)</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Full Stack &amp; Workforce</p>
        </div>
      </div>
    </div>
  `;

  const shiftCounts = { "Day Shift": 0, "Night Shift": 0, "Off Duty": 0, "Standby": 0 };
  employees.forEach(e => { if (shiftCounts[e.shift] !== undefined) shiftCounts[e.shift]++; });

  const shiftColors = {
    "Day Shift": { icon: "sun", color: "text-amber-600", bg: "bg-amber-50" },
    "Night Shift": { icon: "moon", color: "text-indigo-600", bg: "bg-indigo-50" },
    "Off Duty": { icon: "coffee", color: "text-slate-600", bg: "bg-slate-100" },
    "Standby": { icon: "shield-alert", color: "text-purple-600", bg: "bg-purple-50" },
  };

  document.getElementById("shiftCards").innerHTML = Object.entries(shiftCounts).map(([sh, count]) => `
    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold text-slate-500">${sh}</p>
        <p class="text-xl font-bold text-slate-900 mt-1 mono-num">${count} <span class="text-xs font-normal text-slate-400">Personnel</span></p>
      </div>
      <div class="w-10 h-10 rounded-lg ${shiftColors[sh].bg} ${shiftColors[sh].color} flex items-center justify-center">
        <i data-lucide="${shiftColors[sh].icon}" class="w-5 h-5"></i>
      </div>
    </div>
  `).join("");

  const craftCounts = {};
  crafts.forEach(c => craftCounts[c] = 0);
  employees.forEach(e => { if (craftCounts[e.craft] !== undefined) craftCounts[e.craft]++; });

  document.getElementById("craftGrid").innerHTML = Object.entries(craftCounts).map(([cr, count]) => `
    <div class="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <p class="text-xs font-medium text-slate-500 truncate">${cr}</p>
      <p class="text-lg font-bold text-slate-900 mt-1 mono-num">${count}</p>
    </div>
  `).join("");

  document.getElementById("crewTableBody").innerHTML = employees.slice(0, 10).map(e => `
    <tr class="hover:bg-slate-50">
      <td class="px-4 py-3 font-medium text-slate-900">${e.name} <span class="text-xs font-normal text-slate-400">(${e.id})</span></td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-semibold">${e.craft}</span></td>
      <td class="px-4 py-3 text-slate-700">${e.shift}</td>
      <td class="px-4 py-3 text-slate-600 flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i> ${e.jobSite}</td>
    </tr>
  `).join("");
  safeCreateIcons();
}

/* ============================================================
   RENDER TOTAL MANPOWER DIRECTORY
   ============================================================ */
function renderManpowerPage() {
  // Populate dropdowns if empty
  const deptSelect = document.getElementById("mpDeptFilter");
  if (deptSelect.children.length === 0) {
    deptSelect.innerHTML = `<option value="all">All Departments</option>` + departments.map(d => `<option value="${d}">${d}</option>`).join("");
  }
  const craftSelect = document.getElementById("mpCraftFilter");
  if (craftSelect.children.length === 0) {
    craftSelect.innerHTML = `<option value="all">All Crafts</option>` + crafts.map(c => `<option value="${c}">${c}</option>`).join("");
  }

  // Populate column toggle menu
  const colMenu = document.getElementById("colToggleMenu");
  const colLabels = {
    id: "Emp ID", name: "Name", nationality: "Nationality", craft: "Craft",
    department: "Department", iqama: "Iqama No.", expiryDate: "Expiry Date",
    dutyStatus: "Duty Status", jobSite: "Job Site", actions: "Actions"
  };
  colMenu.innerHTML = Object.entries(mpColumns).map(([key, val]) => `
    <label class="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer">
      <input type="checkbox" data-col="${key}" ${val ? 'checked' : ''} onchange="toggleMpCol('${key}')" />
      <span class="text-xs text-slate-700">${colLabels[key]}</span>
    </label>
  `).join("");

  let filtered = employees.filter(e => {
    if (mpDeptVal !== "all" && e.department !== mpDeptVal) return false;
    if (mpCraftVal !== "all" && e.craft !== mpCraftVal) return false;
    if (mpStatusVal !== "all" && e.dutyStatus !== mpStatusVal) return false;
    if (mpSearchVal) {
      const q = mpSearchVal.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.iqama.includes(q) || e.craft.toLowerCase().includes(q) || e.nationality.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / mpPageSize) || 1;
  if (mpPage > totalPages) mpPage = totalPages;
  const start = (mpPage - 1) * mpPageSize;
  const paginated = filtered.slice(start, start + mpPageSize);

  // Render Table Head
  const headRow = document.getElementById("mpTableHead");
  let headHtml = "";
  if (mpColumns.id) headHtml += `<th class="text-left font-semibold px-4 py-3">Emp ID</th>`;
  if (mpColumns.name) headHtml += `<th class="text-left font-semibold px-4 py-3">Full Name</th>`;
  if (mpColumns.nationality) headHtml += `<th class="text-left font-semibold px-4 py-3">Nationality</th>`;
  if (mpColumns.craft) headHtml += `<th class="text-left font-semibold px-4 py-3">Craft</th>`;
  if (mpColumns.department) headHtml += `<th class="text-left font-semibold px-4 py-3">Department</th>`;
  if (mpColumns.iqama) headHtml += `<th class="text-left font-semibold px-4 py-3">Iqama No.</th>`;
  if (mpColumns.expiryDate) headHtml += `<th class="text-left font-semibold px-4 py-3">Expiry Date</th>`;
  if (mpColumns.dutyStatus) headHtml += `<th class="text-left font-semibold px-4 py-3">Duty Status</th>`;
  if (mpColumns.jobSite) headHtml += `<th class="text-left font-semibold px-4 py-3">Job Site</th>`;
  if (mpColumns.actions) headHtml += `<th class="text-left font-semibold px-4 py-3">Actions</th>`;
  headRow.innerHTML = headHtml;

  // Render Table Body
  const tbody = document.getElementById("mpTableBody");
  if (paginated.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center py-8 text-slate-400">No matching manpower records found.</td></tr>`;
  } else {
    tbody.innerHTML = paginated.map(e => {
      let dutyBadge = e.dutyStatus === "On Duty" ? "bg-emerald-100 text-emerald-800" : e.dutyStatus === "On Leave" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800";
      let rowHtml = `<tr class="hover:bg-slate-50/80 transition-colors">`;
      if (mpColumns.id) rowHtml += `<td class="px-4 py-3 font-mono text-xs text-slate-600">${e.id}</td>`;
      if (mpColumns.name) rowHtml += `<td class="px-4 py-3 font-medium text-slate-900">${e.name}</td>`;
      if (mpColumns.nationality) rowHtml += `<td class="px-4 py-3 text-slate-700">${nationalityFlags[e.nationality] || ""} ${e.nationality}</td>`;
      if (mpColumns.craft) rowHtml += `<td class="px-4 py-3 text-slate-700">${e.craft}</td>`;
      if (mpColumns.department) rowHtml += `<td class="px-4 py-3 text-slate-600">${e.department}</td>`;
      if (mpColumns.iqama) rowHtml += `<td class="px-4 py-3 font-mono text-slate-700">${e.iqama}</td>`;
      if (mpColumns.expiryDate) rowHtml += `<td class="px-4 py-3 text-slate-600">${fmtDate(e.expiryDate)}</td>`;
      if (mpColumns.dutyStatus) rowHtml += `<td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${dutyBadge}">${e.dutyStatus}</span></td>`;
      if (mpColumns.jobSite) rowHtml += `<td class="px-4 py-3 text-slate-600 text-xs">${e.jobSite}</td>`;
      if (mpColumns.actions) rowHtml += `<td class="px-4 py-3"><button onclick="openIdCard('${e.id}')" class="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold hover:bg-purple-100">ID Card</button></td>`;
      rowHtml += `</tr>`;
      return rowHtml;
    }).join("");
  }

  // Render Card View
  const cardView = document.getElementById("mpCardView");
  cardView.innerHTML = paginated.map(e => `
    <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
      <div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-slate-400">${e.id}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${e.dutyStatus === 'On Duty' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${e.dutyStatus}</span>
        </div>
        <p class="font-bold text-slate-900 mt-2">${e.name}</p>
        <p class="text-xs text-purple-600 font-medium">${e.craft} • ${e.department}</p>
        <div class="mt-3 space-y-1 text-xs text-slate-600">
          <p><span class="text-slate-400">Nationality:</span> ${nationalityFlags[e.nationality] || ""} ${e.nationality}</p>
          <p><span class="text-slate-400">Iqama:</span> <span class="font-mono">${e.iqama}</span></p>
          <p><span class="text-slate-400">Job Site:</span> ${e.jobSite}</p>
        </div>
      </div>
      <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span class="text-[11px] text-slate-400">Exp: ${fmtDate(e.expiryDate)}</span>
        <button onclick="openIdCard('${e.id}')" class="px-2.5 py-1 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700">ID Card</button>
      </div>
    </div>
  `).join("");

  document.getElementById("mpPagination").innerHTML = `
    <span>Showing ${filtered.length > 0 ? start + 1 : 0} to ${Math.min(start + mpPageSize, filtered.length)} of ${filtered.length} total personnel</span>
    <div class="flex items-center gap-1">
      <button onclick="changeMpPage(${mpPage - 1})" ${mpPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Prev</button>
      <span class="px-3 py-1 font-medium">${mpPage} / ${totalPages}</span>
      <button onclick="changeMpPage(${mpPage + 1})" ${mpPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Next</button>
    </div>
  `;
  safeCreateIcons();
}

function toggleMpCol(key) {
  mpColumns[key] = !mpColumns[key];
  renderManpowerPage();
}

document.getElementById("colToggleBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  const menu = document.getElementById("colToggleMenu");
  menu.classList.toggle("hidden");
});
document.addEventListener("click", () => {
  document.getElementById("colToggleMenu").classList.add("hidden");
});
document.getElementById("colToggleMenu").addEventListener("click", (e) => e.stopPropagation());

document.getElementById("mpViewTableBtn").addEventListener("click", () => {
  mpViewMode = "table";
  document.getElementById("mpTableView").classList.remove("hidden");
  document.getElementById("mpCardView").classList.add("hidden");
  document.getElementById("mpViewTableBtn").className = "flex items-center gap-1.5 text-sm font-medium px-3 py-2 bg-slate-900 text-white";
  document.getElementById("mpViewCardBtn").className = "flex items-center gap-1.5 text-sm font-medium px-3 py-2 bg-slate-50 text-slate-500";
});
document.getElementById("mpViewCardBtn").addEventListener("click", () => {
  mpViewMode = "cards";
  document.getElementById("mpTableView").classList.add("hidden");
  document.getElementById("mpCardView").classList.remove("hidden");
  document.getElementById("mpViewCardBtn").className = "flex items-center gap-1.5 text-sm font-medium px-3 py-2 bg-slate-900 text-white";
  document.getElementById("mpViewTableBtn").className = "flex items-center gap-1.5 text-sm font-medium px-3 py-2 bg-slate-50 text-slate-500";
});

document.getElementById("mpSearch").addEventListener("input", (e) => { mpSearchVal = e.target.value; mpPage = 1; renderManpowerPage(); });
document.getElementById("mpDeptFilter").addEventListener("change", (e) => { mpDeptVal = e.target.value; mpPage = 1; renderManpowerPage(); });
document.getElementById("mpCraftFilter").addEventListener("change", (e) => { mpCraftVal = e.target.value; mpPage = 1; renderManpowerPage(); });
document.getElementById("mpStatusFilter").addEventListener("change", (e) => { mpStatusVal = e.target.value; mpPage = 1; renderManpowerPage(); });

function changeMpPage(p) { mpPage = p; renderManpowerPage(); }

/* ============================================================
   EXPORT EXCEL & PDF
   ============================================================ */
document.getElementById("exportExcelBtn").addEventListener("click", () => {
  let filtered = employees.filter(e => {
    if (mpDeptVal !== "all" && e.department !== mpDeptVal) return false;
    if (mpCraftVal !== "all" && e.craft !== mpCraftVal) return false;
    if (mpStatusVal !== "all" && e.dutyStatus !== mpStatusVal) return false;
    if (mpSearchVal) {
      const q = mpSearchVal.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.iqama.includes(q) || e.craft.toLowerCase().includes(q) || e.nationality.toLowerCase().includes(q);
    }
    return true;
  });

  const exportData = filtered.map(e => ({
    "Emp ID": e.id,
    "Full Name": e.name,
    "Nationality": e.nationality,
    "Craft": e.craft,
    "Department": e.department,
    "Iqama No.": e.iqama,
    "Expiry Date": fmtDate(e.expiryDate),
    "Duty Status": e.dutyStatus,
    "Job Site": e.jobSite
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Manpower");
  XLSX.writeFile(workbook, "Safari_Contracting_Manpower.xlsx");
});

document.getElementById("exportPdfBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "mm", "a4");

  doc.setFontSize(16);
  doc.setTextColor(76, 29, 149);
  doc.text("Safari Contracting Company - Manpower Directory", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${fmtDate(today)} | Dammam, Saudi Arabia`, 14, 27);

  let filtered = employees.filter(e => {
    if (mpDeptVal !== "all" && e.department !== mpDeptVal) return false;
    if (mpCraftVal !== "all" && e.craft !== mpCraftVal) return false;
    if (mpStatusVal !== "all" && e.dutyStatus !== mpStatusVal) return false;
    return true;
  });

  const tableData = filtered.map(e => [e.id, e.name, e.nationality, e.craft, e.department, e.iqama, fmtDate(e.expiryDate), e.dutyStatus]);

  doc.autoTable({
    startY: 32,
    head: [["Emp ID", "Full Name", "Nationality", "Craft", "Department", "Iqama No.", "Expiry", "Duty Status"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [124, 58, 237] },
    styles: { fontSize: 8 }
  });

  doc.save("Safari_Contracting_Manpower.pdf");
});

/* ============================================================
   RENDER EQUIPMENT & ASSETS
   ============================================================ */
function renderEquipmentPage() {
  const inUse = equipmentList.filter(e => e.status === "In Use").length;
  const available = equipmentList.filter(e => e.status === "Available").length;
  const maintenance = equipmentList.filter(e => e.status === "Under Maintenance").length;

  const kpis = [
    { title: "Total Assets", val: equipmentList.length, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Assigned & In Use", val: inUse, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Available in Yard", val: available, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Under Maintenance", val: maintenance, color: "text-amber-600", bg: "bg-amber-50" }
  ];

  document.getElementById("equipKpis").innerHTML = kpis.map(k => `
    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold text-slate-500 uppercase">${k.title}</p>
        <p class="text-2xl font-bold text-slate-900 mt-1 mono-num">${k.val}</p>
      </div>
      <div class="w-10 h-10 rounded-lg ${k.bg} ${k.color} flex items-center justify-center">
        <i data-lucide="wrench" class="w-5 h-5"></i>
      </div>
    </div>
  `).join("");

  const pills = [
    { id: "all", label: "All Assets" },
    { id: "In Use", label: "In Use" },
    { id: "Available", label: "Available" },
    { id: "Under Maintenance", label: "Under Maintenance" },
    { id: "Retired", label: "Retired" }
  ];
  document.getElementById("equipFilterPills").innerHTML = pills.map(p => `
    <button onclick="setEquipTab('${p.id}')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${equipTab === p.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
      ${p.label}
    </button>
  `).join("");

  let filtered = equipmentList.filter(eq => {
    if (equipTab !== "all" && eq.status !== equipTab) return false;
    if (equipSearchVal) {
      const q = equipSearchVal.toLowerCase();
      return eq.name.toLowerCase().includes(q) || eq.id.toLowerCase().includes(q) || eq.assignedTo.toLowerCase().includes(q) || eq.category.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / equipPageSize) || 1;
  if (equipPage > totalPages) equipPage = totalPages;
  const start = (equipPage - 1) * equipPageSize;
  const paginated = filtered.slice(start, start + equipPageSize);

  const tbody = document.getElementById("equipTableBody");
  if (paginated.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">No equipment found.</td></tr>`;
  } else {
    tbody.innerHTML = paginated.map(eq => {
      let badge = eq.status === "In Use" ? "bg-emerald-100 text-emerald-800" : eq.status === "Available" ? "bg-blue-100 text-blue-800" : eq.status === "Under Maintenance" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800";
      return `
        <tr class="hover:bg-slate-50">
          <td class="px-4 py-3 font-mono text-xs text-slate-600">${eq.id}</td>
          <td class="px-4 py-3 font-medium text-slate-900">${eq.name}</td>
          <td class="px-4 py-3 text-slate-600"><span class="px-2 py-0.5 rounded bg-slate-100 text-xs font-semibold">${eq.category}</span></td>
          <td class="px-4 py-3 text-slate-700">${eq.assignedTo}</td>
          <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${badge}">${eq.status}</span></td>
          <td class="px-4 py-3 text-slate-600">${fmtDate(eq.assignedDate)}</td>
          <td class="px-4 py-3 text-slate-600">${fmtDate(eq.nextInspection)}</td>
        </tr>
      `;
    }).join("");
  }

  document.getElementById("equipPagination").innerHTML = `
    <span>Showing ${filtered.length > 0 ? start + 1 : 0} to ${Math.min(start + equipPageSize, filtered.length)} of ${filtered.length} equipment items</span>
    <div class="flex items-center gap-1">
      <button onclick="changeEquipPage(${equipPage - 1})" ${equipPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Prev</button>
      <span class="px-3 py-1 font-medium">${equipPage} / ${totalPages}</span>
      <button onclick="changeEquipPage(${equipPage + 1})" ${equipPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Next</button>
    </div>
  `;
  safeCreateIcons();
}

function setEquipTab(tab) { equipTab = tab; equipPage = 1; renderEquipmentPage(); }
function changeEquipPage(p) { equipPage = p; renderEquipmentPage(); }
document.getElementById("equipSearch").addEventListener("input", (e) => { equipSearchVal = e.target.value; equipPage = 1; renderEquipmentPage(); });

/* ============================================================
   RENDER VACATION & LEAVE
   ============================================================ */
function renderVacationPage() {
  const onLeaveCount = employees.filter(e => e.dutyStatus === "On Leave").length;
  const pendingCount = vacationRequests.filter(v => v.approval === "Pending").length;
  const returningCount = vacationRequests.filter(v => v.end > today && v.end.getTime() - today.getTime() < 14 * 86400000).length;

  document.getElementById("leaveKpis").innerHTML = `
    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
      <div><p class="text-xs font-semibold text-slate-500 uppercase">Personnel on Leave</p><p class="text-2xl font-bold text-slate-900 mt-1 mono-num">${onLeaveCount}</p></div>
      <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><i data-lucide="plane-takeoff" class="w-5 h-5"></i></div>
    </div>
    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
      <div><p class="text-xs font-semibold text-slate-500 uppercase">Pending Approvals</p><p class="text-2xl font-bold text-slate-900 mt-1 mono-num">${pendingCount}</p></div>
      <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><i data-lucide="clock" class="w-5 h-5"></i></div>
    </div>
    <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
      <div><p class="text-xs font-semibold text-slate-500 uppercase">Returning Next 14 Days</p><p class="text-2xl font-bold text-slate-900 mt-1 mono-num">${returningCount}</p></div>
      <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><i data-lucide="plane-landing" class="w-5 h-5"></i></div>
    </div>
  `;

  // Gantt Timeline
  const gantt = document.getElementById("ganttChart");
  gantt.innerHTML = vacationRequests.slice(0, 6).map(v => `
    <div class="flex items-center gap-4 text-xs">
      <div class="w-36 font-medium text-slate-800 truncate">${v.name}</div>
      <div class="flex-1 bg-slate-100 h-6 rounded-md relative overflow-hidden flex items-center px-2">
        <div class="absolute left-0 top-0 bottom-0 bg-purple-500/20 border-l-2 border-purple-600 rounded" style="width: 70%"></div>
        <span class="relative z-10 text-[11px] font-medium text-slate-700">${fmtDate(v.start)} &rarr; ${fmtDate(v.end)} (${v.leaveType})</span>
      </div>
    </div>
  `).join("");

  let filtered = vacationRequests.filter(v => {
    if (vacSearchVal) {
      const q = vacSearchVal.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / vacPageSize) || 1;
  if (vacPage > totalPages) vacPage = totalPages;
  const start = (vacPage - 1) * vacPageSize;
  const paginated = filtered.slice(start, start + vacPageSize);

  const tbody = document.getElementById("vacTableBody");
  if (paginated.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">No vacation requests found.</td></tr>`;
  } else {
    tbody.innerHTML = paginated.map(v => {
      let appBadge = v.approval === "Approved" ? "bg-emerald-100 text-emerald-800" : v.approval === "Pending" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";
      return `
        <tr class="hover:bg-slate-50">
          <td class="px-4 py-3 font-medium text-slate-900">${v.name} <span class="text-xs font-normal text-slate-400">(${v.id})</span></td>
          <td class="px-4 py-3 text-slate-700">${v.leaveType}</td>
          <td class="px-4 py-3 text-slate-600">${fmtDate(v.start)}</td>
          <td class="px-4 py-3 text-slate-600">${fmtDate(v.end)}</td>
          <td class="px-4 py-3 text-slate-700">${v.visaStatus}</td>
          <td class="px-4 py-3 font-mono text-xs text-slate-600">${v.flight}</td>
          <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${appBadge}">${v.approval}</span></td>
        </tr>
      `;
    }).join("");
  }

  document.getElementById("vacPagination").innerHTML = `
    <span>Showing ${filtered.length > 0 ? start + 1 : 0} to ${Math.min(start + vacPageSize, filtered.length)} of ${filtered.length} requests</span>
    <div class="flex items-center gap-1">
      <button onclick="changeVacPage(${vacPage - 1})" ${vacPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Prev</button>
      <span class="px-3 py-1 font-medium">${vacPage} / ${totalPages}</span>
      <button onclick="changeVacPage(${vacPage + 1})" ${vacPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200"' : 'class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"'}>Next</button>
    </div>
  `;
  safeCreateIcons();
}

function changeVacPage(p) { vacPage = p; renderVacationPage(); }
document.getElementById("vacSearch").addEventListener("input", (e) => { vacSearchVal = e.target.value; vacPage = 1; renderVacationPage(); });

/* ============================================================
   RENDER DOCUMENTATION GALLERY (TABLE + LARGER CHART)
   ============================================================ */
function renderDocumentationPage() {
  const searchInput = document.getElementById("docSearch");
  docSearchVal = searchInput.value;

  let filteredDocs = documentsList.filter(doc => {
    if (!docSearchVal) return true;
    const q = docSearchVal.toLowerCase();
    return doc.title.toLowerCase().includes(q) || doc.category.toLowerCase().includes(q);
  });

  const pageSize = docRowsPerPage === "all" ? filteredDocs.length : parseInt(docRowsPerPage, 10);
  const totalPages = pageSize > 0 ? Math.ceil(filteredDocs.length / pageSize) : 1;
  if (docCurrentPage > totalPages) docCurrentPage = Math.max(1, totalPages);

  const startIndex = (docCurrentPage - 1) * (pageSize || 1);
  const currentDocs = pageSize === "all" ? filteredDocs : filteredDocs.slice(startIndex, startIndex + pageSize);

  const tbody = document.getElementById("docTableBody");
  if (currentDocs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">No documents found matching your search.</td></tr>`;
  } else {
    tbody.innerHTML = currentDocs.map((doc, idx) => `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i data-lucide="file-text" class="w-4 h-4"></i>
          </div>
          <span>${doc.title}</span>
        </td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full">
            ${doc.category}
          </span>
        </td>
        <td class="px-4 py-3 text-slate-600">${doc.date}</td>
        <td class="px-4 py-3 text-slate-600">${doc.size}</td>
        <td class="px-4 py-3 text-right">
          <button onclick="openDocModal('${doc.title}', '${doc.img}', '${doc.desc}')" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i> Preview
          </button>
        </td>
      </tr>
    `).join("");
  }

  // Pagination Info & Buttons
  const startNum = filteredDocs.length > 0 ? startIndex + 1 : 0;
  const endNum = docRowsPerPage === "all" ? filteredDocs.length : Math.min(startIndex + pageSize, filteredDocs.length);

  document.getElementById("docPaginationInfo").textContent = `Showing ${startNum} to ${endNum} of ${filteredDocs.length} entries`;

  const btnContainer = document.getElementById("docPaginationButtons");
  btnContainer.innerHTML = `
    <button onclick="changeDocPage(${docCurrentPage - 1})" ${docCurrentPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200 bg-white"' : 'class="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"'}>Prev</button>
    <span class="px-3 py-1 font-medium text-slate-700">${docCurrentPage} / ${totalPages || 1}</span>
    <button onclick="changeDocPage(${docCurrentPage + 1})" ${docCurrentPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed px-3 py-1 rounded border border-slate-200 bg-white"' : 'class="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"'}>Next</button>
  `;

  safeCreateIcons();
}

function changeDocPage(p) {
  docCurrentPage = p;
  renderDocumentationPage();
}

document.getElementById("docSearch").addEventListener("input", () => {
  docCurrentPage = 1;
  renderDocumentationPage();
});

document.getElementById("docRowsPerPage").addEventListener("change", (e) => {
  docRowsPerPage = e.target.value;
  docCurrentPage = 1;
  renderDocumentationPage();
});

function renderDocBarChart() {
  if (docBarChartInstance) docBarChartInstance.destroy();

  const categoryCounts = {};
  documentsList.forEach(d => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  });

  const ctx = document.getElementById("docBarChart").getContext("2d");
  docBarChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(categoryCounts),
      datasets: [{
        label: "Documents Count",
        data: Object.values(categoryCounts),
        backgroundColor: "#7c3aed",
        borderRadius: 6,
        barThickness: 36
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#f1f5f9" }, ticks: { precision: 0 } }
      }
    }
  });
}

/* ============================================================
   MODALS & QR ID CARD
   ============================================================ */
function openIdCard(empId) {
  const e = employees.find(x => x.id === empId);
  if (!e) return;

  const modal = document.getElementById("idCardModal");
  const content = document.getElementById("idCardContent");

  content.innerHTML = `
    <div class="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-6 relative overflow-hidden">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p class="text-[10px] font-bold tracking-widest text-purple-400 uppercase">Safari Contracting Company</p>
          <p class="text-xs text-slate-300">Official Personnel ID Card</p>
        </div>
        <div class="w-8 h-8 rounded bg-purple-600 flex items-center justify-center font-bold text-xs text-white">S</div>
      </div>
      <div class="mt-6 flex items-center gap-4">
        <div class="w-16 h-16 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-xl text-purple-200 shrink-0">
          ${e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <h3 class="font-bold text-base text-white leading-tight">${e.name}</h3>
          <p class="text-xs text-purple-300 mt-0.5">${e.craft}</p>
          <p class="text-[11px] font-mono text-slate-400 mt-1">${e.id}</p>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-3 text-xs bg-white/5 border border-white/10 rounded-xl p-3">
        <div><span class="text-slate-400 block text-[10px]">Nationality</span><span class="font-medium">${nationalityFlags[e.nationality] || ""} ${e.nationality}</span></div>
        <div><span class="text-slate-400 block text-[10px]">Department</span><span class="font-medium">${e.department}</span></div>
        <div><span class="text-slate-400 block text-[10px]">Iqama No.</span><span class="font-mono">${e.iqama}</span></div>
        <div><span class="text-slate-400 block text-[10px]">Job Site</span><span class="font-medium">${e.jobSite}</span></div>
      </div>
      <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <div class="bg-white p-2 rounded-lg">
          <div class="w-12 h-12 bg-slate-900 text-white flex items-center justify-center text-[9px] font-mono text-center leading-none p-1">QR CODE</div>
        </div>
        <div class="text-right">
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${e.status === 'Valid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}">${e.status}</span>
          <p class="text-[10px] text-slate-400 mt-1">Expiry: ${fmtDate(e.expiryDate)}</p>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
  safeCreateIcons();
}

document.getElementById("idCardCloseBtn").addEventListener("click", () => {
  document.getElementById("idCardModal").classList.add("hidden");
});

function openDocModal(title, img, desc) {
  document.getElementById("docModalTitle").textContent = title;
  document.getElementById("docModalImg").src = img;
  document.getElementById("docModalDesc").textContent = desc;
  document.getElementById("docModal").classList.remove("hidden");
}

document.getElementById("docCloseBtn").addEventListener("click", () => {
  document.getElementById("docModal").classList.add("hidden");
});
document.getElementById("docDownloadBtn").addEventListener("click", () => {
  alert("File download initiated successfully.");
  document.getElementById("docModal").classList.add("hidden");
});

function setupEventListeners() {
  window.addEventListener("click", (e) => {
    const idModal = document.getElementById("idCardModal");
    if (e.target === idModal) idModal.classList.add("hidden");
    const docModal = document.getElementById("docModal");
    if (e.target === docModal) docModal.classList.add("hidden");
  });
}
