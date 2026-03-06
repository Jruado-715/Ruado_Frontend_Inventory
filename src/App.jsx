// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root: wraps everything in AppProvider, routes between auth and dashboard.

import { useApp, AppProvider } from "./AppContext";
import GlobalStyle from "./styles/GlobalStyle";

// Auth
import AuthLayout                     from "./components/auth/AuthLayout";
import LoginPanel                     from "./components/auth/LoginPanel";
import SignupPanel                    from "./components/auth/SignupPanel";
import { ForgotPanel, ForgotSuccess } from "./components/auth/ForgotPanel";

// Dashboard
import DashboardLayout from "./DashboardLayout";

import { useState } from "react";

const Inner = () => {
  const { currentUser, logout } = useApp();
  const [screen, setScreen] = useState("login");

  // ── Authenticated ──
  if (currentUser) {
    return (
      <>
        <GlobalStyle />
        <DashboardLayout onLogout={() => { logout(); setScreen("login"); }} />
      </>
    );
  }

  // ── Auth screen ──
  const authContent = () => {
    switch (screen) {
      case "signup":
        return (
          <SignupPanel
            onLogin={() => setScreen("login")}
          />
        );
      case "forgot":
        return <ForgotPanel onBack={() => setScreen("login")} onSent={() => setScreen("forgotSent")} />;
      case "forgotSent":
        return <ForgotSuccess onBack={() => setScreen("login")} />;
      default:
        return (
          <LoginPanel
            onForgot={() => setScreen("forgot")}
            onSignup={() => setScreen("signup")}
          />
        );
    }
  };

  return (
    <>
      <GlobalStyle />
      <AuthLayout>{authContent()}</AuthLayout>
    </>
  );
};

const App = () => (
  <AppProvider>
    <Inner />
  </AppProvider>
);

export default App;
