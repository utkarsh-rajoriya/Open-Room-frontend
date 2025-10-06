import { Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./components/Hero";
import PillNav from "./components/PillNav";
import RippleCursor from "./stylings/RippleCursor";
import Room from "./components/Room";
import logo from "/Open-Room-logo.png";
import { useEffect, useState } from "react";
import ViewRooms from "./components/ViewRooms";
import ViewMembersInfo from "./components/ViewMembersInfo";

const App = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [user, setUser] = useState(null);
  const [navTabs, setNavTabs] = useState([
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]);

  const fetchUserInfo = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/user-info`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (response.status === 401 || data === undefined || data.error) {
      setNavTabs([
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ]);
      setUser(null);
      localStorage.removeItem("email");
      localStorage.removeItem("clientChatId");
      return;
    }

    if (!data.error) {
      setUser(data.userInfo);
      localStorage.setItem("email", data.userInfo.email);
      localStorage.setItem("clientChatId", data.clientChatId);
      setNavTabs([
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Rooms", href: "/viewRooms" },
      ]);
    }
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
      setUser(null);
      localStorage.removeItem("email");
      localStorage.removeItem("clientChatId");
       setNavTabs([
         { label: "Home", href: "/" },
         { label: "About", href: "/about" },
        ]);
        window.location.href = "/";
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
          items={navTabs}
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
        <Route path="/" element={<Hero user={user} />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/viewRooms" element={<ViewRooms />} />
        <Route path="/viewMembersInfo/:roomId" element={<ViewMembersInfo />} />
      </Routes>
    </div>
  );
};

export default App;
