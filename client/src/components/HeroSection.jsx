import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.jpg")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" className="max-h-14 lg:h-14 mt-20" />
      {/* <img src={"./studio-logo.png"} alt="" className="max-h-11 lg:h-11 mt-20" /> */}
      {/* <img src="/studio-logo.png" alt="" /> */}
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
        PUSHPA 2: <br />
        The Rule
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Thriller</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4.5 h-4.5" /> 2024
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4.5 h-4.5" /> 3h 21m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        The clash is on as Pushpa and Bhanwar Singh continue their rivalry in
        this epic conclusion to the two-parted action drama.
      </p>
      <button
        onClick={() => navigate("/movies")}
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;
