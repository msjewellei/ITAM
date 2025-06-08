import React from "react";

interface DashboardCardProps {
  title: string;
  className?: string;
  value: number | string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  className = "",
  value,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center justify-center h-full ${className}`}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black">
        {value}
      </h1>
      <p className="text-sm text-gray-600 mt-4 sm:mt-6 md:mt-10">{title}</p>
    </div>
  );
};

export default DashboardCard;
