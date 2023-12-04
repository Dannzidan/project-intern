import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "./Field";
import { useSelector } from 'react-redux';


const FormEditSubTasks = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [taskData, setTaskData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    design_image: "",
    design_progress: 0,
    design_approval: "pending",
    material_image: "",
    material_progress: 0,
    material_approval: "pending",
    std_part_image: "",
    std_part_progress: 0,
    std_part_approval: "pending",
    machining_image: "",
    machining_progress: 0,
    machining_approval: "pending",
    assembly_image: "",
    assembly_progress: 0,
    assembly_approval: "pending",
    trial_image: "",
    trial_progress: 0,
    trial_approval: "pending",
    harden_coating_image: "",
    harden_coating_progress: 0,
    harden_coating_approval: "pending",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getSubTasksById = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/subtaskbyuuid/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTaskData(response.data);
        console.log("hehehe", taskData)
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getSubTasksById();
  }, [id]);

  const saveSubTasks = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/subtasks/${id}`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/tasks");
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
        setIsErrorPopupVisible(true);
      }
    }
  };

  const handleImageChange = async (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 2 * 1024 * 1024; // 2 MB

      if (!allowedTypes.includes(file.type)) {
        setErrorMsg("Jenis gambar tidak didukung. Silakan unggah gambar JPEG atau PNG.");
        setIsErrorPopupVisible(true);
        e.target.value = null;
      } else if (file.size > maxSize) {
        setErrorMsg("Gambar harus kurang dari 2 MB.");
        setIsErrorPopupVisible(true);
        e.target.value = null;
      } else {
        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            setTaskData({ ...taskData, [key]: event.target.result });
            setMsg("");
            setErrorMsg("");
            setIsErrorPopupVisible(false);
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error("Error reading file:", error);
          setErrorMsg("An error occurred while processing the image.");
          setIsErrorPopupVisible(true);
        }
      }
    }
  };

  return (
    <div>
      <h1 className="title">Sub Tugas</h1>
      <h2 className="subtitle">Edit Sub Tugas</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveSubTasks}>
            {isErrorPopupVisible && (
                <div className="notification is-danger">
                  <button
                    className="delete"
                    onClick={() => setIsErrorPopupVisible(false)}
                  ></button>
                  {errorMsg}
                </div>
              )}
              <div className="field">
                <label className="label">Nama</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={taskData.name || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Nama"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Tanggal Mulai</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={taskData.startDate || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Tanggal Berakhir</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={taskData.endDate || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Design Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "design_image")}
                  />
                </div>
              </div>
			  {taskData.design_image && (
			    <div className="image-preview">
					<img
					  src={taskData.design_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field">
                <label className="label">Design Progress</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.design_progress || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        design_progress: e.target.value,
                      })
                    }
                    min="0"
                    max="10"
                  />
                </div>
              </div>
  
              {user && user.role !== 'supplier' && ( 
                 <div className="field">
                 <label className="label">Design Approval</label>
                 <div className="control">
                   <div className="select">
                     <select
                       value={taskData.design_approval || ""}
                       onChange={(e) =>
                         setTaskData({
                           ...taskData,
                           design_approval: e.target.value,
                         })
                       }
                     >
                       <option value="Pending">Pending</option>
                       <option value="Diterima">Diterima</option>
                       <option value="Ditolak">Ditolak</option>
                     </select>
                   </div>
                 </div>
               </div>
              )}

              <div className="field">
                <label className="label">Material Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "material_image")}
                  />
                </div>
              </div>
			  {taskData.material_image && (
			    <div className="image-preview">
					<img
					  src={taskData.material_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field">
                <label className="label">Material Progress</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.material_progress || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        material_progress: e.target.value,
                      })
                    }
                    min="0"
                    max="5"
                  />
                </div>

              </div>
              {user && user.role !== 'supplier' && ( 
                <div className="field">
                <label className="label">Material Approval</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={taskData.material_approval || ""}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          material_approval: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>
              )}

              <div className="field">
                <label className="label">Std Part Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "std_part_image")}
                  />
                </div>
              </div>
			  {taskData.std_part_image && (
			    <div className="image-preview">
					<img
					  src={taskData.std_part_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field">
                <label className="label">Standard Part Progress</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.std_part_progress || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        std_part_progress: e.target.value,
                      })
                    }
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              {user && user.role !== 'supplier' && ( 
                <div className="field">
                <label className="label">Standard Part Approval</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={taskData.std_part_approval || ""}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          std_part_approval: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>
              )}

              <div className="field">
                <label className="label">Machining Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "machining_image")}
                  />
                </div>
              </div>
			  {taskData.machining_image && (
			    <div className="image-preview">
					<img
					  src={taskData.machining_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field">
                <label className="label">Machining Progress</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.machining_progress || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        machining_progress: e.target.value,
                      })
                    }
                    min="0"
                    max="50"
                  />
                </div>
              </div>
              
              {user && user.role !== 'supplier' && (
                <div className="field">
                <label className="label">Machining Approval</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={taskData.machining_approval || ""}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          machining_approval: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>
              )}

              <div className="field">
                <label className="label">Assembly Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "assembly_image")}
                  />
                </div>
              </div>
			  {taskData.assembly_image && (
			    <div className="image-preview">
					<img
					  src={taskData.assembly_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field">
                <label className="label">Assembly Progress</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.assembly_progress || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        assembly_progress: e.target.value,
                      })
                    }
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              {user && user.role !== 'supplier' && ( 
                <div className="field">
                <label className="label">Assembly Approval</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={taskData.assembly_approval || ""}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          assembly_approval: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>
              )}

              <div className="field">
                <label className="label">Trial Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "trial_image")}
                  />
                </div>
              </div>
			  {taskData.trial_image && (
			    <div className="image-preview">
					<img
					  src={taskData.trial_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field">
                <label className="label">Trial Progress</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.trial_progress || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        trial_progress: e.target.value,
                      })
                    }
                    min="0"
                    max="20"
                  />
                </div>
              </div>
              {user && user.role !== 'supplier' && (
                <div className="field">
                <label className="label">Trial Approval</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={taskData.trial_approval || ""}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          trial_approval: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>
              )}
              <div className="field">
                <label className="label">Harden & Coating Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, "harden_coating_image")}
                  />
                </div>
              </div>
			  {taskData.harden_coating_image && (
			    <div className="image-preview">
					<img
					  src={taskData.harden_coating_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field">
                <label className="label">Harden & Coating Progress</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.harden_coating_progress || ""}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        harden_coating_progress: e.target.value,
                      })
                    }
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              {user && user.role !== 'supplier' && ( 
                <div className="field">
                <label className="label">Harden & Coating Approval</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={taskData.harden_coating_approval || ""}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          harden_coating_approval: e.target.value,
                        })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>
              )}
              
              <div className="field">
                <div className="control">
				<Link to="/tasks" className="button is-danger mt-2 mr-3">
				  Kembali
				</Link>
                <button
                  type="submit"
                  className="button is-success"
                  style={{ marginTop: "7px" }} 
                >
                  Update Subtask
                </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditSubTasks;