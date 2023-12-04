import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "./Field";

const FormAddSubTasks = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [taskData, setTaskData] = useState({
    name: "",
    taskId: localStorage.getItem("idSubtask"),
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
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false); 
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const saveSubTasks = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_BASE_URL}/subtasks`, taskData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/tasks");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
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

  const fields = [
    {
      label: "Nama",
      key: "name",
      type: "text",
    },
    {
      label: "Tanggal Mulai",
      key: "startDate",
      type: "date",
    },
    {
      label: "Tanggal Berakhir",
      key: "endDate",
      type: "date",
    },
    {
      label: "Design Image",
      key: "design_image",
      type: "file",
      accept: "image/jpg, image/jpeg",
    },
    {
      label: "Design Progress",
      key: "design_progress",
      type: "number",
      max: 10,
    },
    {
      label: "Design Approval",
      key: "design_approval",
      type: "select",
    },
    {
      label: "Material Image",
      key: "material_image",
      type: "file",
      accept: "image/jpg, image/jpeg",
    },
    {
      label: "Material Progress",
      key: "material_progress",
      type: "number",
      max: 5,
    },
    {
      label: "Material Approval",
      key: "material_approval",
      type: "select",
    },
    {
      label: "Std Part Image",
      key: "std_part_image",
      type: "file",
      accept: "image/jpg, image/jpeg",
    },
    {
      label: "Standard Part Progress",
      key: "std_part_progress",
      type: "number",
      max: 5,
    },
    {
      label: "Standard Part Approval",
      key: "std_part_approval",
      type: "select",
    },
    {
      label: "Machining Image",
      key: "machining_image",
      type: "file",
      accept: "image/jpg, image/jpeg",
    },
    {
      label: "Machining Progress",
      key: "machining_progress",
      type: "number",
      max: 50,
    },
    {
      label: "Machining Approval",
      key: "machining_approval",
      type: "select",
    },
    {
      label: "Assembly Image",
      key: "assembly_image",
      type: "file",
      accept: "image/jpg, image/jpeg",
    },
    {
      label: "Assembly Progress",
      key: "assembly_progress",
      type: "number",
      max: 5,
    },
    {
      label: "Assembly Approval",
      key: "assembly_approval",
      type: "select",
    },
    {
      label: "Trial Image",
      key: "trial_image",
      type: "file",
      accept: "image/jpg, image/jpeg",
    },
    {
      label: "Trial Progress",
      key: "trial_progress",
      type: "number",
      max: 20,
    },
    {
      label: "Trial Approval",
      key: "trial_approval",
      type: "select",
    },
    {
      label: "Harden & Coating Image",
      key: "harden_coating_image",
      type: "file",
      accept: "image/jpg, image/jpeg",
    },
    {
      label: "Harden & Coating Progress",
      key: "harden_coating_progress",
      type: "number",
      max: 5,
    },
    {
      label: "Harden & Coating Approval",
      key: "harden_coating_approval",
      type: "select",
    },
  ];

  return (
    <div>
      <h1 className="title">Sub Tugas</h1>
      <h2 className="subtitle">Tambah Sub Tugas</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveSubTasks}>
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
              {fields.map(({ label, key, type, accept, max }) => (
                <div key={key}>
                  {type === "file" ? (
                    <div className="field">
                      <label className="label">{label}</label>
                      <input
                        type="file"
                        accept={accept}
                        onChange={(e) => handleImageChange(e, key)}
                      />
						<div className="image-preview">
							<img
							  src={taskData[key] || 'data:image/png;base64,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Tv04mvya/kHdSGtlsPWdqAbE84MPPihLt913333FerV8G4GNiQJo9eBJkiSgETEd3nh4wzc33njjMshfy7je5B9oUY0H8gC+W2jYazJMLySu8e72iXjAJEkGB/rBGtUJrkPcd61hYhrWazBwotrqIeC3ZiFJkmQktHob9cL/wwlkK30ZGFENWtUqSZIknaSbojphQ6rawYNGSJIkGQQmVVSTJEkGjRTVJEmSDpKimiRJ0kFSVJMkSTpIimqSJAOPXv5mYSJIUU2SJOkgKapJkiQdJEU1SZKkg6SoJkmSdJAU1SRJkg6SopokSdJBUlSTJEk6SIpqkiRJB0lRTZIk6SApqkmSJB0kRXWc5FqwSZLUSVFtg3jdrbfA1ucNeyPseIj36jS+WydJkv5lkfrq+50M/URd0OK7T88R4ll/nbbvhJYYjoU4b1xDaPc95b1KPIeQJFOZtFTbhIASU7BYCW0I8FggPl7RXRejfhbWtLqT5BOmzZ8/f8qXgLAY6999hjXqfeKPP/54ddlll5XX4n700Udl+/e///3yfxw7Gt57773qqquuqt5+++1y/CabbFLeXz5el0K3EAcqhXPOOad6//33q3fffbdaf/31q/33338o/pJkKpKWapsQvxtuuKG67777qgcffLC6+eabqzvuuGNM1mWIzsMPP1zdeeedJTz//PN9ZakSf8I6d+7c6rHHHqseffTR6pVXXhm3BZ8k/U6KapsQihkzZlSLL754teSSS1Yrrrhidd1111Wvvfbawj1GD3eCcwmLLbbYmCzeycK9qgQ8gyBebCO04ipCkkw1UlTbhIBEsz98qq+++mqxNkcLsXGOug8yztsviA8iKh5CWJOxkxXQ4JCi2iZEhIDUrcmVV165uummm4b8omOlXwuU++Ybfv3116u33nqrVAzJ+JCPxpOXksknRXUURGbX1NV5pXOGtcqfOJUEJSzrJZZYotp3332rQw45pPrxj39cbbXVVkNxlOIwOiKuxG1arf1Niuoo4QL44he/WG266abFQlMYdFyx2KaKiIRgavIT0u22267aYYcdyggG2/upw20yiXgMUkwHg8z9o4SFpiB861vfKv/zg86ZM6fveu87SYjBhx9+WD6T9gg/esRf+KlTXPubFNVREpn+C1/4QvXtb3+7+uCDD8oIgIceemjhHknSHkTUqA8Wv3xFZMONlMLav6SojoJ6U02n1e677178igrG/fffX7388stTvulLDFIQ2oOVauKEipmYylNCWKxJf5IzqhZABCITx3efMrfMrlOKaB555JHVcsstV62zzjrVP/zDP5QOq7POOqu65557SuH4wQ9+UO2yyy5lplHQqnDoLT/mmGOKlWufXXfdtQSFqpEQqfo9KohEfN68edU777xTfL2ONeZ1hRVWKCMTjKudSCJ+AiIR91+/Z9/do0/7LL300sU687/fPceLL75Yvfnmm8WFoJKyzyqrrFKtuuqq5TqOi+d3DfvxaXt+x/FpO04l5xjH+j/uYySc23XEo3PqgHR+6YqlllqqWnbZZUsLRWh89nZxP87/3HPPVS+99FKJF8/qnGuttVa10korDe2nI9Q1fPcs0rYV7t++8RzunUtK3DgPHO/8xljHdcbyDMnwpKguIAp3/bvPKDitRFUBfuCBB8pUTYVcofvXf/3XMnWVCCDO28hoRBX1AvP73/++zO564oknirgqcCE67hvhnvjGN75R7jMKZ6eI57rttttK4VWR6LQSN1FQIw4Jh8pHATf87O///u+LgPjfkLTbb7+9iGLEt+MEIrD55ptXe+65Z3kGz+jzhRdeKMdxuYRYxzhZ8WEfHYlaEtKrnecWh85rptzdd99dzoOIU8H9Ofdmm21W7bzzzm2fu84111xT3XrrreV547yC63he59bp59zylRlrfhO30lNebIX7kw/vuuuuavbs2WWGW6QFIn5VENtuu2219dZbl++jfYZkeBY97LDD/n3h9ylNiATiexQoQseqkFEVquWXX77acsstS0FmZVgX4I033iiZ2MgAghHUz1tH5jfNNUYNrLvuuiXI+M2I7cTkZz/7WRHjEFOWHmuEwPifheo7sXJfCmoU3E4QQuAZrIcQAkcA11xzzaF94tO9iDsi6n6++c1vlkrlqKOOKpWS+/K/34UQL5+mBZsGSyTFte9HH310ifOwVh2zwDgoViaRIBxPPfVU6UC0HsH06dPLvQwHQT3hhBPK/YhXlYQKwHlZqxF/Ph955JESt+7J9UYi4opIXn755aWFY5s0dP/SzvVsf/LJJ8s9bLDBBuU6LFrX/9KXvlS2tUIedZ4zzjijmjVrVnmGiFPP4FmcJyofwuvcX/va18q+xLouwMnYSVFdSF1w4nsUouFEVZBZFQYZk2gQF9+j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'}
							  alt="Design Image"
							  style={{ width: '120px', height: '120px' }}
							/>
						</div>
                    </div>
                  ) : type === "select" ? (
                    <div className="field">
                      <label className="label">{label}</label>
                      <div className="control">
                        <div className="select">
                          <select
                            value={taskData[key]}
                            onChange={(e) =>
                              setTaskData({
                                ...taskData,
                                [key]: e.target.value,
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
                  ) : type === "number" ? (
                    <Field
                      label={label}
                      value={taskData[key]}
                      onChange={(value) => {
                        // Validasi nilai progres sebelum mengubah taskData
                        const numericValue = parseFloat(value);
                        if (
                          !isNaN(numericValue) &&
                          numericValue >= 0 &&
                          numericValue <= max
                        ) {
                          setTaskData({
                            ...taskData,
                            [key]: numericValue,
                          });
                        }
                      }}
                      type={type}
                      min={0}
                      max={max}
                    />
                  ) : (
                    <div className="field">
                      <label className="label">{label}</label>
                      <div className="control">
                        <input
                          type={type}
                          className="input"
                          onChange={(e) =>
                            setTaskData({
                              ...taskData,
                              [key]: e.target.value,
                            })
                          }
                          placeholder={label}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="field">
                <div className="control">
				<Link to="/tasks" className="button is-danger mt-3 mr-3">
				  Kembali
				</Link>
                  <button type="submit" className="button mt-3 is-success">
                    Add Subtask
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

export default FormAddSubTasks;
