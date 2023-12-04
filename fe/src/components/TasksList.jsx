import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const TasksList = () => {
  const { user } = useSelector((state) => state.auth);
  const [taskList, setTaskList] = useState([]);
  const [error, setError] = useState(null);
  
  
	useEffect(() => {
	  if (user && user.name) {
		getTasks();
	  }
	}, [user]);

  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");
	  let params = '';
	  if(user.role == 'moderator'){
		params = '?assigned_mod='+user.id;
	  }else if(user.role == 'supplier'){
		params = '?assigned_sup='+user.id;
	  }
      const response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/tasks`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTaskList(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Error fetching tasks. Please try again later.");
    }
  };

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios({
        url: `${process.env.REACT_APP_BASE_URL}/tasks/${taskId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      getTasks();
      setError(null);
    } catch (error) {
      setError("Error deleting the task. Please try again later.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="tasks-list-container">
      <h1 className="title">Part Model</h1>
      <h2 className="subtitle">List Part Model</h2>
      {error && <p className="has-text-danger">{error}</p>}
	  {user && user.role !== 'supplier' && (
		<Link to="/tasks/add" className="button is-primary mb-2">
			Tambah Baru
		</Link>
	  )}
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>User</th>
            <th>Part Name</th>
            <th>Part Image</th>
            <th>Assigned to PIC</th>
            <th>Assigned to Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{taskList.map((task, index) => {
		  const assignedSupParts = task.assigned_sup.split('-');
		  const lastAssignedSupPart = assignedSupParts[assignedSupParts.length - 1];
		  const assignedModParts = task.assigned_mod.split('-');
		  const lastAssignedModPart = assignedModParts[assignedModParts.length - 1];
		  return (
			<tr key={task.uuid}>
			  <td>{index + 1}</td>
			  <td>{task.user && task.user.name}</td>
			  <td>{task.name}</td>
        <td>
                  {task.task_image && (
                    <img
                      src={task.task_image} // Use the URL of your task_image
                      alt={`Task Image ${index + 1}`}
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  )}
        </td>
			  <td>{lastAssignedModPart}</td>
			  <td>{lastAssignedSupPart}</td>
			  <td>
				{user && user.role !== 'supplier' && (
					<Link
					  to={`/tasks/edit/${task.uuid}`}
					  className="button is-small is-info is-responsive"
					>
					  Edit
					</Link>
				)}
				{user && user.role !== 'supplier' && (
					<button
					  onClick={() => deleteTask(task.uuid)}
					  className="button is-small is-danger is-responsive"
					  style={{ marginRight: "1px", marginLeft: "1px" }}
					>
					  Delete
					</button>
				)}
				<Link
				  to={`/tasks/detail/${task.id}?taskName=${encodeURIComponent(
					task.name
				  )}`}
				  onClick={() => localStorage.setItem("idSubtask", task.id)}
				  className="button is-small is-link is-responsive"
				>
				  Detail
				</Link>
			  </td>
			</tr>
		  );
		})}

        </tbody>
      </table>
    </div>
  );
};

export default TasksList;
