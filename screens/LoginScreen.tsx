import React, { useState } from "react";
import Login from "../components/Login";
import OTPVerification from "../components/OTPVerification";

export default function LoginScreen() {
  const [screen, setScreen] = useState("login");
  const [confirmation, setConfirmation] = useState(null);

  const handleNavigateToOTP = (confirmation) => {
    setConfirmation(confirmation);
    setScreen("otp");
  };
  const handleNavigateBack = () => setScreen("login");

  return (
    <>
      {screen === "login" ? (
        <Login key="login" onNavigateToOTP={handleNavigateToOTP} />
      ) : (
        <OTPVerification
          confirmation={confirmation}
          onNavigateBack={handleNavigateBack}
        />
      )}
    </>
  );
}
