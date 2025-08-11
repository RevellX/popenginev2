import { DutiesListPage } from "./pages/DutiesListPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { RootLayout } from "./pages/RootLayout";
import { DutiesFormPage } from "./pages/DutiesFormPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<DutiesListPage />} />
          <Route path='form' element={<DutiesFormPage />} />
          <Route path='form/:id' element={<DutiesFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
