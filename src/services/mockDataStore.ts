import { Client, Task, Employee, Document, Invoice, Payment, User, AppRole, DashboardStats, InvoiceStats } from '@/types';

export interface MockUserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: AppRole;
}

// -------------------------------------------------------------
// 1. USERS (30 User Accounts)
// -------------------------------------------------------------
export const INITIAL_USERS: MockUserAccount[] = [
  // Primary manager account
  { id: 'usr-001', email: 'emanyahyadev@gmail.com', password: '123', name: 'Eman Yahya', role: 'manager' },
  // Senior Leadership & Partners
  { id: 'usr-002', email: 'partner@cafirm.pk', password: '123', name: 'Muhammad Bilal FCA', role: 'admin' },
  { id: 'usr-003', email: 'tariq.partner@cafirm.pk', password: '123', name: 'Tariq Mehmood FCA', role: 'admin' },
  { id: 'usr-004', email: 'zainab.partner@cafirm.pk', password: '123', name: 'Zainab Abbasi FCA', role: 'admin' },
  // Managers
  { id: 'usr-005', email: 'kamran.mgr@cafirm.pk', password: '123', name: 'Kamran Ashraf ACA', role: 'manager' },
  { id: 'usr-006', email: 'sidra.mgr@cafirm.pk', password: '123', name: 'Sidra Batool ACA', role: 'manager' },
  { id: 'usr-007', email: 'faizan.mgr@cafirm.pk', password: '123', name: 'Faizan Sheikh ACCA', role: 'manager' },
  // Senior Staff & Specialists
  { id: 'usr-008', email: 'hamza@cafirm.pk', password: '123', name: 'Hamza Tariq ACA', role: 'employee' },
  { id: 'usr-009', email: 'ayesha@cafirm.pk', password: '123', name: 'Ayesha Siddiqui', role: 'employee' },
  { id: 'usr-010', email: 'usama@cafirm.pk', password: '123', name: 'Usama Farooq', role: 'employee' },
  { id: 'usr-011', email: 'bilal.tax@cafirm.pk', password: '123', name: 'Bilal Ahmed Khan', role: 'employee' },
  { id: 'usr-012', email: 'mariam.audit@cafirm.pk', password: '123', name: 'Mariam Nawaz ACA', role: 'employee' },
  { id: 'usr-013', email: 'saad.secp@cafirm.pk', password: '123', name: 'Saad Ur Rehman', role: 'employee' },
  { id: 'usr-014', email: 'fatima.gst@cafirm.pk', password: '123', name: 'Fatima Noor', role: 'employee' },
  { id: 'usr-015', email: 'hassan.audit@cafirm.pk', password: '123', name: 'Hassan Raza', role: 'employee' },
  { id: 'usr-016', email: 'nimra.tax@cafirm.pk', password: '123', name: 'Nimra Javed', role: 'employee' },
  { id: 'usr-017', email: 'ali.consulting@cafirm.pk', password: '123', name: 'Ali Haider Shah', role: 'employee' },
  { id: 'usr-018', email: 'hira.advisory@cafirm.pk', password: '123', name: 'Hira Mustafa', role: 'employee' },
  { id: 'usr-019', email: 'omer.audit@cafirm.pk', password: '123', name: 'Omer Qureshi ACA', role: 'employee' },
  { id: 'usr-020', email: 'maha.corporate@cafirm.pk', password: '123', name: 'Maha Zubair', role: 'employee' },
  { id: 'usr-021', email: 'danyal.tax@cafirm.pk', password: '123', name: 'Danyal Munir', role: 'employee' },
  { id: 'usr-022', email: 'bushra.compliance@cafirm.pk', password: '123', name: 'Bushra Khalid', role: 'employee' },
  { id: 'usr-023', email: 'waqas.audit@cafirm.pk', password: '123', name: 'Waqas Rasheed', role: 'employee' },
  { id: 'usr-024', email: 'kinza.trainee@cafirm.pk', password: '123', name: 'Kinza Tariq', role: 'employee' },
  { id: 'usr-025', email: 'shahid.transfer@cafirm.pk', password: '123', name: 'Shahid Mehmood', role: 'employee' },
  { id: 'usr-026', email: 'rabia.finance@cafirm.pk', password: '123', name: 'Rabia Aslam', role: 'employee' },
  { id: 'usr-027', email: 'junaid.tax@cafirm.pk', password: '123', name: 'Junaid Baig', role: 'employee' },
  { id: 'usr-028', email: 'sana.qcr@cafirm.pk', password: '123', name: 'Sana Farooq ACA', role: 'employee' },
  { id: 'usr-029', email: 'zubair.audit@cafirm.pk', password: '123', name: 'Zubair Chaudhry', role: 'employee' },
  { id: 'usr-030', email: 'anaya.trainee@cafirm.pk', password: '123', name: 'Anaya Malik', role: 'employee' }
];

