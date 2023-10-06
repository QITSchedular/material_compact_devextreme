import { Routes, Route, Navigate } from "react-router-dom";
import { SingleCard } from "./layouts";
import {
  LoginForm,
  ResetPasswordForm,
  ChangePasswordForm,
  CreateAccountForm,
} from "./components";

export default function UnauthenticatedContent() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <SingleCard
            title="Sign In"
            extraCustomClass={"login-main-wrapper"}
            headerText={"Welcome to Kuster"}
          >
            <LoginForm />
          </SingleCard>
        }
      />
      <Route
        path="/create-account"
        element={
          <SingleCard title="Create an account">
            <CreateAccountForm />
          </SingleCard>
        }
      />
      <Route
        path="/reset-password"
        element={
          <SingleCard
            title="Reset Password"
            description="Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
          >
            <ResetPasswordForm />
          </SingleCard>
        }
      />
      <Route
        path="/change-password/:recoveryCode"
        element={
          <SingleCard title="Change Password">
            <ChangePasswordForm />
          </SingleCard>
        }
      />
      <Route path="*" element={<Navigate to={"/login"} />}></Route>
    </Routes>
  );
}
