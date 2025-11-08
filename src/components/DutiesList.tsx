import { Duty } from "../models/Duty";

interface DutiesListProps {
  isLoading: boolean;
  groupedDuties: Record<string, Duty[]>;
  startDate: Date;
  sixDaysToDisplay: Date[];
  formatInternalDate: (date: Date) => string;
}

export const DutiesList = ({
  startDate,
  groupedDuties,
  sixDaysToDisplay,
  formatInternalDate,
  isLoading,
}: DutiesListProps) => {
  // const navigate = useNavigate();

  return (
    <>
      {/* Duties List - Mobile View */}
      <div className='space-y-4 md:hidden'>
        {isLoading ? (
          <div className='text-center text-gray-500 py-8'>
            <p className='text-lg'>Ładowanie dyżurów...</p>
          </div>
        ) : groupedDuties[formatInternalDate(startDate)]?.length > 0 ? (
          groupedDuties[formatInternalDate(startDate)].map((duty) => (
            <div
              key={duty.id}
              className='bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4 transition-all duration-200 ease-in-out hover:shadow-md'
              // onClick={() => navigate(`/form/${duty.id}`)}
            >
              <div className='flex-shrink-0 text-blue-600 font-semibold text-lg'>
                {duty.type.time}
              </div>
              <div className='flex-grow'>
                <p className='text-gray-900 font-medium text-lg leading-tight'>
                  {duty.type.name}
                </p>
                <p className='text-gray-500 font-medium text-lg leading-tight'>
                  {duty.type.address}
                </p>
                <dl className='text-gray-600 text-sm'>
                  <dt>Kurier: </dt>
                  <dd className='font-semibold text-blue-700'>
                    {duty.dutyWorker.name} {duty.dutyWorker.id}
                  </dd>
                </dl>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center text-gray-500 py-8'>
            <p className='text-lg'>Nie zaplanowano dyżurów na ten dzień.</p>
          </div>
        )}
      </div>

      {/* Duties List - Desktop View (5 days) */}
      <div className='hidden md:grid md:grid-cols-6 md:gap-4 lg:gap-6'>
        {isLoading ? (
          <div className='text-center text-gray-500 py-8'>
            <p className='text-lg'>Ładowanie dyżurów...</p>
          </div>
        ) : (
          sixDaysToDisplay.map((day) => (
            <div
              key={formatInternalDate(day)}
              className='flex flex-col bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4'
            >
              <h3 className='text-center text-lg font-semibold text-gray-800 mb-3'>
                {day.toLocaleDateString("pl", {
                  weekday: "short",
                  month: "numeric",
                  day: "numeric",
                })}
              </h3>
              <div className='flex-grow space-y-3'>
                {groupedDuties[formatInternalDate(day)]?.length > 0 ? (
                  groupedDuties[formatInternalDate(day)].map((duty) => (
                    <div
                      key={duty.id}
                      className='bg-white p-3 rounded-md shadow-xs border border-gray-100 transition-all duration-150 ease-in-out hover:shadow-sm cursor-pointer'
                      // onClick={() => navigate(`/form/${duty.id}`)}
                    >
                      <div className='text-gray-900 font-bold text-sm'>
                        {duty.type.time}
                      </div>
                      <div className='text-gray-500 font-medium text-sm'>
                        {duty.type.name}
                      </div>
                      <div className='text-gray-600 font-medium text-sm'>
                        {duty.type.address}
                      </div>
                      <div className='text-gray-600 text-xs'>
                        <span>Kurier: </span>
                        <span className='font-semibold text-blue-700'>
                          {duty.dutyWorker.name}{" "}
                        </span>
                        <span className='font-semibold text-blue-700'>
                          {duty.dutyWorker.id}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center text-gray-400 text-sm py-4'>
                    Nie zaplanowano dyżurów na ten dzień.
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
