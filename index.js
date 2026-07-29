// Data payload schema
const mockDataset = [
  {
    phoneNumber: "+966 50 123 4567",
    email: "eman.alnasser@safari.com.sa",
    workLocation: "",
    images: [],
    _id: "6a40b233a377d5283b7c44a2",
    name: "Eman AlNasser",
    jobTitle: "Administrator",
    idNumber: "1063800229",
    employeeId: "67712",
    dacoId: "",
    group: "Administrative / Management",
    joiningDate: "2026-04-01T00:00:00.000Z",
    nationality: "Saudi",
    companyName: "Safari Group",
    status: "ACTIVE",
    remark: "",
    updatedAt: "2026-07-03T12:52:52.551Z",
  },
];

let workingDataset = [...mockDataset];
let currentPage = 1;
let limitPerPage = 10;
let isDescending = false;

const tableBody = document.getElementById("tableBody");
const counterLabel = document.getElementById("counterLabel");
const paginationBlock = document.getElementById("paginationBlock");

// Calculate and update ALL 8 top stat KPI badges dynamically
function computeSummaryMetrics() {
  document.getElementById("card-total-count").innerText = mockDataset.length;
  document.getElementById("card-active-count").innerText = mockDataset.filter(
    (e) => e.status === "ACTIVE",
  ).length;
  document.getElementById("card-vacation-count").innerText = mockDataset.filter(
    (e) => e.status === "VACATION",
  ).length;

  // New metrics calculation logic
  document.getElementById("card-admin-count").innerText = mockDataset.filter(
    (e) => e.group === "Administrative / Management",
  ).length;
  document.getElementById("card-operations-count").innerText =
    mockDataset.filter((e) => e.group === "Operations / Engineering").length;
  document.getElementById("card-hr-count").innerText = mockDataset.filter(
    (e) => e.group === "Human Resources",
  ).length;
  document.getElementById("card-saudi-count").innerText = mockDataset.filter(
    (e) => e.nationality.toLowerCase() === "saudi",
  ).length;
  document.getElementById("card-expat-count").innerText = mockDataset.filter(
    (e) => e.nationality.toLowerCase() !== "saudi",
  ).length;
}

function renderWorkspaceTable() {
  tableBody.innerHTML = "";
  const totalRecords = workingDataset.length;

  let start = (currentPage - 1) * limitPerPage;
  let end =
    limitPerPage === "all" ? totalRecords : start + parseInt(limitPerPage);
  const slice = workingDataset.slice(start, end);

  if (slice.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-slate-400 italic">No matching records found.</td></tr>`;
    counterLabel.innerText = "Showing 0 to 0 of 0 entries";
    drawPager(0);
    return;
  }

  slice.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.className =
      "hover:bg-slate-50 transition border-b border-slate-200 text-slate-700";

    let statusStyle = "bg-slate-50 text-slate-700 text-center font-bold";
    if (row.status === "ACTIVE") {
      statusStyle = "bg-green-50 text-green-700 text-center font-bold";
    } else if (row.status === "VACATION") {
      statusStyle = "bg-blue-50 text-blue-700 text-center font-bold";
    } else if (row.status === "SUSPENDED") {
      statusStyle = "bg-amber-50 text-amber-700 text-center font-bold";
    }

    tr.innerHTML = `
                    <td class="p-2.5 border-r border-slate-200 text-center bg-slate-50/50 font-semibold">${start + index + 1}</td>
                    <td class="p-2.5 border-r border-slate-200 text-slate-900 font-bold">#${row.employeeId}</td>
                    <td class="p-2.5 border-r border-slate-200 font-bold text-slate-800">${row.name}</td>
                    <td class="p-2.5 border-r border-slate-200 text-blue-600 font-medium hover:underline cursor-pointer">${row.email || "-"}</td>
                    <td class="p-2.5 border-r border-slate-200 text-slate-500">${row.phoneNumber || "-"}</td>
                    <td class="p-2.5 border-r border-slate-200">${row.jobTitle}</td>
                    <td class="p-2.5 border-r border-slate-200"><span class="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">${row.group}</span></td>
                    <td class="p-2.5 border-r border-slate-200 text-slate-600">${row.companyName}</td>
                    <td class="p-2.5 border-r border-slate-200">${row.nationality}</td>
                    <td class="p-2.5 ${statusStyle}">${row.status}</td>
                `;
    tableBody.appendChild(tr);
  });

  const currentEnd = end > totalRecords ? totalRecords : end;
  counterLabel.innerText = `Showing ${start + 1} to ${currentEnd} of ${totalRecords} entries`;

  const totalPages =
    limitPerPage === "all" ? 1 : Math.ceil(totalRecords / limitPerPage);
  drawPager(totalPages);
}

