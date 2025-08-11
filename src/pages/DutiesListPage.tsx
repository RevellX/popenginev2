import { useEffect, useMemo, useRef, useState } from "react";
import { DatePicker } from "../components/DatePicker";
import { DutiesList } from "../components/DutiesList";
import { Duty } from "../models/Duty";

// Helper function to format a Date object into YYYY-MM-DD string
const formatInternalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to parse a YYYY-MM-DD string into a Date object
// const parseInternalDate = (dateString: string): Date => {
//   const [year, month, day] = dateString.split("-").map(Number);
//   return new Date(year, month - 1, day); // Month is 0-indexed for Date constructor
// };

// Helper function to get an array of 5 consecutive dates starting from a given date
const getSixDaysArray = (startDate: Date): Date[] => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i);
    if (newDate.getDay() == 0) {
      continue;
    }
    days.push(newDate);
  }
  return days;
};

const getCurrentDate = (): Date => {
  const d = new Date();
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d;
};
export const DutiesListPage = () => {
  // State to hold the start date of the currently displayed 5-day range (for desktop)
  // For mobile, this will effectively be the single day displayed
  const [startDate, setStartDate] = useState<Date>(getCurrentDate());
  // State to hold all duties (using mock data for now)
  const [duties, setDuties] = useState<Duty[]>([]);
  // State to manage loading state while fetching duties
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // To store the timeout ID
  const throttleTimeoutRef = useRef<number | null>(null);
  // To track if we're currently throttled
  const isThrottledRef = useRef<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://api.revellx-engine.pl/v1/duties")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the data is an array of Duty objects
        setDuties(data);
      })
      .catch((error) => {
        console.error("Error fetching duties:", error);
        // Fallback to mock data if fetch fails
      })
      .finally(() => {
        // Set the start date to today after fetching duties
        setIsLoading(false);
      });
  }, []);

  // Determine the 5 days to display based on the startDate
  const sixDaysToDisplay = useMemo(
    () => getSixDaysArray(startDate),
    [startDate]
  );

  // Group duties by date for efficient rendering
  const groupedDuties = useMemo(() => {
    const groups: { [key: string]: Duty[] } = {};
    duties.forEach((duty) => {
      if (!groups[duty.date]) {
        groups[duty.date] = [];
      }
      groups[duty.date].push(duty);
    });
    // Sort duties within each day by time
    for (const date in groups) {
      groups[date].sort((a, b) => a.type.time.localeCompare(b.type.time));
    }
    return groups;
  }, [duties]);

  // Function to navigate to the previous 7-day period (or single day on mobile)
  const goToPreviousPeriod = () => {
    // Only proceed if not currently throttled
    if (isThrottledRef.current) {
      return;
    }

    isThrottledRef.current = true; // Set throttle flag to true
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      // On desktop, move back 7 days; on mobile, move back 1 day
      const daysToMove = window.innerWidth >= 768 ? 7 : 1; // 768px is Tailwind's 'md' breakpoint
      newDate.setDate(prevDate.getDate() - daysToMove);
      if (newDate.getDay() == 0) newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
    // Set a timeout to reset the throttle flag after a delay (e.g., 500ms)
    throttleTimeoutRef.current = setTimeout(() => {
      isThrottledRef.current = false;
    }, 100); // Adjust this delay as needed (e.g., 300ms, 1000ms)
  };

  // Function to navigate to the next 7-day period (or single day on mobile)
  const goToNextPeriod = () => {
    // Only proceed if not currently throttled
    if (isThrottledRef.current) {
      return;
    }

    isThrottledRef.current = true; // Set throttle flag to true
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      // On desktop, move forward 7 days; on mobile, move forward 1 day
      const daysToMove = window.innerWidth >= 768 ? 7 : 1; // 768px is Tailwind's 'md' breakpoint
      newDate.setDate(prevDate.getDate() + daysToMove);
      if (newDate.getDay() == 0) newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
    // Set a timeout to reset the throttle flag after a delay (e.g., 500ms)
    throttleTimeoutRef.current = setTimeout(() => {
      isThrottledRef.current = false;
    }, 100); // Adjust this delay as needed (e.g., 300ms, 1000ms)
  };

  return (
    <>
      <DatePicker
        goToPreviousPeriod={goToPreviousPeriod}
        goToNextPeriod={goToNextPeriod}
        startDate={startDate}
        sixDaysToDisplay={sixDaysToDisplay}
        isLoading={isLoading}
      />

      <DutiesList
        startDate={startDate}
        groupedDuties={groupedDuties}
        sixDaysToDisplay={sixDaysToDisplay}
        formatInternalDate={formatInternalDate}
        isLoading={isLoading}
      />
    </>
  );
};
