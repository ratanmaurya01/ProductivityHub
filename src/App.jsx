import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/layout/Layout";
import { LockScreen } from "./components/LockScreen";
function App() {
  const [locked, setLocked] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  // Request notification permission on app load

  // useEffect(() => {
  //   if ("Notification" in window) {
  //     if (Notification.permission === "default") {
  //       Notification.requestPermission();
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   const savedPin = localStorage.getItem("appPin");
  //   setIsPinSet(!!savedPin);
  //   const unlocked = sessionStorage.getItem("appUnlocked");
  //   if (!savedPin || unlocked === "true") {
  //     setLocked(false);
  //   } else {
  //     setLocked(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   let timer;
  //   const lockApp = () => {
  //     if (isPinSet) setLocked(true);
  //   };
  //   const resetTimer = () => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => lockApp(), 1000 * 60 * 5);
  //   };
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) lockApp();
  //   };
  //   window.addEventListener("mousemove", resetTimer);
  //   window.addEventListener("keydown", resetTimer);
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   resetTimer();
  //   return () => {
  //     clearTimeout(timer);
  //     window.removeEventListener("mousemove", resetTimer);
  //     window.removeEventListener("keydown", resetTimer);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [isPinSet]);

  return (
    <AppProvider>
      <ErrorBoundary>
        <Router>
          {isPinSet && locked ? (
            <LockScreen onUnlock={() => setLocked(false)} />
          ) : (
            <Layout />
          )}
        </Router>
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;