function drawPager(totalPages) {
  paginationBlock.innerHTML = "";
  if (totalPages <= 1) return;

  const baseStyle =
    "px-2.5 py-1 border text-[11px] font-semibold transition cursor-pointer select-none ";

  const first = document.createElement("button");
  first.className =
    baseStyle +
    "rounded-l border-slate-300 bg-white text-slate-600 hover:bg-slate-100";
  first.innerHTML = `<i class="fa-solid fa-angles-left text-[9px]"></i>`;
  first.onclick = () => {
    currentPage = 1;
    renderWorkspaceTable();
  };
  paginationBlock.appendChild(first);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className =
      baseStyle +
      (i === currentPage
        ? "bg-slate-800 border-slate-800 text-white"
        : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100");
    btn.innerText = i;
    btn.onclick = () => {
      currentPage = i;
      renderWorkspaceTable();
    };
    paginationBlock.appendChild(btn);
  }

  const last = document.createElement("button");
  last.className =
    baseStyle +
    "rounded-r border-slate-300 bg-white text-slate-600 hover:bg-slate-100";
  last.innerHTML = `<i class="fa-solid fa-angles-right text-[9px]"></i>`;
  last.onclick = () => {
    currentPage = totalPages;
    renderWorkspaceTable();
  };
  paginationBlock.appendChild(last);
}

function filterPipeline() {
  const globalQ = document
    .getElementById("globalSearch")
    .value.toLowerCase()
    .trim();
  const countQ = document.getElementById("filter-count").value.trim();
  const empQ = document
    .getElementById("filter-empid")
    .value.toLowerCase()
    .trim();
  const nameQ = document
    .getElementById("filter-name")
    .value.toLowerCase()
    .trim();
  const emailQ = document
    .getElementById("filter-email")
    .value.toLowerCase()
    .trim();
  const phoneQ = document
    .getElementById("filter-phone")
    .value.toLowerCase()
    .trim();
  const jobQ = document.getElementById("filter-job").value.toLowerCase().trim();
  const groupQ = document.getElementById("filter-group").value;
  const compQ = document
    .getElementById("filter-company")
    .value.toLowerCase()
    .trim();
  const natQ = document
    .getElementById("filter-nationality")
    .value.toLowerCase()
    .trim();
  const statusQ = document.getElementById("filter-status").value;

  workingDataset = mockDataset.filter((item, idx) => {
    if (
      globalQ &&
      !Object.values(item).some((v) =>
        String(v).toLowerCase().includes(globalQ),
      )
    )
      return false;
    if (countQ && !String(idx + 1).includes(countQ)) return false;
    if (empQ && !item.employeeId.toLowerCase().includes(empQ)) return false;
    if (nameQ && !item.name.toLowerCase().includes(nameQ)) return false;
    if (emailQ && !item.email.toLowerCase().includes(emailQ)) return false;
    if (phoneQ && !item.phoneNumber.toLowerCase().includes(phoneQ))
      return false;
    if (jobQ && !item.jobTitle.toLowerCase().includes(jobQ)) return false;
    if (groupQ && item.group !== groupQ) return false;
    if (compQ && !item.companyName.toLowerCase().includes(compQ)) return false;
    if (natQ && !item.nationality.toLowerCase().includes(natQ)) return false;
    if (statusQ && item.status !== statusQ) return false;
    return true;
  });

  currentPage = 1;
  renderWorkspaceTable();
}

