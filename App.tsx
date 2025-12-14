import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./components/Dashboard";
import CalendarPage from "./components/CalendarPage";
import TaskDetail from "./components/TaskDetail";

export interface Task {
  id: string;
  title: string;
  courseName: string;
  category: "Matkul" | "Organization" | "Freelance";
  deadline: string;
  completed: boolean;
  progress: number;
  description?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Tugas akhir PSI",
    courseName: "Pemrograman Sistem Interaktif",
    category: "Matkul",
    deadline: "2025-12-15T23:59:00",
    completed: false,
    progress: 50,
    description: "Membuat aplikasi web interaktif menggunakan React dan TypeScript"
  },
  {
    id: "2",
    title: "RAB Farewell SGE",
    courseName: "Software Engineering",
    category: "Organization",
    deadline: "2025-12-16T15:00:00",
    completed: false,
    progress: 50,
    description: "Menyusun Rencana Anggaran Biaya untuk acara farewell"
  },
  {
    id: "3",
    title: "Laporan Praktikum",
    courseName: "Basis Data",
    category: "Matkul",
    deadline: "2025-12-17T12:00:00",
    completed: false,
    progress: 30,
    description: "Membuat laporan praktikum basis data tentang normalisasi"
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Date.now().toString()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", "false");
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTaskById }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardLayout onLogout={handleLogout}><Dashboard /></DashboardLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/calendar"
            element={isAuthenticated ? <DashboardLayout onLogout={handleLogout}><CalendarPage /></DashboardLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/task/:id"
            element={isAuthenticated ? <DashboardLayout onLogout={handleLogout}><TaskDetail /></DashboardLayout> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </TaskContext.Provider>
  );
}

export default App;
