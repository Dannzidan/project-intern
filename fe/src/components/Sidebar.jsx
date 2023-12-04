import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IoPeopleSharp,
  IoDuplicate,
  IoBarChart,
  IoLogOut,
  IoDocuments,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import "../sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const handleMenuItemClick = (menuName) => {
    setActiveMenuItem(menuName);
  };

  return (
    <div>
      <aside className="menu pl-2 has-shadow">
        <p className="menu-label">General</p>
        <ul className="menu-list">
          <li>
            <NavLink
              to={"/dashboard"}
              className={`menu-link ${
                activeMenuItem === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleMenuItemClick("dashboard")}
            >
              <IoBarChart /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/tasks"}
              className={`menu-link ${
                activeMenuItem === "tasks" ? "active" : ""
              }`}
              onClick={() => handleMenuItemClick("tasks")}
            >
              <IoDuplicate /> Part Model
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/trial-tasks"}
              className={`menu-link ${
                activeMenuItem === "trial-tasks" ? "active" : ""
              }`}
              onClick={() => handleMenuItemClick("trial-tasks")}
            >
              <IoDocuments /> Report Trial
            </NavLink>
          </li>
        </ul>
        {user && user.role === "admin" && (
          <div>
            <p className="menu-label">Admin</p>
            <ul className="menu-list">
              <li>
                <NavLink
                  to={"/users"}
                  className={`menu-link ${
                    activeMenuItem === "users" ? "active" : ""
                  }`}
                  onClick={() => handleMenuItemClick("users")}
                >
                  <IoPeopleSharp /> Users
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        <p className="menu-label">Log Out</p>
        <ul className="menu-list">
          <li>
            <button onClick={logout} className="button is-danger is-responsive">
              <IoLogOut /> Log Out
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
