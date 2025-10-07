import React, { useState, useEffect } from "react";

export default function Setting() {
  const [pinEnabled, setPinEnabled] = useState(false);
  const [appPin, setAppPin] = useState("");

  useEffect(() => {
    const savedPin = localStorage.getItem("appPin");
    if (savedPin) {
      setAppPin(savedPin);
      setPinEnabled(true);
    }
  }, []);

  const handleSetPin = () => {
    if (appPin) {
      const oldPin = prompt("Enter your current PIN:");
      if (oldPin !== appPin) {
        alert("❌ Incorrect PIN!");
        return;
      }
    }

    const newPin = prompt("Enter new 4–6 digit PIN:");
    if (newPin && /^\d{4,6}$/.test(newPin)) {
      localStorage.setItem("appPin", newPin);
      setAppPin(newPin);
      setPinEnabled(true);
      alert("✅ PIN set successfully!");
    } else {
      alert("❌ PIN must be 4–6 digits.");
    }
  };

  const handleRemovePin = () => {
    const oldPin = prompt("Enter your current PIN to remove lock:");
    if (oldPin !== appPin) {
      alert("❌ Incorrect PIN!");
      return;
    }

    localStorage.removeItem("appPin");
    setAppPin("");
    setPinEnabled(false);
    alert("🔓 App Lock disabled.");
  };

  const handleAppLockToggle = () => {
    if (pinEnabled) {
      handleRemovePin();
    } else {
      handleSetPin();
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
        App Lock Settings 🔐
      </h2>

      {/* App Lock Toggle */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700 dark:text-gray-300">
          App Lock is {pinEnabled ? "Enabled" : "Disabled"}
        </p>
        <button
          onClick={handleAppLockToggle}
          className={`px-4 py-2 rounded-lg font-medium ${pinEnabled
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
            }`}
        >
          {pinEnabled ? "Disable Lock" : "Enable Lock"}
        </button>
      </div>

      {/* Change PIN */}
      {pinEnabled && (
        <button
          onClick={handleSetPin}
          className="w-full text-left px-4 py-2 mt-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
        >
          🔄 Change PIN
        </button>
      )}

      {/* Reset PIN */}
      {pinEnabled && (
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset PIN?")) {
              localStorage.removeItem("appPin");
              setAppPin("");
              setPinEnabled(false);
              alert("PIN has been reset.");
            }
          }}
          className="w-full text-left px-4 py-2 mt-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
        >
          ♻️ Reset PIN
        </button>
      )}
    </div>
  );
}
