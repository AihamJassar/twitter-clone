import { BrowserRouter, Routes, Route } from "react-router";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import HomePage from "./pages/Home/HomePage";
import SignupPage from "./pages/auth/signupPage";
import LoginPage from "./pages/auth/LoginPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <RightPanel />
      </BrowserRouter>
    </div>
  );
}

export default App;
