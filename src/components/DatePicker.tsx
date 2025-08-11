interface DatePickerProps {
  startDate: Date;
  sixDaysToDisplay: Date[];
  goToPreviousPeriod: () => void;
  goToNextPeriod: () => void;
  isLoading: boolean;
}

export const DatePicker = ({
  goToPreviousPeriod,
  goToNextPeriod,
  sixDaysToDisplay,
  startDate,
  isLoading,
}: DatePickerProps) => {
  return (
    <div className='flex items-center justify-between mb-6'>
      <button
        onClick={goToPreviousPeriod}
        className='p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ease-in-out transform hover:scale-105'
        aria-label='Previous Period'
        disabled={isLoading}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 19l-7-7 7-7'
          />
        </svg>
      </button>
      {/* Mobile View: Single Day */}
      <h2 className='text-2xl md:hidden font-bold text-gray-800 text-center flex-grow mx-4'>
        {startDate.toLocaleDateString("pl", {
          weekday: "long",
        })}
        <br />
        {startDate.toLocaleDateString("pl", {
          month: "long",
          day: "numeric",
        })}
      </h2>
      {/* Desktop View: Date Range */}
      <h2 className='hidden md:block text-2xl md:text-3xl font-bold text-gray-800 text-center flex-grow mx-4'>
        {startDate.toLocaleDateString("pl", {
          month: "long",
          day: "numeric",
        })}{" "}
        -{" "}
        {sixDaysToDisplay[5]?.toLocaleDateString("pl", {
          month: "long",
          day: "numeric",
        })}
      </h2>
      <button
        onClick={goToNextPeriod}
        className='p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ease-in-out transform hover:scale-105'
        aria-label='Next Period'
        disabled={isLoading}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 5l7 7-7 7'
          />
        </svg>
      </button>
    </div>
  );
};
