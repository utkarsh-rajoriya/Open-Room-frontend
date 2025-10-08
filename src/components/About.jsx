import { useEffect } from "react";
import Aurora from "../stylings/Aurora";

const About = () => {
  // Use useEffect to run animations once the component mounts
  useEffect(() => {
    // Dynamically load GSAP script
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.onload = () => {
      // Animate the main container in
      gsap.from(".content-container", {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: "power3.out",
      });

      // Animate the image with a little bounce
      gsap.from(".profile-image", {
        duration: 1.2,
        opacity: 0,
        scale: 0.5,
        ease: "elastic.out(1, 0.75)",
        delay: 0.3,
      });

      // Stagger the text animations
      gsap.from(".text-element", {
        duration: 0.8,
        opacity: 0,
        y: 20,
        ease: "power2.out",
        stagger: 0.2,
        delay: 0.5,
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-white bg-transparent overflow-hidden">
      {/* Background Aurora Effect */}
      <div className="absolute top-0 left-0 w-full h-[90vh] z-0">
        <Aurora
          colorStops={["#17153B", "#009fff", "#433D8B"]}
          blend={0.02}
          amplitude={0.4}
          speed={0.8}
        />
      </div>

      {/* Content Container */}
      <div className="content-container relative z-10 max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 bg-transparent bg-opacity-25 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        {/* Left Side: Image and Name */}
        <div className="flex flex-col items-center text-center flex-shrink-0">
          <img
            src="https://res.cloudinary.com/dtf1quyas/image/upload/v1759899547/utkarsh-rounded-png_yrygm3.png"
            alt="Utkarsh Rajoriya"
            className="profile-image w-48 h-48 md:w-64 md:h-64 object-cover shadow-lg mb-5 filter brightness-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/256x256/17153B/FFFFFF?text=UR";
            }}
          />
          <h1 className="text-element text-3xl md:text-4xl font-bold text-white">
            Utkarsh Rajoriya
          </h1>
          <p className="text-element text-lg text-cyan-300 tracking-wide">
            Creator of OpenRoom
          </p>
        </div>

        {/* Right Side: Application Description */}
        <div className="flex flex-col text-center md:text-left">
          <h2 className="text-element text-5xl md:text-6xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              OpenRoom
            </span>
          </h2>
          <p className="text-element text-base md:text-lg text-gray-200 leading-relaxed max-w-lg">
            OpenRoom lets you build the dynamic space you need — for focused
            work, collaborative study, or creative play. With just a single
            click, you can instantly create, connect, and collaborate in an
            environment tailored to your goals. We've removed the barriers and
            distractions, offering a seamless platform where your productivity
            and creativity can flourish. No limits, no friction — just your
            perfect room, ready when you are.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