// -------------------------------------------------------------
// 2. EMPLOYEES (30 Practice Staff Records)
// -------------------------------------------------------------
export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-001', user_id: 'usr-001', full_name: 'Eman Yahya', email: 'emanyahyadev@gmail.com', phone: '+92 300 8472910', designation: 'Audit & Practice Manager', active: true, employee_code: 'MGR-01' },
  { id: 'emp-002', user_id: 'usr-002', full_name: 'Muhammad Bilal FCA', email: 'partner@cafirm.pk', phone: '+92 321 9845123', designation: 'Senior Managing Partner', active: true, employee_code: 'PTR-01' },
  { id: 'emp-003', user_id: 'usr-003', full_name: 'Tariq Mehmood FCA', email: 'tariq.partner@cafirm.pk', phone: '+92 322 4455667', designation: 'Partner - Tax & Legal', active: true, employee_code: 'PTR-02' },
  { id: 'emp-004', user_id: 'usr-004', full_name: 'Zainab Abbasi FCA', email: 'zainab.partner@cafirm.pk', phone: '+92 333 1122334', designation: 'Partner - Assurance & QCR', active: true, employee_code: 'PTR-03' },
  { id: 'emp-005', user_id: 'usr-005', full_name: 'Kamran Ashraf ACA', email: 'kamran.mgr@cafirm.pk', phone: '+92 345 5566778', designation: 'Senior Audit Manager', active: true, employee_code: 'MGR-02' },
  { id: 'emp-006', user_id: 'usr-006', full_name: 'Sidra Batool ACA', email: 'sidra.mgr@cafirm.pk', phone: '+92 301 9988776', designation: 'Tax & Compliance Manager', active: true, employee_code: 'MGR-03' },
  { id: 'emp-007', user_id: 'usr-007', full_name: 'Faizan Sheikh ACCA', email: 'faizan.mgr@cafirm.pk', phone: '+92 312 8877665', designation: 'Corporate Advisory Manager', active: true, employee_code: 'MGR-04' },
  { id: 'emp-008', user_id: 'usr-008', full_name: 'Hamza Tariq ACA', email: 'hamza@cafirm.pk', phone: '+92 333 4567890', designation: 'Tax & Advisory Senior', active: true, employee_code: 'SNR-01' },
  { id: 'emp-009', user_id: 'usr-009', full_name: 'Ayesha Siddiqui', email: 'ayesha@cafirm.pk', phone: '+92 345 6789012', designation: 'Senior Audit Associate', active: true, employee_code: 'SNR-02' },
  { id: 'emp-010', user_id: 'usr-010', full_name: 'Usama Farooq', email: 'usama@cafirm.pk', phone: '+92 312 3456789', designation: 'Corporate & SECP Specialist', active: true, employee_code: 'SNR-03' },
  { id: 'emp-011', user_id: 'usr-011', full_name: 'Bilal Ahmed Khan', email: 'bilal.tax@cafirm.pk', phone: '+92 300 1234567', designation: 'Direct Tax Supervisor', active: true, employee_code: 'SNR-04' },
  { id: 'emp-012', user_id: 'usr-012', full_name: 'Mariam Nawaz ACA', email: 'mariam.audit@cafirm.pk', phone: '+92 321 2345678', designation: 'Audit Senior (IFRS Lead)', active: true, employee_code: 'SNR-05' },
  { id: 'emp-013', user_id: 'usr-013', full_name: 'Saad Ur Rehman', email: 'saad.secp@cafirm.pk', phone: '+92 333 3456789', designation: 'Corporate Law Officer', active: true, employee_code: 'SNR-06' },
  { id: 'emp-014', user_id: 'usr-014', full_name: 'Fatima Noor', email: 'fatima.gst@cafirm.pk', phone: '+92 345 4567890', designation: 'Sales Tax & PRA Specialist', active: true, employee_code: 'SNR-07' },
  { id: 'emp-015', user_id: 'usr-015', full_name: 'Hassan Raza', email: 'hassan.audit@cafirm.pk', phone: '+92 311 5678901', designation: 'Audit In-Charge', active: true, employee_code: 'ASC-01' },
  { id: 'emp-016', user_id: 'usr-016', full_name: 'Nimra Javed', email: 'nimra.tax@cafirm.pk', phone: '+92 302 6789012', designation: 'Tax Associate', active: true, employee_code: 'ASC-02' },
  { id: 'emp-017', user_id: 'usr-017', full_name: 'Ali Haider Shah', email: 'ali.consulting@cafirm.pk', phone: '+92 323 7890123', designation: 'Financial Due Diligence Analyst', active: true, employee_code: 'ASC-03' },
  { id: 'emp-018', user_id: 'usr-018', full_name: 'Hira Mustafa', email: 'hira.advisory@cafirm.pk', phone: '+92 334 8901234', designation: 'Valuation & Advisory Senior', active: true, employee_code: 'ASC-04' },
  { id: 'emp-019', user_id: 'usr-019', full_name: 'Omer Qureshi ACA', email: 'omer.audit@cafirm.pk', phone: '+92 346 9012345', designation: 'Senior Audit Supervisor', active: true, employee_code: 'SNR-08' },
  { id: 'emp-020', user_id: 'usr-020', full_name: 'Maha Zubair', email: 'maha.corporate@cafirm.pk', phone: '+92 313 0123456', designation: 'Secretarial Practice Associate', active: true, employee_code: 'ASC-05' },
  { id: 'emp-021', user_id: 'usr-021', full_name: 'Danyal Munir', email: 'danyal.tax@cafirm.pk', phone: '+92 303 1234509', designation: 'Withholding Tax Lead', active: true, employee_code: 'ASC-06' },
  { id: 'emp-022', user_id: 'usr-022', full_name: 'Bushra Khalid', email: 'bushra.compliance@cafirm.pk', phone: '+92 324 2345098', designation: 'Anti-Money Laundering Officer', active: true, employee_code: 'ASC-07' },
  { id: 'emp-023', user_id: 'usr-023', full_name: 'Waqas Rasheed', email: 'waqas.audit@cafirm.pk', phone: '+92 335 3450987', designation: 'Audit Semi-Senior', active: true, employee_code: 'ASC-08' },
  { id: 'emp-024', user_id: 'usr-024', full_name: 'Kinza Tariq', email: 'kinza.trainee@cafirm.pk', phone: '+92 347 4509876', designation: 'Trainee Chartered Accountant', active: true, employee_code: 'TRN-01' },
  { id: 'emp-025', user_id: 'usr-025', full_name: 'Shahid Mehmood', email: 'shahid.transfer@cafirm.pk', phone: '+92 314 5609875', designation: 'Transfer Pricing Analyst', active: true, employee_code: 'ASC-09' },
  { id: 'emp-026', user_id: 'usr-026', full_name: 'Rabia Aslam', email: 'rabia.finance@cafirm.pk', phone: '+92 304 6709874', designation: 'Bookkeeping & BPO Lead', active: true, employee_code: 'ASC-10' },
  { id: 'emp-027', user_id: 'usr-027', full_name: 'Junaid Baig', email: 'junaid.tax@cafirm.pk', phone: '+92 325 7809873', designation: 'Sales Tax Executive', active: true, employee_code: 'ASC-11' },
  { id: 'emp-028', user_id: 'usr-028', full_name: 'Sana Farooq ACA', email: 'sana.qcr@cafirm.pk', phone: '+92 336 8909872', designation: 'Quality Review Specialist', active: true, employee_code: 'SNR-09' },
  { id: 'emp-029', user_id: 'usr-029', full_name: 'Zubair Chaudhry', email: 'zubair.audit@cafirm.pk', phone: '+92 348 9009871', designation: 'Senior Assurance Associate', active: true, employee_code: 'ASC-12' },
  { id: 'emp-030', user_id: 'usr-030', full_name: 'Anaya Malik', email: 'anaya.trainee@cafirm.pk', phone: '+92 315 0109870', designation: 'Audit & Tax Intern', active: true, employee_code: 'TRN-02' }
];

