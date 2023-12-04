import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import AddTasks from "./pages/AddTasks";
import EditTasks from "./pages/EditTasks";
import Detail from "./components/Detail";
import AddSubtasks from "./pages/AddSubtasks";
import EditSubTasks from "./pages/EditSubTasks";
import TrialTasks from "./pages/TrialTasks";
import AddTrialTasks from "./pages/AddTrialTasks";
import EditTrialTasks from "./pages/EditTrialTasks";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/add" element={<AddTasks />} />
          <Route path="/subtasks/add" element={<AddSubtasks />} />
          <Route path="/tasks/edit/:id" element={<EditTasks />} />
          <Route path="/subtasks/edit/:id" element={<EditSubTasks />} />
          <Route path="/tasks/detail/:id" element={<Detail />} />
          <Route path="/trial-tasks" element={<TrialTasks />} />
          <Route path="/trial-tasks/add" element={<AddTrialTasks />} />
          <Route path="/trial-tasks/edit/:id" element={<EditTrialTasks />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


