import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getMe } from "../features/authSlice";

const Detail = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [detailTask, setDetailTask] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const queryParams = new URLSearchParams(useLocation().search);
  const taskName = queryParams.get("taskName");

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);
  
  useEffect(() => {
    getDetailTasks();
  }, []);

  const getDetailTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/subtasks/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setDetailTask(response.data);
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
        url: `${process.env.REACT_APP_BASE_URL}/subtasks/${taskId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      getDetailTasks();
      setError(null);
    } catch (error) {
      setError("Error deleting the task. Please try again later.");
    }
  };

  const renderStageInfo = (stageName, stageImage, stageProgress, stageApproval) => {
    const approvalTextColor = stageApproval === "Pending" ? "gray" : stageApproval === "Ditolak" ? "red" : stageApproval === "Diterima" ? "green" : "inherit";
  
    return (
      <div>
        <a href={stageImage} target="_blank" rel="noopener noreferrer">
          <img src={stageImage} alt={stageName} width="100" height="100" />
        </a>
        <p>Progress: {stageProgress}%</p>
        <p>
          <span>Approval: </span>
          <span style={{ color: approvalTextColor, fontWeight: "bold" }}>{stageApproval !== null ? stageApproval : "Pending"}</span>
        </p>
      </div>
    );
  };
  

  const calculateTotalProgress = (task) => {
    return Object.values(task).reduce(
      (total, stage) => total + stage, // Sum all progress values
      0 // Initial total is 0
    );
  };

  return (
    <div>
      <div className="padding">
        <h1 className="title">Detail Proses - {taskName}</h1>
        {error && <p className="has-text-danger">{error}</p>}
        <Link to="/tasks" className="button is-danger mb-2 mx-3">
          Kembali
        </Link>
		{user && user.role !== 'supplier' && (
			<Link to="/subtasks/add" className="button is-primary mb-2">
			  Tambah Baru
			</Link>
		)}
      </div>
      <div className="table-container">
        <table className="table is-striped is-fullwidth is-responsive">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
			{user && user.role !== 'supplier' && (
				<col style={{ width: "10%" }} />
			)}
          </colgroup>
          <thead>
            <tr>
              <th>Nama Proses</th>
              <th>Design</th>
              <th>Ordering Material</th>
              <th>Ordering Std Part</th>
              <th>Machining</th>
              <th>Assembly</th>
              <th>Trial</th>
              <th>Harden & Coating</th>
              <th>Total Progress</th>
			  {user && user.role !== 'supplier' && (
				<th>Actions</th>
			  )}
            </tr>
          </thead>
          <tbody>
            {detailTask.length < 1 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>Data Kosong</td>
              </tr>
            ) : (
              detailTask.map((e, idx) => {
                const total_progress = calculateTotalProgress({
                  design_progress: e.design_progress,
                  material_progress: e.material_progress,
                  std_part_progress: e.std_part_progress,
                  machining_progress: e.machining_progress,
                  assembly_progress: e.assembly_progress,
                  trial_progress: e.trial_progress,
                  harden_coating_progress: e.harden_coating_progress,
                });

                return (
                  <tr key={idx}>
                    <td>{e.name}</td>
                    <td>
                      {renderStageInfo("Design", e.design_image, e.design_progress, e.design_approval)}
                      <a
                        href={e.design_image}
                        download={"Design Image"}
                        style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                      >
                        Download
                      </a>
                    </td>
                    <td>
                      {renderStageInfo("Ordering Material", e.material_image, e.material_progress, e.material_approval)}
                      <a
                        href={e.material_image}
                        download={"Material Image"}
                        style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                      >
                        Download
                      </a>
                    </td>
                    <td>
                      {renderStageInfo("Ordering Std Part", e.std_part_image, e.std_part_progress, e.std_part_approval)}
                      <a
                        href={e.std_part_image}
                        download={"Std Part Image"}
                        style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                      >
                        Download
                      </a>
                    </td>
                    <td>
                      {renderStageInfo("Machining", e.machining_image, e.machining_progress, e.machining_approval)}
                      <a
                        href={e.machining_image}
                        download={"Machining Image"}
                        style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                      >
                        Download
                      </a>
                    </td>
                    <td>{renderStageInfo("Assembly", e.assembly_image, e.assembly_progress, e.assembly_approval)}
                    <a
                        href={e.assembly_image}
                        download={"Assembly Image"}
                        style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                      >
                        Download
                      </a>
                    </td>
                    <td>{renderStageInfo("Trial", e.trial_image, e.trial_progress, e.trial_approval)}
                    <a
                        href={e.trial_image}
                        download={"Trial Image"}
                        style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                      >
                        Download
                      </a>
                    </td>
                    <td>{renderStageInfo("Harden & Coating", e.harden_coating_image, e.harden_coating_progress, e.harden_coating_approval)}
                    <a
                        href={e.harden_coating_image}
                        download={"Harden & Coating Image"}
                        style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                      >
                        Download
                      </a>
                    </td>
                    <td>
                      <div>
                        <p>{total_progress}%</p>
                      </div>
                    </td>
                    <td>
						  <Link to={`/subtasks/edit/${e.uuid}`} className="button is-small is-info is-fullwidth">
							Edit
						  </Link>
              {user && user.role !== 'supplier' && ( 
                <button onClick={() => deleteTask(e.uuid)} className="button is-small is-danger is-fullwidth">
                  Delete
                </button>
              )}

						</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Detail;