function clearAllColumnFilters() {
  document.querySelectorAll("thead input").forEach((i) => (i.value = ""));
  document.querySelectorAll("thead select").forEach((s) => (s.value = ""));
  document.getElementById("globalSearch").value = "";
  workingDataset = [...mockDataset];
  currentPage = 1;
  renderWorkspaceTable();
}

function handleSort(key) {
  isDescending = !isDescending;
  workingDataset.sort((a, b) => {
    return isDescending
      ? String(b[key]).localeCompare(String(a[key]))
      : String(a[key]).localeCompare(String(b[key]));
  });
  renderWorkspaceTable();
}

// 1. Clean native Excel spreadsheet document generation
function exportToExcel() {
  const dataToExport = workingDataset.map((row, idx) => ({
    Count: idx + 1,
    "Employee ID": row.employeeId,
    Name: row.name,
    Email: row.email || "-",
    Phone: row.phoneNumber || "-",
    "Job Title": row.jobTitle,
    Group: row.group,
    Company: row.companyName,
    Nationality: row.nationality,
    Status: row.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
  XLSX.writeFile(workbook, "Employee_Report.xlsx");
}

// 2. Clean multi-column landscape PDF document generation
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "mm", "a4");

  doc.text("Employee Management Report", 14, 15);

  const tableHeaders = [
    [
      "Count",
      "Emp ID",
      "Name",
      "Email",
      "Phone",
      "Job Title",
      "Group",
      "Company",
      "Nationality",
      "Status",
    ],
  ];
  const tableRows = workingDataset.map((row, idx) => [
    idx + 1,
    row.employeeId,
    row.name,
    row.email || "-",
    row.phoneNumber || "-",
    row.jobTitle,
    row.group,
    row.companyName,
    row.nationality,
    row.status,
  ]);

  doc.autoTable({
    head: tableHeaders,
    body: tableRows,
    startY: 22,
    theme: "striped",
    styles: { fontSize: 8 },
  });

  doc.save("Employee_Report.pdf");
}

// 3. Standalone CSV Document Generator
function exportToCSV() {
  let csvContent =
    "data:text/csv;charset=utf-8,Count,Emp ID,Name,Email,Phone,Job Title,Group,Company,Nationality,Status\n";
  workingDataset.forEach((row, idx) => {
    const line = [
      idx + 1,
      `"${row.employeeId}"`,
      `"${row.name}"`,
      `"${row.email || "-"}"`,
      `"${row.phoneNumber || "-"}"`,
      `"${row.jobTitle}"`,
      `"${row.group}"`,
      `"${row.companyName}"`,
      `"${row.nationality}"`,
      `"${row.status}"`,
    ].join(",");
    csvContent += line + "\n";
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Employee_Report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 4. Copy data rows to clipboard buffer matrix
function copyTableToClipboard() {
  let textBuffer =
    "Count\tEmp ID\tName\tEmail\tPhone\tJob Title\tGroup\tCompany\tNationality\tStatus\n";
  workingDataset.forEach((row, idx) => {
    textBuffer += `${idx + 1}\t${row.employeeId}\t${row.name}\t${row.email || "-"}\t${row.phoneNumber || "-"}\t${row.jobTitle}\t${row.group}\t${row.companyName}\t${row.nationality}\t${row.status}\n`;
  });
  navigator.clipboard.writeText(textBuffer).then(() => {
    alert("Filtered data row matrix copied to clipboard successfully!");
  });
}

// Event bindings setup
document
  .getElementById("globalSearch")
  .addEventListener("input", filterPipeline);
document.getElementById("rowSelector").addEventListener("change", (e) => {
  limitPerPage = e.target.value;
  currentPage = 1;
  renderWorkspaceTable();
});
document
  .querySelectorAll("thead input, thead select")
  .forEach((element) => element.addEventListener("input", filterPipeline));

// Primary initialization call
computeSummaryMetrics();
renderWorkspaceTable();
