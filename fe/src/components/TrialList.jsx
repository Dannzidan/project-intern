import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "../trial.css";

const TrialList = () => {
  const { user } = useSelector((state) => state.auth);
  const [trialList, setTrialList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrialTasks();
  }, []);

  const getTrialTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/trial-tasks`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTrialList(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Error fetching tasks. Please try again later.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const deleteTrialTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios({
        url: `${process.env.REACT_APP_BASE_URL}/trial-tasks/${taskId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      getTrialTasks();
      setError(null);
    } catch (error) {
      setError("Error deleting the task. Please try again later.");
    }
  };

  return (
    <div>
      <h1 className="title">Report Trial</h1>
      <h2 className="subtitle">Daftar Report Trial</h2>
      {error && <p className="has-text-danger">{error}</p>}
      <Link to="/trial-tasks/add" className="button is-primary mb-2">
        Tambah Model Part Baru
      </Link>
      <div className="table-container">
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Part Name</th>
              <th>Visual Part</th>
              <th>Qty</th>
              <th>Status Part</th>
              <th>Note</th>
              <th>PICA</th>
              <th>Tgl Masuk</th>
              <th>Tgl Cek</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trialList.map((e) => (
              <tr key={e.uuid}>
                <td>{e.name}</td>
                <td>{e.part_name}</td>
                <td>
                  {e.visual_image && (
                    <div>
                      <a
                        target="_blank"
                        href={e.visual_image}
                        rel="noreferrer noopener"
                      >
                        <img
                          src={e.visual_image}
                          alt="Visual Part"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain", 
                          }}
                        />
                      </a>
                    </div>
                  )}
                </td>
                <td>{e.quantity}</td>
                <td
                  style={{
                    color:
                      e.status === "NG"
                        ? "red"
                        : e.status === "Not Yet"
                        ? "gray"
                        : e.status === "OK"
                        ? "green"
                        : "",
                    fontWeight:
                      e.status === "NG" || e.status === "Not Yet" || e.status === "OK"
                        ? "bold"
                        : "normal",
                  }}
                >
                  {e.status}
                </td>
                <td>
                  <div
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    {e.note}
                  </div>
                </td>
                <td>
                  {e.remark_image && (
                    <div>
                      <img
                        src={e.remark_image}
                        alt="PICA"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                      <span>
                        <a
                          className="button is-small is-link is-outlined"
                          href={e.remark_image}
                          download={"PICA"}
                          style={{ marginTop: "5px" }}
                        >
                          <span>Download</span>
                          <span className="icon">
                            <i className="fa fa-external-link-alt"></i>
                          </span>
                        </a>
                      </span>
                    </div>
                  )}
                </td>
                <td>{formatDate(e.tanggalIn)}</td>
                <td>{formatDate(e.tanggalCek)}</td>
                <td>
                  <div style={{ display: "flex", gap: "1px" }}>
                    <Link
                      to={`/trial-tasks/edit/${e.uuid}`}
                      className="button is-small is-info"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (user && user.role !== 'supplier') {
                          deleteTrialTask(e.uuid);
                        } else {
                          alert("Anda tidak memiliki akses untuk menghapus pada halaman ini");
                        }
                      }}
                      className="button is-small is-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrialList;
