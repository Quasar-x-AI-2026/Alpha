import React from "react";

import { IoSpeedometer } from "react-icons/io5";
import { HiPaperAirplane } from "react-icons/hi";
import { PiTwitterLogoFill } from "react-icons/pi";

export default function Features() {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-16 py-20">
        
        {/* Card */}
        <div className="flex gap-3">
          <div>
            <HiPaperAirplane className="text-5xl text-c3" />
          </div>
          <div className="max-w-[250px]">
            <div className="font-bold">Nearby parking anytime</div>
            <div className="text-sm">
              Find available parking spaces around you using real-time location 
              and book instantly with ease.
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="flex gap-3">
          <div>
            <PiTwitterLogoFill className="text-5xl text-c3" />
          </div>
          <div className="max-w-[250px]">
            <div className="font-bold">Verified space owners</div>
            <div className="text-sm">
              All parking providers are approved by admin ensuring safe, 
              reliable and trusted parking spaces.
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="flex gap-3">
          <div>
            <IoSpeedometer className="text-5xl text-c3" />
          </div>
          <div className="max-w-[250px]">
            <div className="font-bold">Fast & simple booking</div>
            <div className="text-sm">
              Reserve parking slots in seconds, view pricing clearly 
              and manage your bookings easily.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
