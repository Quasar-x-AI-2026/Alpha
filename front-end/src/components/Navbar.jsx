import React from "react";
import { NavLink } from "react-router-dom";
import Chatbot from "./chatbot/Chatbot";

export default function Navbar() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 z-40 flex justify-between w-full px-10 py-5 text-white bg-opacity-90 bg-c1 backdrop-blur-md">
        <div className="text-xl font-bold tracking-wide">
          SmartPark
        </div>

        <div className="flex items-center gap-6 text-base font-medium">
          <NavLink
            to="/"
            className="hover:text-gray-300 transition"
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid white" : "",
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/manage-space"
            className="hover:text-gray-300 transition"
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid white" : "",
            })}
          >
            Manage Space
          </NavLink>

          <NavLink
            to="/rent-space"
            className="hover:text-gray-300 transition"
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid white" : "",
            })}
          >
            Rent Space
          </NavLink>

          <NavLink
            to="/admin"
            className="hover:text-gray-300 transition"
            style={({ isActive }) => ({
              borderBottom: isActive ? "2px solid white" : "",
            })}
          >
            Admin
          </NavLink>
        </div>
      </nav>

      {/* CHATBOT */}
      <Chatbot />
    </>
  );
}
