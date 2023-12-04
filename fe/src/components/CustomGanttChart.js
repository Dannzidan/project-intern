import React from "react";
import { Gantt } from "gantt-task-react";

const CustomGanttChart = ({ tasks }) => {
  const columns = [
    // Define the columns you want, including "user"
    { Header: "Name", accessor: "name" },
    { Header: "User", accessor: "user" },
  ];

  const config = {
    table: {
      columns,
    },
  };

  return <Gantt tasks={tasks}  TaskListTable={config}/>;
};

export default CustomGanttChart;
