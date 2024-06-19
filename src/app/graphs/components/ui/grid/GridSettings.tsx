import { useState } from "react";
import "./GridSettings.css";
import { IoSettingsOutline } from "react-icons/io5";

export default function GridSettings() {
  const [showWindow, setShowWindow] = useState<boolean>(false);

  const handleShowWindow = () => {
    setShowWindow(!showWindow);
  };
  return (
    <div className="grid-settings">
      <button
        className="flex items-center justify-center"
        onClick={handleShowWindow}
        disabled={false}
      >
        <IoSettingsOutline className="text-gray-400 h-5 w-5" />
      </button>
      {showWindow && (
        <div className="side-bar">
          Contenido de la Ventana Desplegable
        </div>
      )}
    </div>
  );
}
