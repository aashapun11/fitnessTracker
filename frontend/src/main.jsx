import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider} from "@chakra-ui/react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import App from "./App";
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


ReactDOM.createRoot(document.getElementById("root")).render(
  
  <ChakraProvider>
  <BrowserRouter>
    <Routes>
      {/* Public route - no WorkoutProvider */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Protected routes - wrapped in WorkoutProvider */}
      <Route element={
        <WorkoutProvider>
          <ProtectedLayout />
        </WorkoutProvider>
      }>
         <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes */}
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
);
