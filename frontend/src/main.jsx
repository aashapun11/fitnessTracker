
import ReactDOM from "react-dom/client";
import { ChakraProvider} from "@chakra-ui/react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import {GoogleOAuthProvider } from '@react-oauth/google';

import ProgressGraph from "./components/MyProgressGraph";
import WorkoutList from "./components/WorkoutList";
import WorkoutProvider from "./Context/WorkoutProvider";
import UpdateWorkout from "./components/UpdateWorkout";
import WorkoutForm from "./components/WorkoutFrom";
import SignUpForm from "./components/Authentication/SignUpForm";
import LoginForm from "./components/Authentication/LoginForm";
import LandingPage from "./components/LandingPage";
import ProtectedLayout from "./components/ProtectedLayout";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import VerifyEmailPage from "./components/VerifyEmailPage";
import ForgotPasswordForm from "./components/Authentication/ForgotPasswordForm";
import ResetPasswordForm from "./components/Authentication/ResetPasswordForm";
import VerificationPending from "./components/Authentication/VerificationPending";
import CompleteProfile from "./components/Authentication/CompleteProfile";
import Dashboard from "./components/Dashboard";


ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

  
  <ChakraProvider>
  <BrowserRouter>
    <Routes>
      {/* Public route - no WorkoutProvider */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verification-pending" element={<VerificationPending />} />

      {/* Protected routes - wrapped in WorkoutProvider */}
      <Route element={
        <WorkoutProvider>
          <ProtectedLayout />
        </WorkoutProvider>
      }>
         <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />



            {/* Protected Routes */}
            <Route path="/complete-profile" element={
              <PrivateRoute>
                <CompleteProfile />
              </PrivateRoute>
            } />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            
            <Route path="/workoutForm" element={
              <PrivateRoute>
                <WorkoutForm />
              </PrivateRoute>
            } />

            <Route path="/progressGraph" element={
              <PrivateRoute>
                <ProgressGraph />
              </PrivateRoute>
            } />

            <Route path="/workoutList" element={
              <PrivateRoute>
                <WorkoutList />
              </PrivateRoute>
            } />

            <Route path="/updateWorkout/:id" element={
              <PrivateRoute>
                <UpdateWorkout />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
  </BrowserRouter>
</ChakraProvider>
  </GoogleOAuthProvider>

);
