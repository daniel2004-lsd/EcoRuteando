import { useState } from "react";

function Navbar() {
  const [language, setLanguage] = useState("es");

  return (
    <nav className="w-full p-4 flex justify-end bg-white shadow relative z-50">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </nav>
  );
}

export default Navbar;