// -------------------------------------------------------------
// 3. CLIENTS (30 Realistic Pakistani SME, Trading & Pvt Ltd Clients)
// -------------------------------------------------------------
export const INITIAL_CLIENTS: Client[] = [
  { id: 'cli-001', name: 'Apex Logistics & Freight Pvt Ltd', client_code: 'APX-PK-2024', contact_person: 'Tariq Mehmood (MD)', contact_phone: '+92 42 3584 9911', contact_email: 'tariq@apexlogistics.pk', pan_number: '0712345-6', gst_number: '03-01-9999-001-19', status: 'Active', notes: 'Container freight sales tax apportionment and FBR withholding compliance.', created_at: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: 'cli-002', name: 'Prime Packaging Solutions Pvt Ltd', client_code: 'PPS-PK-2024', contact_person: 'Muhammad Usman (Director)', contact_phone: '+92 42 3591 2233', contact_email: 'usman@primepackaging.pk', pan_number: '1423456-7', gst_number: '04-02-8888-002-28', status: 'Active', notes: 'Corrugated cartons sales tax return & Section 153 WHT reconciliation.', created_at: new Date(Date.now() - 55 * 86400000).toISOString() },
  { id: 'cli-003', name: 'Al-Rehman Rice Mills Pvt Ltd', client_code: 'RRM-PK-2024', contact_person: 'Haji Abdul Rehman (CEO)', contact_phone: '+92 547 521 888', contact_email: 'rehman@alrehmanrice.pk', pan_number: '0834567-8', gst_number: '11-00-7777-003-37', status: 'Active', notes: 'Basmati rice export sales tax zero-rating audit & SECP Form A filing.', created_at: new Date(Date.now() - 50 * 86400000).toISOString() },
  { id: 'cli-004', name: 'Crest Engineering & Fabrication', client_code: 'CEF-PK-2025', contact_person: 'Nabeel Gujjar (Partner)', contact_phone: '+92 55 429 1100', contact_email: 'nabeel@cresteng.pk', pan_number: '1345678-9', gst_number: '17-00-6666-004-46', status: 'Active', notes: 'Custom steel tanks manufacturing sales tax audit under PRA.', created_at: new Date(Date.now() - 48 * 86400000).toISOString() },
  { id: 'cli-005', name: 'Zahid & Sons Agro Traders', client_code: 'ZST-PK-2024', contact_person: 'Zahid Hussain (Proprietor)', contact_phone: '+92 61 652 3344', contact_email: 'zahid@agrotraders.pk', pan_number: '2256789-0', gst_number: '12-00-5555-005-55', status: 'Active', notes: 'Fertilizer & pesticide retail withholding statement u/s 165.', created_at: new Date(Date.now() - 45 * 86400000).toISOString() },
  { id: 'cli-006', name: 'Falcon Tech Solutions Pvt Ltd', client_code: 'FTS-PK-2024', contact_person: 'Danyal Siddiqui (CEO)', contact_phone: '+92 51 227 8900', contact_email: 'danyal@falcontech.pk', pan_number: '0891234-5', gst_number: '03-05-9999-012-19', status: 'Active', notes: 'PSEB IT export tax exemption u/s 65F / 154A & Annual Financial Audit.', created_at: new Date(Date.now() - 42 * 86400000).toISOString() },
  { id: 'cli-007', name: 'Nexus Health Pharma Distributors', client_code: 'NHD-PK-2024', contact_person: 'Dr. Nadeem Akhtar (MD)', contact_phone: '+92 51 556 7788', contact_email: 'nadeem@nexushealth.pk', pan_number: '0711122-3', gst_number: '03-01-3333-007-88', status: 'Active', notes: 'Wholesale medicine distribution sales tax input adjustment audit.', created_at: new Date(Date.now() - 40 * 86400000).toISOString() },
  { id: 'cli-008', name: 'United Leather Garments Pvt Ltd', client_code: 'ULG-PK-2025', contact_person: 'Shahid Mughal (Director)', contact_phone: '+92 52 355 4400', contact_email: 'shahid@unitedleather.pk', pan_number: '0714455-6', gst_number: '11-00-9999-008-22', status: 'Active', notes: 'Leather goods export FASTER system sales tax refund claims.', created_at: new Date(Date.now() - 38 * 86400000).toISOString() },
  { id: 'cli-009', name: 'Orient Textile Dyeing Mills', client_code: 'OTD-PK-2024', contact_person: 'Sheikh Munir (Managing Partner)', contact_phone: '+92 41 876 5500', contact_email: 'munir@orientdyeing.pk', pan_number: '0812345-9', gst_number: '03-00-5555-009-44', status: 'Active', notes: 'Fabric dyeing job work PRA provincial sales tax compliance.', created_at: new Date(Date.now() - 36 * 86400000).toISOString() },
  { id: 'cli-010', name: 'Al-Madina Auto Parts Trading Co', client_code: 'MAP-PK-2024', contact_person: 'Haji Aslam (Owner)', contact_phone: '+92 42 3765 1122', contact_email: 'aslam@madinaautoparts.pk', pan_number: '0819876-5', gst_number: '03-02-7777-010-66', status: 'Active', notes: 'Commercial auto parts import section 148 tax adjustments.', created_at: new Date(Date.now() - 34 * 86400000).toISOString() },
  { id: 'cli-011', name: 'Crown Plastic Industries Pvt Ltd', client_code: 'CPI-PK-2024', contact_person: 'Rana Khurram (Finance Head)', contact_phone: '+92 56 379 2200', contact_email: 'khurram@crownplastics.pk', pan_number: '0718899-0', gst_number: '11-00-4444-011-88', status: 'Active', notes: 'PVC pipe manufacturing sales tax return & SECP annual filing.', created_at: new Date(Date.now() - 32 * 86400000).toISOString() },
  { id: 'cli-012', name: 'Skyline Builders & Contractors', client_code: 'SBC-PK-2025', contact_person: 'Engr. Jamil Khan (Director)', contact_phone: '+92 91 584 3300', contact_email: 'jamil@skylinebuilders.pk', pan_number: '3167890-1', gst_number: '19-00-4444-006-64', status: 'Active', notes: 'KPRA Construction services tax withholding & advance tax u/s 147.', created_at: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'cli-013', name: 'Bismillah Chemical Traders', client_code: 'BCT-PK-2023', contact_person: 'Haji Bashir (Managing Partner)', contact_phone: '+92 21 3241 8800', contact_email: 'bashir@bismillahchemicals.pk', pan_number: '0715566-7', gst_number: '12-00-2222-013-11', status: 'Active', notes: 'Textile chemical trading sales tax reconciliation & annual tax return.', created_at: new Date(Date.now() - 28 * 86400000).toISOString() },
  { id: 'cli-014', name: 'Star Solar Energy Systems Pvt Ltd', client_code: 'SSE-PK-2024', contact_person: 'Bilal Chaudhry (CEO)', contact_phone: '+92 42 3578 4400', contact_email: 'bilal@starsolar.pk', pan_number: '0716677-8', gst_number: '03-03-8888-014-33', status: 'Active', notes: 'Solar inverter net metering vendor sales tax exemption audit.', created_at: new Date(Date.now() - 26 * 86400000).toISOString() },
  { id: 'cli-015', name: 'Khyber Food Processing Unit', client_code: 'KFP-PK-2024', contact_person: 'Ziaullah Shinwari (Owner)', contact_phone: '+92 995 611 200', contact_email: 'zia@khyberfoods.pk', pan_number: '1417788-9', gst_number: '03-04-1111-015-55', status: 'Active', notes: 'Mineral water & fruit pulp processing sales tax audit.', created_at: new Date(Date.now() - 24 * 86400000).toISOString() },
  { id: 'cli-016', name: 'Silver Star Surgical Instruments', client_code: 'SSS-PK-2024', contact_person: 'Irfan Dar (Director Export)', contact_phone: '+92 52 426 7700', contact_email: 'irfan@silverstarsurgical.pk', pan_number: '2718899-0', gst_number: '03-01-6666-016-77', status: 'Active', notes: 'Surgical export drawback & PRAL Customs zero-rated export audit.', created_at: new Date(Date.now() - 22 * 86400000).toISOString() },
  { id: 'cli-017', name: 'National Flour & General Mills', client_code: 'NFM-PK-2024', contact_person: 'Malik Tahir (MD)', contact_phone: '+92 48 321 4455', contact_email: 'tahir@nationalflour.pk', pan_number: '0813344-5', gst_number: '03-06-9999-017-99', status: 'Active', notes: 'Wheat quota food department statutory tax audit & withholding.', created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: 'cli-018', name: 'Metro Supermarket Retail Chain', client_code: 'MCS-PK-2024', contact_person: 'Fawad Sheikh (GM Finance)', contact_phone: '+92 41 854 6600', contact_email: 'fawad@metrosuper.pk', pan_number: '0719900-1', gst_number: '11-00-5555-018-00', status: 'Active', notes: 'FBR Tier-1 POS integration & cash register electronic audit.', created_at: new Date(Date.now() - 18 * 86400000).toISOString() },
  { id: 'cli-019', name: 'Zenith Ceramics & Sanitary Ware', client_code: 'ZCS-PK-2024', contact_person: 'Farooq Butt (Director)', contact_phone: '+92 53 352 1100', contact_email: 'farooq@zenithceramics.pk', pan_number: '0812233-4', gst_number: '03-01-7777-019-22', status: 'Active', notes: 'Tiles & ceramic fittings sales tax input-output ratio audit.', created_at: new Date(Date.now() - 16 * 86400000).toISOString() },
  { id: 'cli-020', name: 'Fast Track Courier & Cargo Services', client_code: 'FTC-PK-2025', contact_person: 'Rashid Baig (Operations Head)', contact_phone: '+92 21 3438 9900', contact_email: 'rashid@fasttrackcargo.pk', pan_number: '0614455-6', gst_number: '07-01-9999-020-44', status: 'Active', notes: 'COD logistics sales tax on courier services (SRB/PRA).', created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: 'cli-021', name: 'Greenfield Poultry Farms Pvt Ltd', client_code: 'GPF-PK-2024', contact_person: 'Chaudhry Mazhar (CEO)', contact_phone: '+92 44 252 8800', contact_email: 'mazhar@greenfieldpoultry.pk', pan_number: '1415566-7', gst_number: '07-02-3333-021-66', status: 'Active', notes: 'Poultry feed tax exemptions and agricultural income tax review.', created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'cli-022', name: 'Universal Printing & Stationery', client_code: 'UPS-PK-2024', contact_person: 'Mian Saleem (Owner)', contact_phone: '+92 42 3723 5500', contact_email: 'saleem@universalprinting.pk', pan_number: '0816677-8', gst_number: '03-05-4444-022-88', status: 'Active', notes: 'School textbooks & commercial printing sales tax audit.', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'cli-023', name: 'Al-Hussain Steel Re-Rolling Mills', client_code: 'HSR-PK-2024', contact_person: 'Zulfiqar Ali (Finance Manager)', contact_phone: '+92 22 388 4400', contact_email: 'zulfiqar@hussainsteel.pk', pan_number: '0817788-9', gst_number: '03-03-2222-023-00', status: 'Active', notes: 'Steel billets sales tax special procedure calculation.', created_at: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 'cli-024', name: 'Diamond Weaving Mills Pvt Ltd', client_code: 'DWM-PK-2024', contact_person: 'Sohail Anwar (Director)', contact_phone: '+92 49 276 3300', contact_email: 'sohail@diamondweaving.pk', pan_number: '0710011-2', gst_number: '11-00-8888-024-11', status: 'Active', notes: 'Cotton grey cloth yarn conversion & export tax audit.', created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'cli-025', name: 'Royal Glass & Aluminum Fabricators', client_code: 'RGA-PK-2024', contact_person: 'Ahmad Raza (Partner)', contact_phone: '+92 51 443 2200', contact_email: 'ahmad@royalglass.pk', pan_number: '0818899-0', gst_number: '03-01-5555-025-33', status: 'Active', notes: 'Curtain walls architectural glazing sales tax withholding.', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'cli-026', name: 'City Diagnostic Laboratories', client_code: 'CDL-PK-2025', contact_person: 'Dr. Shahbaz Ali (Director)', contact_phone: '+92 61 458 9900', contact_email: 'shahbaz@citylabmultan.pk', pan_number: '0712233-4', gst_number: '07-00-6666-026-55', status: 'Active', notes: 'Pathology & ultrasound health services PRA tax assessment.', created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'cli-027', name: 'Pak Cold Storage & Ice Factory', client_code: 'PCS-PK-2024', contact_person: 'Mian Tariq (Owner)', contact_phone: '+92 40 446 7700', contact_email: 'tariq@pakcoldstorage.pk', pan_number: '2913344-5', gst_number: '03-00-7777-027-77', status: 'Active', notes: 'Potato cold store energy tax reconciliation & annual return.', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'cli-028', name: 'Al-Makkah Oil Extraction Mills', client_code: 'MOM-PK-2024', contact_person: 'Hafiz Waqas (Manager)', contact_phone: '+92 67 336 2200', contact_email: 'waqas@makkahoilmills.pk', pan_number: '1416677-8', gst_number: '03-02-9999-028-99', status: 'Active', notes: 'Canola oil expelling sales tax exemption and local sales audit.', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'cli-029', name: 'Modern Furniture Makers Pvt Ltd', client_code: 'MFM-PK-2024', contact_person: 'Kamran Chinioti (MD)', contact_phone: '+92 47 633 1100', contact_email: 'kamran@modernfurniture.pk', pan_number: '0713344-5', gst_number: '11-00-1111-029-11', status: 'Active', notes: 'Woodwork manufacturing & corporate furniture supply audit.', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'cli-030', name: 'Shaheen Security Services Pvt Ltd', client_code: 'SSS-PK-2024', contact_person: 'Major (R) Asif Ali (CEO)', contact_phone: '+92 51 517 8800', contact_email: 'asif@shaheensecurity.pk', pan_number: '2114455-6', gst_number: '11-00-3333-030-33', status: 'Active', notes: 'Guard services PRA/SRB provincial withholding sales tax filing.', created_at: new Date(Date.now() - 2 * 86400000).toISOString() }
];

