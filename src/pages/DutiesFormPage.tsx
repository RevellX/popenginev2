import { useEffect, useState } from "react";
import DutyForm from "../components/DutyForm";
import { Duty } from "../models/Duty";
import { useParams } from "react-router";

export const DutiesFormPage = () => {
  const [duty, setDuty] = useState<Duty | null>(null);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  console.log("DutiesFormPage rendered with id:", id);

  useEffect(() => {
    // Simulate fetching duties from an API or database
    if (id) {
      setIsLoading(true);
      fetch("https://api.revellx-engine.pl/v1/duties/" + id)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setDuty(data);
        })
        .catch((error) => {
          console.error("Error fetching duty:", error);
          // Fallback to mock data if fetch fails
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  return (
    <>
      {isLoading && (
        <div className='flex items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500'></div>
          <p className='ml-3 text-gray-700'>Pobieranie danych...</p>
        </div>
      )}
      {!isLoading && <DutyForm initialDuty={duty ?? undefined} />}
    </>
  );
};
