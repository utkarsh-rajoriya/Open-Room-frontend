import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./components/Hero";
import PillNav from "./components/PillNav";
import RippleCursor from "./stylings/RippleCursor";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";

const App = () => {
  const logo =
    "https://png.pngtree.com/png-clipart/20240717/original/pngtree-creative-logo-design-illustration-png-image_15579132.png";
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
        <Route path="/createRoom" element={<CreateRoom />} />
        <Route path="/joinRoom" element={<JoinRoom />} />
      </Routes>
    </div>
  );
};

export default App;
