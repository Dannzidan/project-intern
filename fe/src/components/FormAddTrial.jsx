import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const FormAddTrial = () => {
  const [name, setName] = useState("");
  const [partName, setPartName] = useState("");
  const [visualImage, setVisualImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 
  const navigate = useNavigate();

  const saveTasks = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const imageBase64 = visualImage ? await convertImageToBase64(visualImage) : null;

      const taskData = {
        name: name,
        part_name: partName, 
        visual_image: imageBase64, // Send image as a base64-encoded string
      };

      await axios.post(`${process.env.REACT_APP_BASE_URL}/trial-tasks`, taskData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/trial-tasks");
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
        setMsg(""); // Hapus pesan kesalahan lainnya
        setErrorMsg("Jenis gambar tidak didukung. Silakan unggah gambar JPEG atau PNG.");
        setIsErrorPopupVisible(true); 
        e.target.value = null;
      } else if (file.size > maxSize) {
        setMsg(""); 
        setErrorMsg("Gambar harus kurang dari 2 MB.");
        setIsErrorPopupVisible(true); 
        e.target.value = null;
      } else {
        setVisualImage(file);
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

  return (
    <div>
      <h1 className="title">Report Trial</h1>
      <h2 className="subtitle">Tambah Report Model Baru</h2>
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
                    placeholder="Nama Supplier"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Nama Part/Part Number</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="Part Name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Visual Part</label>
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
              <div className="field">
                <div className="control">
                <Link to="/trial-tasks" className="button is-danger mr-3">
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

export default FormAddTrial;
