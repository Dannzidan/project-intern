import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const FormEditTasks = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
  const [previousUrl, setPreviousUrl] = useState("");

  const [taskData, setTaskData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    task_image: null,
    assigned_mod: "",
    assigned_sup: ""
  });
  const [msg, setMsg] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dataModerator, setDataModerator] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getTasksById = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/tasks/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const task = response.data;
        const startDate = new Date(task.startDate).toISOString().split("T")[0];
        const endDate = new Date(task.endDate).toISOString().split("T")[0];

        setTaskData({
          ...task,
          startDate,
          endDate,
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getTasksById();
  }, [id]);


  const updateTasks = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${process.env.REACT_APP_BASE_URL}/tasks/${id}`, taskData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/tasks");
    } catch (error) {
      if (error.response) {
        setMsg("");
        setErrorMsg(error.response.data.msg);
        setIsErrorPopupVisible(true); 
      }
    }
  };

  
	const GetDetailModerator = async (rolem,roles) => {
		try {
		  const token = localStorage.getItem("token");
		  const response = await axios({
			url: `${process.env.REACT_APP_BASE_URL}/users/option?rolem=${rolem}&roles=${roles}`,
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			  Authorization: `Bearer ${token}`,
			},
		  });
		  const { moderator, supplier } = response.data;

			setDataModerator(moderator);
			setDataSupplier(supplier);
		} catch (error) {
		}
	};

	
  const handleImageChange = async (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 2 * 1024 * 1024; // 2 MB
  
      if (!allowedTypes.includes(file.type)) {
        setMsg("");
        setErrorMsg("Jenis gambar tidak didukung. Silakan unggah gambar JPEG atau PNG.");
        setIsErrorPopupVisible(true);
        e.target.value = null;
      } else if (file.size > maxSize) {
        setMsg("");
        setErrorMsg("Gambar harus kurang dari 2 MB.");
        setIsErrorPopupVisible(true);
        e.target.value = null;
      } else {
        try {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64Image = event.target.result;
            setTaskData({ ...taskData, ['task_image']: base64Image }); // Update taskData with base64 image data
            setMsg("");
            setErrorMsg("");
            setIsErrorPopupVisible(false);
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error("Error reading file:", error);
          setMsg("An error occurred while processing the image.");
          setErrorMsg("");
          setIsErrorPopupVisible(true);
        }
      }
    } else {
      setTaskData({ ...taskData, [key]: null });
      setSelectedImage(null);
    }
  };


  // Function to convert an image to base64
  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(image);
    });
  };
  
  useEffect(() => {
    setPreviousUrl(window.location.pathname);
    GetDetailModerator("moderator","supplier");
  }, []);
	if (msg === 'Edit Not Allowed' && !alertShown) {
	  const currentUrl = window.location.pathname;
	  navigate("/tasks");
	  if (currentUrl !== previousUrl) {
		setTimeout(function(){
			alert('Edit Tidak Bisa Dilakukan Karena Task Dibuat Oleh Admin');
		},500);
	  }
	  setAlertShown(true);
	}
  return (
    <div>
      <h1 className="title">Part Model</h1>
      <h2 className="subtitle">Edit Part Model</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateTasks}>
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
                <label className="label">Nama</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
					value={taskData['name']}
                    onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          ['name']: e.target.value,
                        })
                    }
                    placeholder="Nama Milestone"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Tanggal Mulai</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
					value={taskData['startDate']}
                    onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          ['startDate']: e.target.value,
                        })
                    }
                    placeholder="Start Date"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Tanggal Berakhir</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
					value={taskData['endDate']}
                    onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          ['endDate']: e.target.value,
                        })
                    }
                    placeholder="End Date"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Part Image</label>
                <div className="control">
                  <input
                    type="file"
                    className="input"
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
			  {taskData.task_image && (
			    <div className="image-preview">
					<img
					  src={taskData.task_image}
					  alt="Design Image"
					  style={{ width: '120px', height: '120px' }}
					/>
			    </div>
			  )}
              <div className="field" style={{ display: user && user.role === 'moderator' ? 'none' : 'block' }}>
                <label className="label">Assigned to PIC</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={taskData['assigned_mod']}
					  onChange={(e) => setTaskData({ ...taskData, ['assigned_mod']: e.target.value })}
                    >
						{dataModerator.length === 0 && (
						  <option value="" disabled>
							Data Tidak Ada
						  </option>
						)}
						{dataModerator.length > 0 && (
						  <option value="">
							Pilih Data Disini
						  </option>
						)}
						{dataModerator.map((moderatorOption) => (
						  <option key={moderatorOption.id} value={`${moderatorOption.id}-${moderatorOption.name}`} selected={taskData['assigned_mod'] === moderatorOption.id}>
							{moderatorOption.name}
						  </option>
						))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Assigned to Supplier</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={taskData['assigned_sup']}
					  onChange={(e) => setTaskData({ ...taskData, ['assigned_sup']: e.target.value })}
                    >
						{dataSupplier.length === 0 && (
						  <option value="" disabled>
							Data Tidak Ada
						  </option>
						)}
						{dataModerator.length > 0 && (
						  <option value="">
							Pilih Data Disini
						  </option>
						)}
						{dataSupplier.map((dataSupplier) => (
						  <option key={dataSupplier.id} value={`${dataSupplier.id}-${dataSupplier.name}`} selected={taskData['assigned_sup'] === dataSupplier.id}>
							{dataSupplier.name}
						  </option>
						))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
				<Link to="/tasks" className="button is-danger mb-2 mr-3">
				  Kembali
				</Link>
                  <button type="submit" className="button is-success">
                    Simpan
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

export default FormEditTasks;