// -------------------------------------------------------------
// 4. TASKS / PROJECTS (30 Statutory & Audit Practice Tasks)
// -------------------------------------------------------------
export const INITIAL_TASKS: Task[] = [
  { id: 'tsk-001', client_id: 'cli-001', assignee_employee_id: 'emp-008', assignee_ids: ['emp-008', 'emp-001'], title: 'Apex Logistics - FBR Monthly Sales Tax Return (Annexure C)', description: 'Reconcile freight invoices from IRIS, calculate input tax credit on fuel and vehicle maintenance, submit monthly return.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'tsk-002', client_id: 'cli-002', assignee_employee_id: 'emp-009', assignee_ids: ['emp-009', 'emp-001'], title: 'Prime Packaging - Statutory Annual Audit FY 2025-26', description: 'Perform substantive audit testing, raw material inventory verification, verify revenue and draft ISA audit report.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'tsk-003', client_id: 'cli-003', assignee_employee_id: 'emp-010', assignee_ids: ['emp-010'], title: 'Al-Rehman Rice - SECP Annual Compliance (Form 29 & Form A)', description: 'Prepare and file Annual Return (Form A), update particulars of directors & Chief Executive via SECP eServices.', status: 'Waiting for client', priority: 'Medium', due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'tsk-004', client_id: 'cli-004', assignee_employee_id: 'emp-011', assignee_ids: ['emp-011'], title: 'Crest Engineering - FBR Monthly Withholding Statement U/S 165', description: 'Compile CPR challans for payments under Sections 149 (Salary), 153 (Supplies & Services), upload bulk JSON to IRIS.', status: 'Not started', priority: 'High', due_date: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'tsk-005', client_id: 'cli-005', assignee_employee_id: 'emp-012', assignee_ids: ['emp-012'], title: 'Zahid & Sons - PRA / FBR Sales Tax Reconciliation', description: 'Validate provincial withholding certificates against Punjab Revenue Authority and FBR tax portals.', status: 'Completed', priority: 'Medium', due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], completed_at: new Date(Date.now() - 1 * 86400000).toISOString(), created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'tsk-006', client_id: 'cli-006', assignee_employee_id: 'emp-001', assignee_ids: ['emp-001'], title: 'Falcon Tech - Advance Income Tax Calculation U/S 147 (Q3)', description: 'Calculate IT export exemption ratio and prepare Form 147 payment challan on FBR portal.', status: 'In progress', priority: 'Low', due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'tsk-007', client_id: 'cli-007', assignee_employee_id: 'emp-015', assignee_ids: ['emp-015', 'emp-005'], title: 'Nexus Health - Pharma Inventory Count & Stock Valuation', description: 'Audit physical medicine stock under ICAP guidelines and reconcile expired batch provisions.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'tsk-008', client_id: 'cli-008', assignee_employee_id: 'emp-019', assignee_ids: ['emp-019'], title: 'United Leather - FASTER Sales Tax Export Refund Verification', description: 'Review export shipping bills (GDs) and verify input tax adjustment for automated duty refund bond release.', status: 'Completed', priority: 'Medium', due_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], completed_at: new Date(Date.now() - 3 * 86400000).toISOString(), created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: 'tsk-009', client_id: 'cli-009', assignee_employee_id: 'emp-022', assignee_ids: ['emp-022'], title: 'Orient Textile - Fabric Dyeing PRA Provincial Return Filing', description: 'E-file monthly job work services return on Punjab Revenue Authority portal at 16% standard rate.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'tsk-010', client_id: 'cli-010', assignee_employee_id: 'emp-025', assignee_ids: ['emp-025'], title: 'Al-Madina Auto - Import Advance Tax Reconcile (Section 148)', description: 'Reconcile customs advance income tax paid at Karachi Port against quarterly corporate tax liability.', status: 'Waiting for client', priority: 'High', due_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 'tsk-011', client_id: 'cli-011', assignee_employee_id: 'emp-014', assignee_ids: ['emp-014'], title: 'Crown Plastic - Sales Tax Input-Output Ratio Audit', description: 'Audit polymer granules consumption vs PVC pipe output to justify input tax adjustment to Commissioner IR.', status: 'In progress', priority: 'Medium', due_date: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'tsk-012', client_id: 'cli-012', assignee_employee_id: 'emp-016', assignee_ids: ['emp-016'], title: 'Skyline Builders - KPRA Construction Withholding Filing', description: 'Compile contractor payment deduction certificates and submit KP Revenue Authority quarterly report.', status: 'Not started', priority: 'High', due_date: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'tsk-013', client_id: 'cli-013', assignee_employee_id: 'emp-027', assignee_ids: ['emp-027'], title: 'Bismillah Chemicals - Annual Income Tax Return (Form 114)', description: 'Prepare taxable income computation and file corporate return with Large Taxpayers Office (LTO).', status: 'In progress', priority: 'Medium', due_date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'tsk-014', client_id: 'cli-014', assignee_employee_id: 'emp-008', assignee_ids: ['emp-008'], title: 'Star Solar - Solar Equipment Custom SRO Exemption Verification', description: 'Verify solar panel import documentation and sales tax exemptions under SRO 584(I)/2022.', status: 'Completed', priority: 'High', due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], completed_at: new Date(Date.now() - 1 * 86400000).toISOString(), created_at: new Date(Date.now() - 11 * 86400000).toISOString() },
  { id: 'tsk-015', client_id: 'cli-015', assignee_employee_id: 'emp-021', assignee_ids: ['emp-021'], title: 'Khyber Foods - Commercial Bottling Plant Physical Audit', description: 'Conduct year-end plant machinery valuation and depreciation schedule update for financial assurance.', status: 'In progress', priority: 'Low', due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'tsk-016', client_id: 'cli-016', assignee_employee_id: 'emp-015', assignee_ids: ['emp-015'], title: 'Silver Star Surgical - State Bank EE Statement Audit for ERF', description: 'Verify export proceeds realization for SBP Part-II Export Refinance Scheme certification.', status: 'Waiting for client', priority: 'Medium', due_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 13 * 86400000).toISOString() },
  { id: 'tsk-017', client_id: 'cli-017', assignee_employee_id: 'emp-011', assignee_ids: ['emp-011'], title: 'National Flour - Wheat Flour Grinding Tax Exemption Review', description: 'Verify sales tax exemption on unprocessed food grains under Sixth Schedule of Sales Tax Act 1990.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'tsk-018', client_id: 'cli-018', assignee_employee_id: 'emp-023', assignee_ids: ['emp-023'], title: 'Metro Supermarket - FBR Tier-1 POS Integration Audit', description: 'Verify barcode scanning and digital tax transmission across 12 checkout counters with FBR server.', status: 'Completed', priority: 'High', due_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], completed_at: new Date(Date.now() - 4 * 86400000).toISOString(), created_at: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 'tsk-019', client_id: 'cli-019', assignee_employee_id: 'emp-013', assignee_ids: ['emp-013'], title: 'Zenith Ceramics - Natural Gas Industrial Tariff Sales Tax Review', description: 'Review SNGPL gas bill sales tax adjustments and reconcile withholding tax credit u/s 235.', status: 'Not started', priority: 'Medium', due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'tsk-020', client_id: 'cli-020', assignee_employee_id: 'emp-018', assignee_ids: ['emp-018'], title: 'Fast Track Cargo - Sindh Revenue Board (SRB) Courier Tax Filing', description: 'File monthly provincial services sales tax return with Sindh Revenue Board on delivery commissions.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 16 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'tsk-021', client_id: 'cli-021', assignee_employee_id: 'emp-014', assignee_ids: ['emp-014'], title: 'Greenfield Poultry - Punjab Agricultural Income Tax Filing', description: 'Compile poultry breeding records for Punjab Board of Revenue Agricultural Tax assessment.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'tsk-022', client_id: 'cli-022', assignee_employee_id: 'emp-020', assignee_ids: ['emp-020'], title: 'Universal Printing - Vendor Withholding Tax Management U/S 153', description: 'Issue CPR-linked tax deduction certificates for paper mill suppliers and bulk ink vendors.', status: 'Completed', priority: 'Medium', due_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], completed_at: new Date(Date.now() - 2 * 86400000).toISOString(), created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'tsk-023', client_id: 'cli-023', assignee_employee_id: 'emp-029', assignee_ids: ['emp-029'], title: 'Al-Hussain Steel - Special Steel Tax Scheme Working Paper', description: 'Calculate sales tax liability based on electric meter unit consumption under Special Steel Rules.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'tsk-024', client_id: 'cli-024', assignee_employee_id: 'emp-017', assignee_ids: ['emp-017'], title: 'Diamond Weaving - SBP Export Refinancing (ERF) Audit Certificate', description: 'Audit commercial weaving export shipments for State Bank concessional financing renewal.', status: 'Waiting for client', priority: 'High', due_date: new Date(Date.now() + 22 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'tsk-025', client_id: 'cli-025', assignee_employee_id: 'emp-008', assignee_ids: ['emp-008'], title: 'Royal Glass - SECP Authorized Capital Increase (Form 7)', description: 'Draft board resolution and e-file Form 7 with SECP Islamabad CRO for capital increase.', status: 'In progress', priority: 'Medium', due_date: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'tsk-026', client_id: 'cli-026', assignee_employee_id: 'emp-024', assignee_ids: ['emp-024'], title: 'City Diagnostics - PRA Diagnostic Services Sales Tax Review', description: 'Reconcile medical lab test invoices against Punjab Revenue Authority exempt healthcare schedules.', status: 'Not started', priority: 'Low', due_date: new Date(Date.now() + 19 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'tsk-027', client_id: 'cli-027', assignee_employee_id: 'emp-012', assignee_ids: ['emp-012'], title: 'Pak Cold Storage - Electricity Duty Withholding Tax Audit U/S 235', description: 'Reconcile commercial electricity advance tax deductions with MEPCO utility bills.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'tsk-028', client_id: 'cli-028', assignee_employee_id: 'emp-026', assignee_ids: ['emp-026'], title: 'Al-Makkah Oil - Seed Crushing Raw Material Stock Verification', description: 'Conduct oil seed physical inventory measurement and expeller efficiency audit.', status: 'Completed', priority: 'Medium', due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], completed_at: new Date(Date.now() - 1 * 86400000).toISOString(), created_at: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 'tsk-029', client_id: 'cli-029', assignee_employee_id: 'emp-027', assignee_ids: ['emp-027'], title: 'Modern Furniture - SECP Annual Statutory Audit FY 2025-26', description: 'Prepare draft financial statements under IFRS for SMEs and conduct partner review.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'tsk-030', client_id: 'cli-030', assignee_employee_id: 'emp-028', assignee_ids: ['emp-028'], title: 'Shaheen Security - Security Guard PRA Tax Withholding Audit', description: 'Verify monthly salary payments and provincial sales tax deduction on security contracts.', status: 'In progress', priority: 'High', due_date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], completed_at: null, created_at: new Date(Date.now() - 4 * 86400000).toISOString() }
];

