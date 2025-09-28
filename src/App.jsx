import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./components/Hero";
import PillNav from "./components/PillNav";
import RippleCursor from "./stylings/RippleCursor";
import Room from "./components/Room";
import logo from '/Open-Room-logo.png'

const App = () => {
  return (
    <div>
      <div className="flex-row">
        <PillNav
          logo={logo}
          logoAlt="Company Logo"
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/a" },
            { label: "Services", href: "/s" },
            { label: "Contact", href: "/c" },
          ]}
          activeHref="/"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#17153B"
          pillColor="white"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#17153B"
        />
      </div>
      <RippleCursor />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </div>
  );
};

export default App;
