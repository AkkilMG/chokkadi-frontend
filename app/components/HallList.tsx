import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Hall } from "../booking/types";

interface HallListProps {
  halls: Hall[];
  onDateSelect: (hallId: number, date: string) => void;
}

interface AvailabilityData {
  date: string;
  reason: string;
  isBooked: boolean;
}

interface APIResponse {
  statusCode: number;
  message: string;
  data: {
    date: string;
    reason: string;
    is_booked: boolean;
    hall: {
      hall_id: number;
      name: string;
    };
  }[];
}

const HallList: React.FC<HallListProps> = ({ halls, onDateSelect }) => {
  const [availabilityData, setAvailabilityData] = useState<{
    [hallId: string]: AvailabilityData[];
  }>({});
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`/api/halls/availability`);
      const result: APIResponse = await response.json();

      if (result.statusCode === 200) {
        const groupedData: { [hallId: string]: AvailabilityData[] } = {};

        result.data.forEach((item) => {
          const hallId = item.hall.hall_id;
          if (!groupedData[hallId]) {
            groupedData[hallId] = [];
          }
          groupedData[hallId].push({
            date: item.date.split("T")[0],
            reason: item.reason || "Available",
            isBooked: item.is_booked,
          });
        });

        setAvailabilityData(groupedData);
      } else {
        console.error("Failed to fetch availability data");
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const getDaysInMonth = (month: number, year: number): string[] => {
    const days = [];
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      if (date >= new Date()) {
        days.push(date.toISOString().split("T")[0]);
      }
    }
    return days;
  };

  const handlePrevMonth = () => {
    if (
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      return;
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const today = new Date();
    const maxMonth = today.getMonth() + 2;
    const maxYear = today.getFullYear() + Math.floor(maxMonth / 12);

    if (currentMonth === maxMonth % 12 && currentYear === maxYear) {
      return;
    }
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  return (
    <div className="grid grid-cols-1 gap-4 justify-center">
      {halls.map((hall) => (
        <div
          key={hall.hall_id}
          className="border p-4 rounded-lg text-center shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-700">{hall.name}</h2>
          <p className="text-gray-600 text-sm">{hall.description}</p>
          <div className="mt-2">
            {hall.images.length > 0 ? (
              hall.images.map((imageUrl, index) => (
                <Image
                  key={index}
                  src={imageUrl}
                  alt={hall.name}
                  className="w-full rounded-lg"
                  width={500}
                  height={300}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Availability Calendar</h3>
            <div className="flex justify-between mb-4 items-center">
              <button
                onClick={handlePrevMonth}
                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ${
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear()
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={
                  currentMonth === new Date().getMonth() &&
                  currentYear === new Date().getFullYear()
                }
              >
                Previous
              </button>
              <span className="font-medium text-gray-700">
                {new Date(currentYear, currentMonth).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {currentYear}
              </span>
              <button
                onClick={handleNextMonth}
                className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ${
                  currentMonth === (new Date().getMonth() + 2) % 12 &&
                  currentYear ===
                    new Date().getFullYear() +
                      Math.floor((new Date().getMonth() + 2) / 12)
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={
                  currentMonth === (new Date().getMonth() + 2) % 12 &&
                  currentYear ===
                    new Date().getFullYear() +
                      Math.floor((new Date().getMonth() + 2) / 12)
                }
              >
                Next
              </button>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {daysInMonth.map((day) => {
                const availability = availabilityData[hall.hall_id]?.find(
                  (data) => data.date === day
                );
                return (
                  <div key={day} className="text-center">
                    <button
                      onClick={() =>
                        !availability?.isBooked &&
                        onDateSelect(hall.hall_id, day)
                      }
                      className={`p-3 rounded-lg w-full ${
                        availability?.isBooked
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                      disabled={availability?.isBooked}
                    >
                      <span>{new Date(day).getDate()}</span>
                    </button>
                    {availability?.isBooked && (
                      <div className="text-xs mt-1 text-red-500">
                        {availability.reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HallList;
