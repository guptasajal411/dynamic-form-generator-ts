import React from "react";

const Layout: React.FC<{ children: [React.ReactNode, React.ReactNode] }> = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="md:w-1/2 p-4 border-r">{children[0]}</div>
            <div className="md:w-1/2 p-4">{children[1]}</div>
        </div>
    );
};

export default Layout;
