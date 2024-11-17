import React, { useState } from "react";

const Layout: React.FC<{ children: [React.ReactNode, React.ReactNode] }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const toggleDarkMode = () => {
        setDarkMode((prevDarkMode) => !prevDarkMode);
    }
    return (
        <div className={`flex flex-col md:flex-row h-screen max-h-screen dark:bg-black dark:text-white ${darkMode && "dark"}`}>
            <div className="h-1/2 md:h-full md:w-1/2 p-4 border-r">{children[0]}</div>
            <div className="h-1/2 md:h-full md:w-1/2 p-4 overflow-y-auto">{children[1]}</div>
            <button onClick={toggleDarkMode} className="absolute bottom-16 right-16 px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black">
                Switch to {darkMode ? "Light" : "Dark"} mode
            </button>
        </div>
    );
};

export default Layout;