// -------------------------------------------------------------
// 5. INVOICES (30 Realistic SME Practice Billings)
// -------------------------------------------------------------
export const INITIAL_INVOICES: Invoice[] = [
  { id: 'inv-001', invoice_number: 'INV-PK-2026-001', client_id: 'cli-001', task_id: 'tsk-001', amount: 150000, status: 'Paid', issue_date: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], description: 'Apex Logistics - Monthly FBR Sales Tax & WHT Retainership Q1', notes: 'Received via Bank Alfalah IBFT.', created_by: 'usr-001', created_at: new Date(Date.now() - 25 * 86400000).toISOString(), updated_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'inv-002', invoice_number: 'INV-PK-2026-002', client_id: 'cli-002', task_id: 'tsk-002', amount: 280000, status: 'Sent', issue_date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Prime Packaging - Statutory Annual Audit Fee FY 2025-26', notes: 'Dispatched to Prime Packaging Accounts.', created_by: 'usr-001', created_at: new Date(Date.now() - 12 * 86400000).toISOString(), updated_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'inv-003', invoice_number: 'INV-PK-2026-003', client_id: 'cli-003', task_id: 'tsk-003', amount: 95000, status: 'Draft', issue_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Al-Rehman Rice - SECP Form 29 & Annual Return Legal Retainer', notes: 'Under review.', created_by: 'usr-001', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), updated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'inv-004', invoice_number: 'INV-PK-2026-004', client_id: 'cli-004', task_id: 'tsk-004', amount: 120000, status: 'Overdue', issue_date: new Date(Date.now() - 40 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Crest Engineering - Monthly Section 165 Withholding Statement & Tax Review', notes: 'Payment reminder sent.', created_by: 'usr-001', created_at: new Date(Date.now() - 40 * 86400000).toISOString(), updated_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'inv-005', invoice_number: 'INV-PK-2026-005', client_id: 'cli-005', task_id: 'tsk-005', amount: 85000, status: 'Paid', issue_date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0], description: 'Zahid & Sons - Sales Tax Appeal Representation & Reconciliation', notes: 'Paid via Meezan Bank Online.', created_by: 'usr-001', created_at: new Date(Date.now() - 30 * 86400000).toISOString(), updated_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'inv-006', invoice_number: 'INV-PK-2026-006', client_id: 'cli-006', task_id: 'tsk-006', amount: 160000, status: 'Sent', issue_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Falcon Tech - Advance Tax Calculation & PSEB IT Exemption Filing', notes: 'Dispatched to CEO.', created_by: 'usr-001', created_at: new Date(Date.now() - 8 * 86400000).toISOString(), updated_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'inv-007', invoice_number: 'INV-PK-2026-007', client_id: 'cli-007', task_id: 'tsk-007', amount: 210000, status: 'Paid', issue_date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], description: 'Nexus Health - Pharma Inventory Count & Stock Valuation Assurance', notes: 'Cleared by Nexus Treasury.', created_by: 'usr-001', created_at: new Date(Date.now() - 20 * 86400000).toISOString(), updated_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'inv-008', invoice_number: 'INV-PK-2026-008', client_id: 'cli-008', task_id: 'tsk-008', amount: 175000, status: 'Sent', issue_date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'United Leather - FASTER Export Refund Verification Retainership', notes: 'Sent to Sialkot office.', created_by: 'usr-001', created_at: new Date(Date.now() - 14 * 86400000).toISOString(), updated_at: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: 'inv-009', invoice_number: 'INV-PK-2026-009', client_id: 'cli-009', task_id: 'tsk-009', amount: 130000, status: 'Overdue', issue_date: new Date(Date.now() - 45 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Orient Textile - Fabric Dyeing PRA Provincial Return Representation', notes: 'Follow-up call logged.', created_by: 'usr-001', created_at: new Date(Date.now() - 45 * 86400000).toISOString(), updated_at: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 'inv-010', invoice_number: 'INV-PK-2026-010', client_id: 'cli-010', task_id: 'tsk-010', amount: 110000, status: 'Paid', issue_date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], description: 'Al-Madina Auto - Section 148 Commercial Import Tax Adjustment Study', notes: 'Paid via Habib Metro Bank.', created_by: 'usr-001', created_at: new Date(Date.now() - 18 * 86400000).toISOString(), updated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'inv-011', invoice_number: 'INV-PK-2026-011', client_id: 'cli-011', task_id: 'tsk-011', amount: 190000, status: 'Draft', issue_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Crown Plastic - Sales Tax Input-Output Ratio Certification', notes: 'Draft under review.', created_by: 'usr-001', created_at: new Date(Date.now() - 1 * 86400000).toISOString(), updated_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'inv-012', invoice_number: 'INV-PK-2026-012', client_id: 'cli-012', task_id: 'tsk-012', amount: 145000, status: 'Sent', issue_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Skyline Builders - KPRA Construction Services Tax Withholding Retainer', notes: 'Delivered to Peshawar office.', created_by: 'usr-001', created_at: new Date(Date.now() - 6 * 86400000).toISOString(), updated_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'inv-013', invoice_number: 'INV-PK-2026-013', client_id: 'cli-013', task_id: 'tsk-013', amount: 180000, status: 'Paid', issue_date: new Date(Date.now() - 22 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], description: 'Bismillah Chemicals - Annual Corporate Income Tax Return U/S 114', notes: 'Direct deposit in MCB Account.', created_by: 'usr-001', created_at: new Date(Date.now() - 22 * 86400000).toISOString(), updated_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'inv-014', invoice_number: 'INV-PK-2026-014', client_id: 'cli-014', task_id: 'tsk-014', amount: 125000, status: 'Sent', issue_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Star Solar - Solar Equipment SRO Sales Tax Exemption Review', notes: 'Dispatched to Finance Head.', created_by: 'usr-001', created_at: new Date(Date.now() - 4 * 86400000).toISOString(), updated_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'inv-015', invoice_number: 'INV-PK-2026-015', client_id: 'cli-015', task_id: 'tsk-015', amount: 155000, status: 'Draft', issue_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Khyber Foods - Plant Machinery Physical Audit & Asset Register Update', notes: 'Draft ready.', created_by: 'usr-001', created_at: new Date(Date.now() - 3 * 86400000).toISOString(), updated_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'inv-016', invoice_number: 'INV-PK-2026-016', client_id: 'cli-016', task_id: 'tsk-016', amount: 220000, status: 'Paid', issue_date: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0], description: 'Silver Star Surgical - SBP ERF Export Realization Audit Certificate', notes: 'Paid via Direct Banking.', created_by: 'usr-001', created_at: new Date(Date.now() - 28 * 86400000).toISOString(), updated_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'inv-017', invoice_number: 'INV-PK-2026-017', client_id: 'cli-017', task_id: 'tsk-017', amount: 140000, status: 'Paid', issue_date: new Date(Date.now() - 16 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], description: 'National Flour - Wheat Exemption & Food Dept Audit Retainership', notes: 'Settled by National Flour.', created_by: 'usr-001', created_at: new Date(Date.now() - 16 * 86400000).toISOString(), updated_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'inv-018', invoice_number: 'INV-PK-2026-018', client_id: 'cli-018', task_id: 'tsk-018', amount: 165000, status: 'Sent', issue_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Metro Supermarket - FBR Tier-1 POS Integration Audit Fee', notes: 'Submitted to Accounts.', created_by: 'usr-001', created_at: new Date(Date.now() - 5 * 86400000).toISOString(), updated_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'inv-019', invoice_number: 'INV-PK-2026-019', client_id: 'cli-019', task_id: 'tsk-019', amount: 135000, status: 'Overdue', issue_date: new Date(Date.now() - 38 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Zenith Ceramics - SNGPL Industrial Tariff Sales Tax Adjustment Review', notes: 'Reminder sent.', created_by: 'usr-001', created_at: new Date(Date.now() - 38 * 86400000).toISOString(), updated_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'inv-020', invoice_number: 'INV-PK-2026-020', client_id: 'cli-020', task_id: 'tsk-020', amount: 240000, status: 'Paid', issue_date: new Date(Date.now() - 19 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], description: 'Fast Track Cargo - SRB & PRA Provincial Courier Services Tax Assurance', notes: 'Cleared via 1LINK.', created_by: 'usr-001', created_at: new Date(Date.now() - 19 * 86400000).toISOString(), updated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'inv-021', invoice_number: 'INV-PK-2026-021', client_id: 'cli-021', task_id: 'tsk-021', amount: 90000, status: 'Paid', issue_date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], description: 'Greenfield Poultry - Punjab Agricultural Tax Assessment Filing', notes: 'Paid by Poultry Accounts.', created_by: 'usr-001', created_at: new Date(Date.now() - 15 * 86400000).toISOString(), updated_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'inv-022', invoice_number: 'INV-PK-2026-022', client_id: 'cli-022', task_id: 'tsk-022', amount: 115000, status: 'Sent', issue_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Universal Printing - Section 153 WHT Vendor Certificate Audit', notes: 'Delivered to Lahore Office.', created_by: 'usr-001', created_at: new Date(Date.now() - 7 * 86400000).toISOString(), updated_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'inv-023', invoice_number: 'INV-PK-2026-023', client_id: 'cli-023', task_id: 'tsk-023', amount: 260000, status: 'Draft', issue_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Al-Hussain Steel - Steel Re-Rolling Electricity Scheme Tax Audit', notes: 'Draft under tax manager review.', created_by: 'usr-001', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), updated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'inv-024', invoice_number: 'INV-PK-2026-024', client_id: 'cli-024', task_id: 'tsk-024', amount: 195000, status: 'Sent', issue_date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Diamond Weaving - SBP ERF Export Certification & Tax Filing', notes: 'Dispatched to Diamond Weaving Accounts.', created_by: 'usr-001', created_at: new Date(Date.now() - 9 * 86400000).toISOString(), updated_at: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 'inv-025', invoice_number: 'INV-PK-2026-025', client_id: 'cli-025', task_id: 'tsk-025', amount: 80000, status: 'Draft', issue_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Royal Glass - SECP Form 7 Capital Increment Legal Filing', notes: 'Ready for client dispatch.', created_by: 'usr-001', created_at: new Date(Date.now() - 1 * 86400000).toISOString(), updated_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'inv-026', invoice_number: 'INV-PK-2026-026', client_id: 'cli-026', task_id: 'tsk-026', amount: 140000, status: 'Paid', issue_date: new Date(Date.now() - 24 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], description: 'City Diagnostics - PRA Diagnostic Healthcare Tax Assessment Review', notes: 'Paid by City Diagnostics.', created_by: 'usr-001', created_at: new Date(Date.now() - 24 * 86400000).toISOString(), updated_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'inv-027', invoice_number: 'INV-PK-2026-027', client_id: 'cli-027', task_id: 'tsk-027', amount: 105000, status: 'Paid', issue_date: new Date(Date.now() - 13 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], paid_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], description: 'Pak Cold Storage - MEPCO Commercial Electricity Tax Reconciliation', notes: 'Cleared via UBL Online.', created_by: 'usr-001', created_at: new Date(Date.now() - 13 * 86400000).toISOString(), updated_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'inv-028', invoice_number: 'INV-PK-2026-028', client_id: 'cli-028', task_id: 'tsk-028', amount: 130000, status: 'Sent', issue_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Al-Makkah Oil - Oil Seed Raw Material Physical Stock Audit Fee', notes: 'Sent to Vehari Plant.', created_by: 'usr-001', created_at: new Date(Date.now() - 8 * 86400000).toISOString(), updated_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'inv-029', invoice_number: 'INV-PK-2026-029', client_id: 'cli-029', task_id: 'tsk-029', amount: 250000, status: 'Sent', issue_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Modern Furniture - Annual Statutory Audit FY 2025-26 under IFRS for SMEs', notes: 'Delivered to Modern Furniture.', created_by: 'usr-001', created_at: new Date(Date.now() - 5 * 86400000).toISOString(), updated_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'inv-030', invoice_number: 'INV-PK-2026-030', client_id: 'cli-030', task_id: 'tsk-030', amount: 160000, status: 'Overdue', issue_date: new Date(Date.now() - 35 * 86400000).toISOString().split('T')[0], due_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], paid_date: null, description: 'Shaheen Security - Security Guard PRA Sales Tax Withholding Retainer', notes: 'Overdue notice issued.', created_by: 'usr-001', created_at: new Date(Date.now() - 35 * 86400000).toISOString(), updated_at: new Date(Date.now() - 5 * 86400000).toISOString() }
];

// -------------------------------------------------------------
// 6. DOCUMENTS (30 Working Papers, Returns & Statutory Files)
// -------------------------------------------------------------
export const INITIAL_DOCUMENTS: Document[] = [
  { id: 'doc-001', client_id: 'cli-001', title: 'Apex Logistics - Sales Tax Annexure C Return Jan 2026.pdf', file_type: 'pdf', file_size: 1450000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 'doc-002', client_id: 'cli-002', title: 'Prime Packaging - Draft Statutory Audit Report FY 2025-26.pdf', file_type: 'pdf', file_size: 3890000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'doc-003', client_id: 'cli-003', title: 'Al-Rehman Rice - SECP Form A & Form 29 Annual Return.pdf', file_type: 'pdf', file_size: 980000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'doc-004', client_id: 'cli-004', title: 'Crest Engineering - Monthly Withholding Tax Statement U/S 165.xlsx', file_type: 'xlsx', file_size: 540000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'doc-005', client_id: 'cli-005', title: 'Zahid Agro - PRA Provincial Sales Tax Reconciliation.xlsx', file_type: 'xlsx', file_size: 720000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'doc-006', client_id: 'cli-006', title: 'Falcon Tech - PSEB IT Export Exemption Certificate.pdf', file_type: 'pdf', file_size: 420000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'doc-007', client_id: 'cli-007', title: 'Nexus Health - Pharma Inventory Count & Stock Valuation.xlsx', file_type: 'xlsx', file_size: 1850000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'doc-008', client_id: 'cli-008', title: 'United Leather - FASTER Export Sales Tax Refund Claim.pdf', file_type: 'pdf', file_size: 2300000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'doc-009', client_id: 'cli-009', title: 'Orient Textile - Fabric Dyeing PRA Provincial Return.pdf', file_type: 'pdf', file_size: 890000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'doc-010', client_id: 'cli-010', title: 'Al-Madina Auto - Import Advance Tax Reconcile Working Paper.xlsx', file_type: 'xlsx', file_size: 610000, uploaded_by: 'usr-001', created_at: new Date(Date.now() - 1 * 86400000).toISOString() }
];

// -------------------------------------------------------------
// 7. PAYMENTS (Pre-loaded Real-time Clearances)
// -------------------------------------------------------------
export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'pay-001', invoice_id: 'inv-001', amount: 150000, payment_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], payment_method: 'Bank Transfer (1LINK / RTGS)', reference_number: 'BAFL-PK-202602209876', notes: 'Direct credit into Firm Operating Account.', created_by: 'usr-001', created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'pay-002', invoice_id: 'inv-005', amount: 85000, payment_date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0], payment_method: 'Corporate RTGS', reference_number: 'MEZB-ZST-99881122', notes: 'Zahid & Sons Agro online transfer.', created_by: 'usr-001', created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'pay-003', invoice_id: 'inv-007', amount: 210000, payment_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], payment_method: 'Bank Transfer (HBL Direct)', reference_number: 'HBL-NHD-44556677', notes: 'Nexus Health Treasury deposit.', created_by: 'usr-001', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'pay-004', invoice_id: 'inv-010', amount: 110000, payment_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], payment_method: 'Online IBFT', reference_number: 'HMB-MAP-11223344', notes: 'Al-Madina Auto Accounts.', created_by: 'usr-001', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'pay-005', invoice_id: 'inv-013', amount: 180000, payment_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], payment_method: 'Bank Transfer', reference_number: 'MCB-BCT-778899', notes: 'Bismillah Chemicals payment clearance.', created_by: 'usr-001', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 'pay-006', invoice_id: 'inv-016', amount: 220000, payment_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0], payment_method: 'Corporate Cheque', reference_number: 'MCB-SSS-00984512', notes: 'Silver Star Surgical cheque clearing.', created_by: 'usr-001', created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'pay-007', invoice_id: 'inv-017', amount: 140000, payment_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], payment_method: 'Online IBFT', reference_number: 'UBL-NFM-998822', notes: 'National Flour mills accounts payable.', created_by: 'usr-001', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'pay-008', invoice_id: 'inv-020', amount: 240000, payment_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], payment_method: '1LINK RTGS', reference_number: 'FTC-CORP-445588', notes: 'Fast Track Cargo settlement.', created_by: 'usr-001', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'pay-009', invoice_id: 'inv-021', amount: 90000, payment_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], payment_method: 'Bank Transfer', reference_number: 'ASK-GPF-112233', notes: 'Greenfield Poultry credit.', created_by: 'usr-001', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'pay-010', invoice_id: 'inv-026', amount: 140000, payment_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], payment_method: 'Online Banking', reference_number: 'MEZB-CDL-667788', notes: 'City Diagnostics accounts.', created_by: 'usr-001', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'pay-011', invoice_id: 'inv-027', amount: 105000, payment_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], payment_method: 'IBFT', reference_number: 'BAFL-PCS-554433', notes: 'Pak Cold Storage payment.', created_by: 'usr-001', created_at: new Date(Date.now() - 1 * 86400000).toISOString() }
];

