import React from "react";
import { NavLink } from "react-router-dom";

import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="px-10 pt-16 pb-10 text-sm text-white bg-c1">
      <div className="flex flex-wrap justify-around gap-16">

        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xl font-bold">SmartPark</div>
          <div className="max-w-[300px] text-center">
            A smart parking platform that connects space owners with drivers.
            Find, book, and manage parking spaces easily and securely.
          </div>

          <div className="flex gap-3 hover:[&_div]:border-gray-400">
            <NavLink to="">
              <div className="p-2 border border-white rounded-full">
                <FaTwitter />
              </div>
            </NavLink>
            <NavLink to="">
              <div className="p-2 border border-white rounded-full">
                <FaFacebook />
              </div>
            </NavLink>
            <NavLink to="">
              <div className="p-2 border border-white rounded-full">
                <FaInstagram />
              </div>
            </NavLink>
            <NavLink to="">
              <div className="p-2 border border-white rounded-full">
                <FaLinkedin />
              </div>
            </NavLink>
          </div>
        </div>

        {/* Links */}
        <div className="text-center md:text-left">
          <div className="mb-4 font-bold">Useful Links</div>
          <div className="flex flex-col gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/manage-space">Manage Space</NavLink>
            <NavLink to="/rent-space">Rent Space</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </div>
        </div>

        {/* Services */}
        <div className="text-center md:text-left">
          <div className="mb-4 font-bold">Our Services</div>
          <div className="flex flex-col gap-2">
            <NavLink to="">Nearby parking search</NavLink>
            <NavLink to="">Slot booking system</NavLink>
            <NavLink to="">Space owner management</NavLink>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center md:text-left">
          <div className="mb-4 font-bold">Contact Us</div>
          <div className="flex flex-col gap-2 mb-4">
            IIIT Bhagalpur <br />
            Bhagalpur, Bihar <br />
            India
          </div>
          <div>
            <span className="font-bold">Email:</span> support@smartpark.com
          </div>
        </div>

      </div>

      <div className="flex flex-col items-center mt-20">
        <div>
          &copy; {new Date().getFullYear()}
          <span className="font-bold"> SmartPark</span>. All Rights Reserved
        </div>
        <div>Designed by SmartPark Team</div>
      </div>
    </footer>
  );
}
