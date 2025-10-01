import { Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./components/Hero";
import PillNav from "./components/PillNav";
import RippleCursor from "./stylings/RippleCursor";
import Room from "./components/Room";
import logo from "/Open-Room-logo.png";
import { useEffect, useState } from "react";

const App = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [user, setUser] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/user-info`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        console.log("error : Unauthorized ", response.status);
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem('email',data.email);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Logout failed: ${response.status}`);
      console.log(await response.text());
      setUser(null);
      localStorage.removeItem('email');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div>
      <div className="flex-row">
        <PillNav
          user={user}
          logout={handleLogout}
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
