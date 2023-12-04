import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const formatDate = (date) => {
  if (!date) {
    return null;
  }

  const formattedDate = new Date(date).toISOString().split('T')[0];
  return formattedDate;
};

const FormEditTrial = () => {
  const { id } = useParams();
  const [taskData, setTaskData] = useState({
    name: "",
    part_name: "",
    visual_image: "",
    tanggalIn: null,
    tanggalCek: null,
    quantity: 0,
    status: "",
    remark_image: "",
    note: null,
  });
  const [msg, setMsg] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [inputLength, setInputLength] = useState(0); // State untuk melacak panjang teks input
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getTrialtaskId = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/trial-tasks-by-uuid/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const trialData = response.data;

        setTaskData({
          ...trialData,
          tanggalIn: formatDate(trialData.tanggalIn),
          tanggalCek: formatDate(trialData.tanggalCek),
        });
      } catch (error) {
        if (error.response) {
          setMsg("");
          setErrorMsg(error.response.data.msg);
          setIsErrorPopupVisible(true);
        }
      }
    };
    getTrialtaskId();
  }, [id]);

  const saveTrialTasks = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/trial-tasks/${id}`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/trial-tasks");
    } catch (error) {
      if (error.response) {
        setMsg("");
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

  const handleNoteChange = (e) => {
    const inputValue = e.target.value;
    setInputLength(inputValue.length);

    if (inputValue.length > 250) {
      setErrorMsg("Anda telah melebihi 250 karakter.");
      setIsErrorPopupVisible(true);
    } else {
      setTaskData({
        ...taskData,
        note: inputValue,
      });
      setErrorMsg("");
      setIsErrorPopupVisible(false);
    }
  };

  return (
    <div>
      <h1 className="title">Report Trial</h1>
      <h2 className="subtitle">Edit Report Trial</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveTrialTasks}>
              <p className="has-text-centered">{msg}</p>
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
                <label className="label">Supplier Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={taskData.name}
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
                <label className="label">Part Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={taskData.part_name}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        part_name: e.target.value,
                      })
                    }
                    placeholder="Part Name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Visual Part Image</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg"
                    onChange={(e) => handleImageChange(e, 'visual_image')}
                  />
                </div>
                {taskData.visual_image && (
                  <div className="image-preview">
                    <img
                      src={taskData.visual_image}
                      alt="Image"
                      style={{ width: "120px", height: "120px" }}
                    />
                  </div>
                )}
              </div>
              <div className="field">
                <label className="label">Qty</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={taskData.quantity}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        quantity: e.target.value,
                      })
                    }
                    min="0"
                    max="200"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Status</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={taskData.status}
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Not Yet">Not Yet</option>
                      <option value="NG">NG</option>
                      <option value="OK">OK</option>
                    </select>
                  </div>
                </div>
              </div>
              {user && user.role !== 'supplier' && (
                <div className="field">
                  <label className="label">Note</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={taskData.note}
                      onChange={handleNoteChange} 
                      placeholder="Maksimum 250 karakter"
                    />
                    <p>{inputLength}/250</p> 
                  </div>
                </div>
              )}
              <div className="field">
                <label className="label">PICA</label>
                <div className="control">
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={(e) => handleImageChange(e, 'remark_image')}
                  />
                </div>
                {taskData.remark_image && (
                  <div className="image-preview">
                    <img
                      src={taskData.remark_image}
                      alt="Image"
                      style={{ width: "120px", height: "120px" }}
                    />
                  </div>
                )}
              </div>
              <div className="field">
                <label className="label">Tanggal Masuk</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={taskData.tanggalIn || null}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        tanggalIn: e.target.value,
                      })
                    }
                  />
                </div>
              </div> 
              <div className="field">
                <label className="label">Tanggal Cek</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={taskData.tanggalCek || null}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        tanggalCek: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <div>
                    <Link to="/trial-tasks" className="button is-danger mt-2 mr-3">
                      Kembali
                    </Link>
                    <button
                      type="submit"
                      className="button is-success"
                      style={{ marginTop: "7px" }}
                    >
                      Update Report Trial
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditTrial;
