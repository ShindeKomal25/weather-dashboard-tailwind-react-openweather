import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const Tabs = ({ activeTab, onChangeTab, isDark, setIsDark }) => {
  const tabs = ["Today", "Week", "Map"];

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4">
      {/* Tabs */}
      <div className="flex space-x-8" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChangeTab(tab)}
            className={`pb-3 font-semibold text-sm ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 hover:text-blue-600"
            } transition-colors duration-200`}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dark Mode Toggle with tooltip */}
      <button
        type="button"
        onClick={() => setIsDark((prev) => !prev)}
        className="
          relative
          text-gray-600 dark:text-gray-300 
          hover:text-black dark:hover:text-white 
          p-2 rounded-full 
          transition 
          duration-300 
          ease-in-out
          flex items-center justify-center
        "
        aria-label="Toggle Dark Mode"
      >
        <span
          className={`transition-transform duration-500 ${
            isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0 absolute"
          }`}
        >
          <FiMoon size={20} />
        </span>
        <span
          className={`transition-transform duration-500 ${
            isDark ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"
          }`}
        >
          <FiSun size={20} />
        </span>

        {/* Tooltip */}
        {/* <span className="absolute bottom-full mb-2 w-max rounded bg-gray-700 text-white text-xs px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100">
          {isDark ? "Enable Light Mode" : "Enable Dark Mode"}
        </span> */}
      </button>
    </div>
  );
};

export default Tabs;
