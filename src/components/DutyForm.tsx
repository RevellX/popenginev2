import React, { useState, useEffect } from "react";
import { DutyWorker } from "../models/DutyWorker";
import { DutyType } from "../models/DutyType";
import { Duty } from "../models/Duty";

interface DutyFormProps {
  // Optional prop for editing an existing duty. If provided, the form acts as an editor.
  initialDuty?: Duty & { id?: string }; // id is optional for new duties, but present for existing ones
  //   onSubmitSuccess: (message: string) => void;
  //   onError: (message: string) => void;
}

interface DutyData {
  date: string; // YYYY-MM-DD format
  dutyWorkerId: string; // ID of the duty worker
  dutyTypeId: string; // ID of the duty type
}

const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const API_BASE_URL = "https://api.revellx-engine.pl/v1";

const DutyForm: React.FC<DutyFormProps> = ({
  initialDuty,
  //   onSubmitSuccess,
  //   onError,
}) => {
  // State for form fields
  const [date, setDate] = useState(getTodayDate());
  const [dutyWorkerId, setDutyWorkerId] = useState("");
  const [dutyTypeId, setDutyTypeId] = useState("");

  // State for fetched data
  const [dutyWorkers, setDutyWorkers] = useState<DutyWorker[]>([]);
  const [dutyTypes, setDutyTypes] = useState<DutyType[]>([]);

  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Effect to populate form fields if an initialDuty is provided (for editing)
  useEffect(() => {
    if (initialDuty) {
      setDate(initialDuty.date);
      setDutyWorkerId(initialDuty.dutyWorker.id);
      setDutyTypeId(initialDuty.type.id);
    }
  }, [initialDuty]);

  // Effect to fetch duty workers and duty types when the component mounts
  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [workersResponse, typesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/dutyWorkers`),
          fetch(`${API_BASE_URL}/dutyTypes`),
        ]);

        if (!workersResponse.ok) {
          throw new Error(
            `Failed to fetch duty workers: ${workersResponse.statusText}`
          );
        }
        if (!typesResponse.ok) {
          throw new Error(
            `Failed to fetch duty types: ${typesResponse.statusText}`
          );
        }

        const workersData: DutyWorker[] = await workersResponse.json();
        const typesData: DutyType[] = await typesResponse.json();

        setDutyWorkers(workersData);
        setDutyTypes(typesData);

        // Set default values if not in edit mode or if initial values are not set
        if (!initialDuty) {
          if (workersData.length > 0) setDutyWorkerId(workersData[0].id);
          if (typesData.length > 0) setDutyTypeId(typesData[0].id);
        }
      } catch (error: any) {
        setFetchError(`Error fetching data: ${error.message}`);
        // onError(`Error fetching data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, [initialDuty /*onError*/]); // Re-run if initialDuty changes (e.g., switching between edit items)

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFetchError(null); // Clear any previous error

    const dutyPayload: DutyData = {
      date,
      dutyWorkerId: dutyWorkerId,
      dutyTypeId: dutyTypeId,
    };

    const method = initialDuty && initialDuty.id ? "PUT" : "POST";
    const url =
      initialDuty && initialDuty.id
        ? `${API_BASE_URL}/duties/${initialDuty.id}`
        : `${API_BASE_URL}/duties`;
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dutyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `API request failed with status ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Duty submitted successfully:", responseData);
      //   const successMessage =
      //     initialDuty && initialDuty.id
      //       ? "Duty updated successfully!"
      //       : "New duty added successfully!";
      //   onSubmitSuccess(successMessage);

      // Optionally reset form for new duty submission after success
      if (!initialDuty) {
        setDate("");
        if (dutyWorkers.length > 0) setDutyWorkerId(dutyWorkers[0].id);
        if (dutyTypes.length > 0) setDutyTypeId(dutyTypes[0].id);
      }
    } catch (error: any) {
      setFetchError(`Submission error: ${error.message}`);
      //   onError(`Submission error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500'></div>
        <p className='ml-3 text-gray-700'>Pobieranie danych...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md'>
        <p className='font-bold'>Error:</p>
        <p>{fetchError}</p>
        <p className='mt-2'>
          Coś poszło nie tak podczas pobierania danych. Spróbuj ponownie
          później.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200 font-inter'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
        {initialDuty ? "Edytowanie dużuru" : "Dodawanie dyżuru"}
      </h2>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Date Input */}
        <div>
          <label
            htmlFor='date'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Data
          </label>
          <input
            type='date'
            id='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out'
          />
        </div>

        {/* Duty Type Select */}
        <div>
          <label
            htmlFor='dutyType'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Typ dyżuru
          </label>
          <select
            id='dutyType'
            value={dutyTypeId}
            onChange={(e) => setDutyTypeId(e.target.value)}
            required
            className='mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition duration-150 ease-in-out'
          >
            <option value=''>-- wybierz typ --</option>
            {dutyTypes.length === 0 ? (
              <option value='' disabled>
                Brak dostępnych typów dyżurów
              </option>
            ) : (
              dutyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} {type.time}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Duty Worker Select */}
        <div>
          <label
            htmlFor='dutyWorker'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Kurier
          </label>
          <select
            id='dutyWorker'
            value={dutyWorkerId}
            onChange={(e) => setDutyWorkerId(e.target.value)}
            required
            className='mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition duration-150 ease-in-out'
          >
            <option value=''>-- wybierz kuriera --</option>
            {dutyWorkers.length === 0 ? (
              <option value=''>Brak dostępnych kurierów</option>
            ) : (
              dutyWorkers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} {worker.id}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={
            isSubmitting ||
            isLoading ||
            dutyWorkers.length === 0 ||
            dutyTypes.length === 0
          }
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting ||
            isLoading ||
            dutyWorkers.length === 0 ||
            dutyTypes.length === 0
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          } transition duration-150 ease-in-out`}
        >
          {isSubmitting ? (
            <div className='flex items-center'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
              <span className='ml-2'>
                {initialDuty ? "Edytowanie..." : "Dodawanie..."}
              </span>
            </div>
          ) : initialDuty ? (
            "Edytuj dyżur"
          ) : (
            "Dodaj dyżur"
          )}
        </button>
      </form>
    </div>
  );
};

export default DutyForm;
