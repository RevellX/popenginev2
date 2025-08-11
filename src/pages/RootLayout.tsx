import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-4 font-inter'>
      <div className='w-full max-w-md md:max-w-full bg-white rounded-xl shadow-2xl p-6 md:p-8'>
        {/* App Header */}
        <h1 className='text-4xl font-extrabold text-center text-blue-700 mb-8 tracking-tight'>
          Pop-Engine
        </h1>
        <Outlet />
      </div>
    </div>
  );
};