const STORAGE_KEY_PREFIX = 'ca_mock_pk_v7_sme';

class MockStore {
  private users: MockUserAccount[] = [];
  private employees: Employee[] = [];
  private clients: Client[] = [];
  private tasks: Task[] = [];
  private documents: Document[] = [];
  private invoices: Invoice[] = [];
  private payments: Payment[] = [];
  private currentUser: User | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem(`${STORAGE_KEY_PREFIX}_users`);
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedEmployees = localStorage.getItem(`${STORAGE_KEY_PREFIX}_employees`);
      this.employees = storedEmployees ? JSON.parse(storedEmployees) : INITIAL_EMPLOYEES;

      const storedClients = localStorage.getItem(`${STORAGE_KEY_PREFIX}_clients`);
      this.clients = storedClients ? JSON.parse(storedClients) : INITIAL_CLIENTS;

      const storedTasks = localStorage.getItem(`${STORAGE_KEY_PREFIX}_tasks`);
      this.tasks = storedTasks ? JSON.parse(storedTasks) : INITIAL_TASKS;

      const storedDocs = localStorage.getItem(`${STORAGE_KEY_PREFIX}_documents`);
      this.documents = storedDocs ? JSON.parse(storedDocs) : INITIAL_DOCUMENTS;

      const storedInvoices = localStorage.getItem(`${STORAGE_KEY_PREFIX}_invoices`);
      this.invoices = storedInvoices ? JSON.parse(storedInvoices) : INITIAL_INVOICES;

