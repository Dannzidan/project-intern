import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Userlist = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {

    const token = localStorage.getItem("token")
    const response = await axios({
      url : `${process.env.REACT_APP_BASE_URL}/users`,
      method: "GET",
      headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
      }
    });

    setUsers(response.data);
  };

  const deleteUser = async (userId) => {
      const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) {
          return; 
        }

    const token = localStorage.getItem("token")
    await axios({
      url : `${process.env.REACT_APP_BASE_URL}/users/${userId}`,
      method: "DELETE",
      headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`
      }
    });

    getUsers();
  };

  return (
    <div>
      <h1 className="title">Users</h1>
      <h2 className="subtitle">Daftar User</h2>
      <Link to="/users/add" className="button is-primary mb-2">
        Tambah User Baru
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.uuid}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td style={{
                color: user.role === 'admin' ? 'green' : user.role === 'supplier' || user.role === 'moderator' ? 'gray' : 'black',
                fontWeight: user.role === 'admin' || user.role === 'supplier' || user.role === 'moderator' ? 'bold' : 'normal',
              }}>
                {user.role}
              </td>


              <td>
                <Link
                  to={`/users/edit/${user.uuid}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteUser(user.uuid)}
                  className="button is-small is-danger"
                  style={{ marginRight: "1px", marginLeft: "1px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Userlist;
