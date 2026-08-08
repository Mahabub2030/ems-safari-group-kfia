// data.js - Externalized JSON / Mock Data
const APP_DATA = {
  employees: [
    { id: "SAF-1001", name: "M@h@bub Alam", craft: "Full Stack Dev", dept: "Administration", status: "On Duty", iqama: "2458963124", iqamaIssue: "2025-05-10", iqamaExpiry: "2026-08-25", dacoId: "DACO-901", dacoIssue: "2025-06-01", dacoExpiry: "2026-08-15", nationality: "Bangladeshi", shift: "Team A", site: "Dammam HQ" },
    { id: "SAF-1002", name: "Ahmed Al-Mutairi", craft: "Safety Officer", dept: "HSE", status: "On Duty", iqama: "2398412563", iqamaIssue: "2024-02-15", iqamaExpiry: "2026-08-12", dacoId: "DACO-902", dacoIssue: "2024-03-01", dacoExpiry: "2026-08-10", nationality: "Saudi", shift: "Team B", site: "King Fahd Airport" },
    { id: "SAF-1003", name: "Mohammed Rafique", craft: "Electrician", dept: "Operations", status: "On Leave", iqama: "2587419632", iqamaIssue: "2024-04-20", iqamaExpiry: "2026-09-05", dacoId: "DACO-903", dacoIssue: "2024-04-25", dacoExpiry: "2026-09-01", nationality: "Indian", shift: "Team A", site: "Jubail Plant" },
    { id: "SAF-1004", name: "Carlos Mendoza", craft: "Rig Welder", dept: "Mechanical", status: "On Duty", iqama: "2698741235", iqamaIssue: "2024-06-10", iqamaExpiry: "2026-08-18", dacoId: "DACO-904", dacoIssue: "2024-06-15", dacoExpiry: "2026-08-20", nationality: "Filipino", shift: "Team C", site: "Ras Tanura" },
    { id: "SAF-1005", name: "Hassan Al-Shehri", craft: "Civil Engineer", dept: "Engineering", status: "On Duty", iqama: "2145896321", iqamaIssue: "2024-01-10", iqamaExpiry: "2026-11-20", dacoId: "DACO-905", dacoIssue: "2024-01-15", dacoExpiry: "2026-10-15", nationality: "Saudi", shift: "Team A", site: "Dammam HQ" }
  ],
  equipment: [
    { id: "EQ-501", name: "CAT Excavator 320", category: "Heavy Machinery", assignee: "Carlos Mendoza", status: "Active", assignedDate: "2026-01-10", nextService: "2026-08-25" },
    { id: "EQ-502", name: "Toyota Hilux 4x4", category: "Vehicle", assignee: "Ahmed Al-Mutairi", status: "Active", assignedDate: "2026-02-01", nextService: "2026-09-10" }
  ],
  vacations: [
    { employee: "Mohammed Rafique", type: "Annual Leave", start: "2026-08-10", end: "2026-09-10", visa: "Valid", flight: "Confirmed", approval: "Approved" }
  ],
  documents: [
    { name: "Company Commercial Registration (CR)", category: "Legal", date: "2025-01-15", size: "2.4 MB", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80", desc: "Official CR document for Safari Contracting Company." },
    { name: "DACO Airport Security Compliance", category: "Safety", date: "2025-03-10", size: "1.8 MB", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80", desc: "Approved airport contractor security clearance certificate." }
  ]
};