      const storedPayments = localStorage.getItem(`${STORAGE_KEY_PREFIX}_payments`);
      this.payments = storedPayments ? JSON.parse(storedPayments) : INITIAL_PAYMENTS;

      const storedSession = localStorage.getItem(`${STORAGE_KEY_PREFIX}_session`);
      if (storedSession) {
        this.currentUser = JSON.parse(storedSession);
      }
    } catch {
      this.users = INITIAL_USERS;
      this.employees = INITIAL_EMPLOYEES;
      this.clients = INITIAL_CLIENTS;
      this.tasks = INITIAL_TASKS;
      this.documents = INITIAL_DOCUMENTS;
      this.invoices = INITIAL_INVOICES;
      this.payments = INITIAL_PAYMENTS;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_users`, JSON.stringify(this.users));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_employees`, JSON.stringify(this.employees));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_clients`, JSON.stringify(this.clients));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_tasks`, JSON.stringify(this.tasks));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_documents`, JSON.stringify(this.documents));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_invoices`, JSON.stringify(this.invoices));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_payments`, JSON.stringify(this.payments));
      if (this.currentUser) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}_session`, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}_session`);
      }
    } catch {
      // Ignore storage errors
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error('Listener error:', e); }
    });
  }

  // Auth Methods
  public async signIn(email: string, password: string): Promise<{ user: User; error: null } | { user: null; error: Error }> {
    const trimmedEmail = email.trim().toLowerCase();
    const found = this.users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      const emp = this.employees.find(e => e.email.toLowerCase() === trimmedEmail);
      if (emp && (password === emp.employee_code || password === '123' || password === 'admin123' || password.length >= 3)) {
        const u: User = {
          id: emp.user_id || `usr-${emp.id}`,
          email: emp.email,
          name: emp.full_name,
          role: 'employee'
        };
        this.currentUser = u;
        this.saveToStorage();
        return { user: u, error: null };
      }
      return { user: null, error: new Error('User not found. Check email address.') };
    }

    if (found.password === password || password === '123' || password === 'admin123' || password.length >= 3) {
      const u: User = {
        id: found.id,
        email: found.email,
        name: found.name,
        role: found.role
      };
      this.currentUser = u;
      this.saveToStorage();
      return { user: u, error: null };
    }

    return { user: null, error: new Error('Invalid password.') };
  }

  public async signUp(email: string, password: string, name?: string): Promise<{ user: User; error: null } | { user: null; error: Error }> {
    const trimmedEmail = email.trim().toLowerCase();
    if (this.users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { user: null, error: new Error('An account with this email already exists.') };
    }

    const newUser: MockUserAccount = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      password: password || '123',
      name: name || email.split('@')[0],
      role: 'employee'
    };

    this.users.push(newUser);

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      user_id: newUser.id,
      full_name: newUser.name,
      email: newUser.email,
      phone: '+92 300 1234567',
      designation: 'Audit & Tax Associate',
      active: true,
      employee_code: `EMP-${Math.floor(Math.random() * 900 + 100)}`
    };
    this.employees.push(newEmp);

    const u: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };
    this.currentUser = u;
    this.saveToStorage();
    return { user: u, error: null };
  }

  public async signOut(): Promise<{ error: null }> {
    this.currentUser = null;
    this.saveToStorage();
    return { error: null };
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Users
  public getUsers(): MockUserAccount[] {
    return [...this.users];
  }

  // Employees
  public getEmployees(): Employee[] {
    return [...this.employees];
  }

  public saveEmployee(emp: Partial<Employee> & { id?: string }): void {
    if (emp.id) {
      this.employees = this.employees.map(e => e.id === emp.id ? { ...e, ...emp } as Employee : e);
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        user_id: emp.user_id,
        full_name: emp.full_name || 'Staff Member',
        email: emp.email || 'staff@cafirm.pk',
        phone: emp.phone || '+92 300 0000000',
        designation: emp.designation || 'Associate',
        active: emp.active !== undefined ? emp.active : true,
        employee_code: emp.employee_code || `EMP-${Math.floor(Math.random() * 900 + 100)}`
      };
      this.employees.unshift(newEmp);
    }
    this.saveToStorage();
  }

  public deleteEmployee(id: string): void {
    this.employees = this.employees.filter(e => e.id !== id);
    this.saveToStorage();
  }

  // Clients
  public getClients(): Client[] {
    return [...this.clients];
  }

  public saveClient(client: Partial<Client> & { id?: string }): void {
    if (client.id) {
      this.clients = this.clients.map(c => c.id === client.id ? { ...c, ...client } as Client : c);
    } else {
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        name: client.name || 'Pakistani SME Client',
        client_code: client.client_code || `CLI-${Math.floor(Math.random() * 900 + 100)}`,
        contact_person: client.contact_person || 'Managing Director',
        contact_phone: client.contact_phone || '+92 42 111 222 333',
        contact_email: client.contact_email || 'client@firm.pk',
        pan_number: client.pan_number || '0712345-6',
        gst_number: client.gst_number || '03-01-9999-001-19',
        status: client.status || 'Active',
        notes: client.notes || 'Corporate taxation and statutory accounting mandate.',
        created_at: new Date().toISOString()
      };
      this.clients.unshift(newClient);
    }
    this.saveToStorage();
  }

  public deleteClient(id: string): void {
    this.clients = this.clients.filter(c => c.id !== id);
    this.tasks = this.tasks.filter(t => t.client_id !== id);
    this.invoices = this.invoices.filter(i => i.client_id !== id);
    this.documents = this.documents.filter(d => d.client_id !== id);
    this.saveToStorage();
  }

  // Tasks
  public getTasks(): Task[] {
    return [...this.tasks];
  }

  public saveTask(task: Partial<Task> & { id?: string }): void {
    if (task.id) {
      this.tasks = this.tasks.map(t => {
        if (t.id === task.id) {
          const updated = { ...t, ...task } as Task;
          if (task.status === 'Completed' && !t.completed_at) {
            updated.completed_at = new Date().toISOString();
          } else if (task.status && task.status !== 'Completed') {
            updated.completed_at = null;
          }
          return updated;
        }
        return t;
      });
    } else {
      const newTask: Task = {
        id: `tsk-${Date.now()}`,
        client_id: task.client_id || this.clients[0]?.id || 'cli-001',
        assignee_employee_id: task.assignee_employee_id || this.employees[0]?.id || 'emp-001',
        assignee_ids: task.assignee_ids || [task.assignee_employee_id || this.employees[0]?.id || 'emp-001'],
        title: task.title || 'Statutory Compliance Working Paper',
        description: task.description || 'Statutory compliance mandate.',
        status: task.status || 'In progress',
        priority: task.priority || 'High',
        due_date: task.due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        completed_at: task.status === 'Completed' ? new Date().toISOString() : null,
        created_at: new Date().toISOString()
      };
      this.tasks.unshift(newTask);
    }
    this.saveToStorage();
  }

  public deleteTask(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToStorage();
  }

  // Documents
  public getDocuments(clientId?: string): Document[] {
    if (clientId) {
      return this.documents.filter(d => d.client_id === clientId);
    }
    return [...this.documents];
  }

  public saveDocument(doc: Partial<Document> & { id?: string }): void {
    if (doc.id) {
      this.documents = this.documents.map(d => d.id === doc.id ? { ...d, ...doc } as Document : d);
    } else {
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        client_id: doc.client_id || this.clients[0]?.id || 'cli-001',
        title: doc.title || 'Working Paper.pdf',
        file_type: doc.file_type || 'pdf',
        file_size: doc.file_size || 1024000,
        uploaded_by: doc.uploaded_by || (this.currentUser?.id || 'usr-001'),
        created_at: new Date().toISOString()
      };
      this.documents.unshift(newDoc);
    }
    this.saveToStorage();
  }

  public deleteDocument(id: string): void {
    this.documents = this.documents.filter(d => d.id !== id);
    this.saveToStorage();
  }

  // Invoices
  public getInvoices(): Invoice[] {
    return [...this.invoices];
  }

  public saveInvoice(invoice: Partial<Invoice> & { id?: string }): void {
    if (invoice.id) {
      this.invoices = this.invoices.map(i => {
        if (i.id === invoice.id) {
          const updated = { ...i, ...invoice, updated_at: new Date().toISOString() } as Invoice;
          if (invoice.status === 'Paid' && !i.paid_date) {
            updated.paid_date = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return i;
      });
    } else {
      const newInv: Invoice = {
        id: `inv-${Date.now()}`,
        invoice_number: invoice.invoice_number || `INV-PK-2026-${Math.floor(Math.random() * 900 + 100)}`,
        client_id: invoice.client_id || this.clients[0]?.id || 'cli-001',
        task_id: invoice.task_id || null,
        amount: Number(invoice.amount) || 150000,
        status: invoice.status || 'Sent',
        issue_date: invoice.issue_date || new Date().toISOString().split('T')[0],
        due_date: invoice.due_date || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        paid_date: invoice.status === 'Paid' ? new Date().toISOString().split('T')[0] : null,
        description: invoice.description || 'Statutory Audit & Tax Retainer Fee',
        notes: invoice.notes || 'Sent to Accounts Department.',
        created_by: invoice.created_by || (this.currentUser?.id || 'usr-001'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.invoices.unshift(newInv);
    }
    this.saveToStorage();
  }

  public deleteInvoice(id: string): void {
    this.invoices = this.invoices.filter(i => i.id !== id);
    this.payments = this.payments.filter(p => p.invoice_id !== id);
    this.saveToStorage();
  }

  // Payments
  public getPayments(invoiceId?: string): Payment[] {
    if (invoiceId) {
      return this.payments.filter(p => p.invoice_id === invoiceId);
    }
    return [...this.payments];
  }

  public savePayment(pay: Omit<Payment, 'id' | 'created_at'>): void {
    const newPay: Payment = {
      id: `pay-${Date.now()}`,
      ...pay,
      created_at: new Date().toISOString()
    };
    this.payments.unshift(newPay);

    const inv = this.invoices.find(i => i.id === pay.invoice_id);
    if (inv) {
      const totalPaidForInv = this.payments
        .filter(p => p.invoice_id === inv.id)
        .reduce((sum, p) => sum + Number(p.amount), 0);
      if (totalPaidForInv >= inv.amount) {
        inv.status = 'Paid';
        inv.paid_date = pay.payment_date;
      }
    }

    this.saveToStorage();
  }

  // Stats
  public getDashboardStats(): DashboardStats {
    const now = new Date();
    return {
      activeClients: this.clients.filter(c => c.status === 'Active').length,
      openTasks: this.tasks.filter(t => t.status === 'Not started' || t.status === 'In progress' || t.status === 'Waiting for client').length,
      overdueTasks: this.tasks.filter(t => new Date(t.due_date) < now && t.status !== 'Completed').length
    };
  }

  public getInvoiceStats(): InvoiceStats {
    return {
      totalInvoices: this.invoices.length,
      totalPaid: this.invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.amount), 0),
      totalPending: this.invoices.filter(i => i.status === 'Draft' || i.status === 'Sent').reduce((sum, i) => sum + Number(i.amount), 0),
      totalOverdue: this.invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + Number(i.amount), 0)
    };
  }

  public resetToDefaults(): void {
    this.users = [...INITIAL_USERS];
    this.employees = [...INITIAL_EMPLOYEES];
    this.clients = [...INITIAL_CLIENTS];
    this.tasks = [...INITIAL_TASKS];
    this.documents = [...INITIAL_DOCUMENTS];
    this.invoices = [...INITIAL_INVOICES];
    this.payments = [...INITIAL_PAYMENTS];
    this.saveToStorage();
  }
}

export const mockStore = new MockStore();
