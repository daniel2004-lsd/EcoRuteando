import { useState } from "react";

function Navbar() {
  const [language, setLanguage] = useState("es");

  return (
    <nav className="w-full flex justify-end items-center p-3 bg-white shadow-md sticky top-0 z-50">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded px-2 py-1 text-sm sm:text-base"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </nav>
  );
}

export default Navbar;