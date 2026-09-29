import { mockStore } from './mockDataStore';
import { Client, Task, Employee, Document, DashboardStats, User, Invoice, Payment, InvoiceStats } from '@/types';

// --- Clients ---
export const getClients = async (): Promise<Client[]> => {
  return mockStore.getClients();
};

export const saveClient = async (client: Partial<Client> & { id?: string }): Promise<void> => {
  mockStore.saveClient(client);
};

// --- Tasks ---
export const getTasks = async (currentUser?: User): Promise<Task[]> => {
  return mockStore.getTasks(currentUser);
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  return mockStore.getTaskById(id);
};

export const saveTask = async (task: Partial<Task> & { id?: string }): Promise<void> => {
  mockStore.saveTask(task);
};

// --- Employees ---
export const getEmployees = async (): Promise<Employee[]> => {
  return mockStore.getEmployees();
};

export const createEmployee = async (employeeData: Partial<Employee>, email: string, password: string): Promise<void> => {
  mockStore.createEmployee(employeeData, email, password);
};

export const updateEmployee = async (employee: Employee): Promise<void> => {
  mockStore.updateEmployee(employee);
};

// --- Documents ---
export const getDocuments = async (taskId?: string): Promise<Document[]> => {
  return mockStore.getDocuments(taskId);
};

export const uploadDocument = async (doc: Omit<Document, 'id' | 'uploaded_at'>): Promise<void> => {
  mockStore.uploadDocument(doc);
};

export const deleteDocument = async (id: string): Promise<void> => {
  mockStore.deleteDocument(id);
};

// --- Dashboard Stats ---
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return mockStore.getDashboardStats();
};

// --- Get employee by user_id ---
export const getEmployeeByUserId = async (userId: string): Promise<Employee | null> => {
  return mockStore.getEmployeeByUserId(userId);
};

// --- Delete operations ---
export const deleteClient = async (id: string): Promise<void> => {
  mockStore.deleteClient(id);
};

export const deleteEmployee = async (id: string): Promise<void> => {
  mockStore.deleteEmployee(id);
};

export const deleteTask = async (id: string): Promise<void> => {
  mockStore.deleteTask(id);
};

// --- Invoices ---
export const getInvoices = async (): Promise<Invoice[]> => {
  return mockStore.getInvoices();
};

export const saveInvoice = async (invoice: Partial<Invoice> & { id?: string }): Promise<void> => {
  mockStore.saveInvoice(invoice);
};

export const deleteInvoice = async (id: string): Promise<void> => {
  mockStore.deleteInvoice(id);
};

// --- Payments ---
export const getPayments = async (invoiceId?: string): Promise<Payment[]> => {
  return mockStore.getPayments(invoiceId);
};

export const savePayment = async (payment: Omit<Payment, 'id' | 'created_at'>): Promise<void> => {
  mockStore.savePayment(payment);
};

// --- Invoice Stats ---
export const getInvoiceStats = async (): Promise<InvoiceStats> => {
  return mockStore.getInvoiceStats();
};
