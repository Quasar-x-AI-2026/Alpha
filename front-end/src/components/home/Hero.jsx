import React from "react";
import { NavLink } from "react-router-dom";

import Button from "../form/Button";

export default function Hero() {
  return (
    <section className="px-10 py-20 bg-c1">
      <div className="flex flex-wrap-reverse justify-around gap-20 p-1 bg-cover bg-1">
        
        {/* Content */}
        <div className="text-white w-[500px] flex flex-col justify-center gap-10">
          <h1 className="text-5xl font-bold text-center">
            Find & Book Parking Spaces Near You
          </h1>

          <p className="text-center">
            Discover nearby parking spots in real time, reserve instantly, 
            and enjoy hassle-free parking wherever you go. Our platform connects 
            drivers with trusted space owners for safe and affordable parking.
          </p>

          <NavLink to="/rent-space">
            <Button className="w-full p-1 py-3 mx-auto md:py-2 bg-c2">
              Find Nearby Parking Now
            </Button>
          </NavLink>
        </div>

        {/* Image */}
        <div>
          <img
            src="assets/images/hero-img.svg"
            className="max-h-[450px]"
            alt="Parking illustration"
          />
        </div>

      </div>
    </section>
  );
}
