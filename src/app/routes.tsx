import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { QuestionView } from "./pages/QuestionView";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "student", Component: StudentDashboard },
      { path: "admin", Component: AdminDashboard },
      { path: "questions/:taskNumber", Component: QuestionView },
    ],
  },
]);
