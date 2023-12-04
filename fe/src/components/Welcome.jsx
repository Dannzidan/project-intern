import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "gantt-task-react/dist/index.css";
import { Gantt } from "gantt-task-react";
import moment from "moment";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [taskList, setTaskList] = useState([]);

  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/tasks`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTaskList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const tasksWithUser = taskList.map((task) => {
    
    const startDate = moment(task.startDate); // Parse using moment
  
    return {
      start: startDate.toDate(),
      end: moment(task.endDate).toDate(),
      name: `${task.name}`, 
      type: "task",
      progress: 65,
      styles: {
        progressColor: "#08814C",
        progressSelectedColor: "#08814C",
        ganttHeight: 100,
      },
    };
  });

  return (
    <div style={{ width: "50%" }}>
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Selamat Datang Kembali <strong>{user && user.name}</strong>
      </h2>
      {taskList.length > 0 ? (
        <>
          <Gantt tasks={tasksWithUser} />
        </>
      ) : (
        <p>Loading tasks...</p>
      )}
    </div>
  );
};

export default Welcome;
