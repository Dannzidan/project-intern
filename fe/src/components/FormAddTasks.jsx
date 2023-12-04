import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
  
const FormAddTasks = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [taskImage, setTaskImage] = useState(null);
  const [moderator, setModerator] = useState("");
  const [supplier, setSupplier] = useState("");
  const [msg, setMsg] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false); 
  const [errorMsg, setErrorMsg] = useState(""); 
  const [dataModerator, setDataModerator] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  
  const navigate = useNavigate();
  
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
	
  const saveTasks = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const imageBase64 = taskImage ? await convertImageToBase64(taskImage) : null;

      const taskData = {
        assigned_mod: moderator,
        assigned_sup: supplier,
        name: name,
        startDate: startDate,
        endDate: endDate,
        task_image: imageBase64, // Send image as a base64-encoded string
      };

      await axios.post(`${process.env.REACT_APP_BASE_URL}/tasks`, taskData, {
        headers: {
          'Content-Type': 'application/json',
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


  const handleImageChange = (e) => {
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
        setTaskImage(file);
        setErrorMsg(""); 
        setIsErrorPopupVisible(false); 
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }else {
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
    if (user && user.role === 'moderator') {
      setModerator(user.id + '-' + user.name);
    }
    GetDetailModerator("moderator","supplier");
  }, []);
  
  return (
    <div>
      <h1 className="title">Project Model</h1>
      <h2 className="subtitle">Tambah Project Model Baru</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveTasks}>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Model"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Tanggal Mulai</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
			  {selectedImage && (
			    <div className="image-preview">
					<img
					  src={selectedImage}
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
                      value={user && user.role === 'moderator' ? user.id+'-'+user.name : moderator}
                      onChange={(e) => setModerator(user && user.role === 'moderator' ? user.id+'-'+user.name : e.target.value)}
                    >
						{dataModerator.length === 0 && (
						  <option value={user && user.role === 'moderator' ? user.id+'-'+user.name : ''} disabled>
							Data Tidak Ada
						  </option>
						)}
						{dataModerator.length > 0 && (
						  <option value="">
							Pilih Data Disini
						  </option>
						)}
						{dataModerator.map((moderatorOption) => (
						  <option key={moderatorOption.id} value={`${moderatorOption.id}-${moderatorOption.name}`}>
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
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
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
						  <option key={dataSupplier.id} value={`${dataSupplier.id}-${dataSupplier.name}`}>
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

export default FormAddTasks;
