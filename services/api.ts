import {
  mockAnnouncements, mockCalendarEvents, mockTasks, mockServices, mockPsychologists, mockTrainings, mockRegulations, mockLinks, mockUsers
} from './mockData';
import {
  Announcement, CalendarEvent, Task, ServicePrice, Psychologist, TaskStatus, Profile, TrainingMaterial, RegulationSection, UsefulLink, User
} from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let announcements: Announcement[] = [...mockAnnouncements];
let calendarEvents: CalendarEvent[] = [...mockCalendarEvents];
let tasks: Task[] = [...mockTasks];
let services: ServicePrice[] = [...mockServices];
let psychologists: Psychologist[] = [...mockPsychologists];
let trainings: TrainingMaterial[] = [...mockTrainings];
let regulations: RegulationSection[] = [...mockRegulations];
let links: UsefulLink[] = [...mockLinks];

// Auth API
export const login = async (email: string, password: string): Promise<User> => {
  await delay(600);
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  throw new Error("Credenciais inválidas. Tente novamente.");
};

// Mural API
export const getAnnouncements = async (): Promise<Announcement[]> => {
  await delay(500);
  return [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addAnnouncement = async (post: Omit<Announcement, 'id' | 'date' | 'author'>): Promise<Announcement> => {
  await delay(500);
  const newPost: Announcement = {
    ...post,
    id: `ann-${Date.now()}`,
    date: new Date().toISOString(),
    author: 'Gestão',
  };
  announcements.unshift(newPost);
  return newPost;
};

// Calendario API
export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  await delay(600);
  return calendarEvents;
};

export const addCalendarEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    await delay(500);
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    calendarEvents.push(newEvent);
    return newEvent;
};

// Tarefas API
export const getTasks = async (): Promise<Task[]> => {
  await delay(700);
  return [...tasks].sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
};

export const addTask = async (task: Omit<Task, 'id' | 'status' | 'creationDate' | 'requester'>, requester: User): Promise<Task> => {
  await delay(500);
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}`,
    status: TaskStatus.Pendente,
    creationDate: new Date().toISOString(),
    requester: requester.name,
  };
  tasks.unshift(newTask);
  return newTask;
};

export const updateTask = async (updatedTask: Task): Promise<Task> => {
  await delay(400);
  tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
  return updatedTask;
}

export const deleteTask = async (taskId: string): Promise<void> => {
  await delay(400);
  tasks = tasks.filter(t => t.id !== taskId);
}

export const getAssignableUsers = async (): Promise<User[]> => {
    await delay(300);
    return mockUsers.map(({ password, ...user }) => user);
};

// --- RECURSOS API ---

// Treinamentos
export const getTrainings = async (): Promise<TrainingMaterial[]> => {
  await delay(500);
  return trainings;
};
export const addTraining = async (training: Omit<TrainingMaterial, 'id'>): Promise<TrainingMaterial> => {
  await delay(400);
  const newTraining = { ...training, id: `trn-${Date.now()}` };
  trainings.unshift(newTraining);
  return newTraining;
};
export const updateTraining = async (updated: TrainingMaterial): Promise<TrainingMaterial> => {
  await delay(400);
  trainings = trainings.map(t => t.id === updated.id ? updated : t);
  return updated;
};
export const deleteTraining = async (id: string): Promise<void> => {
  await delay(400);
  trainings = trainings.filter(t => t.id !== id);
};

// Regulamento
export const getRegulations = async (): Promise<RegulationSection[]> => {
  await delay(500);
  return regulations;
};
export const addRegulation = async (reg: Omit<RegulationSection, 'id'>): Promise<RegulationSection> => {
  await delay(400);
  const newReg = { ...reg, id: `reg-${Date.now()}` };
  regulations.unshift(newReg);
  return newReg;
};
export const updateRegulation = async (updated: RegulationSection): Promise<RegulationSection> => {
  await delay(400);
  regulations = regulations.map(r => r.id === updated.id ? updated : r);
  return updated;
};
export const deleteRegulation = async (id: string): Promise<void> => {
  await delay(400);
  regulations = regulations.filter(r => r.id !== id);
};

// Links Úteis
export const getLinks = async (): Promise<UsefulLink[]> => {
  await delay(500);
  return links;
};
export const addLink = async (link: Omit<UsefulLink, 'id'>): Promise<UsefulLink> => {
  await delay(400);
  const newLink = { ...link, id: `lnk-${Date.now()}` };
  links.unshift(newLink);
  return newLink;
};
export const updateLink = async (updated: UsefulLink): Promise<UsefulLink> => {
  await delay(400);
  links = links.map(l => l.id === updated.id ? updated : l);
  return updated;
};
export const deleteLink = async (id: string): Promise<void> => {
  await delay(400);
  links = links.filter(l => l.id !== id);
};

// Preços
export const getServices = async (): Promise<ServicePrice[]> => {
  await delay(500);
  return services;
};
export const addService = async (service: Omit<ServicePrice, 'id'>): Promise<ServicePrice> => {
  await delay(500);
  const newService = { ...service, id: `svc-${Date.now()}` };
  services.unshift(newService);
  return newService;
};
export const updateService = async (updated: ServicePrice): Promise<ServicePrice> => {
  await delay(400);
  services = services.map(s => s.id === updated.id ? updated : s);
  return updated;
};
export const deleteService = async (id: string): Promise<void> => {
  await delay(400);
  services = services.filter(s => s.id !== id);
};

// Psis
export const getPsychologists = async (): Promise<Psychologist[]> => {
    await delay(500);
    return psychologists;
};
export const addPsychologist = async (psi: Omit<Psychologist, 'id'>): Promise<Psychologist> => {
    await delay(500);
    const newPsi = { ...psi, id: `psi-${Date.now()}` };
    psychologists.unshift(newPsi);
    return newPsi;
};
export const updatePsychologist = async (updated: Psychologist): Promise<Psychologist> => {
  await delay(400);
  psychologists = psychologists.map(p => p.id === updated.id ? updated : p);
  return updated;
};
export const deletePsychologist = async (id: string): Promise<void> => {
  await delay(400);
  psychologists = psychologists.filter(p => p.id !== id);
};