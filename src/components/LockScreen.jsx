// // components/LockScreen.jsx
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// export const LockScreen = ({ onUnlock }) => {
//   const [enteredPin, setEnteredPin] = useState("");
//   const [error, setError] = useState("");
//   const [storedPin, setStoredPin] = useState("");

//   useEffect(() => {
//     const savedPin = localStorage.getItem("appPin") || "1234";
//     setStoredPin(savedPin);
//   }, []);

//   const handleUnlock = (e) => {
//     e.preventDefault();
//     if (enteredPin === storedPin) {
//       setError("");
//       onUnlock();
//     } else {
//       setError("❌ Incorrect PIN. Try again.");
//     }
//   };

//   const handleResetPin = () => {
//     if (window.confirm("Reset to default PIN (1234)?")) {
//       localStorage.setItem("appPin", "1234");
//       alert("PIN reset to default: 1234");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900/95 text-white z-[9999]">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//         className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-80 text-center"
//       >
//         <h2 className="text-2xl font-bold mb-4">🔒 App Locked</h2>
//        <form onSubmit={handleUnlock}>
//          <input
//           type="password"
//           value={enteredPin}
//           onChange={(e) => setEnteredPin(e.target.value)}
//           placeholder="Enter your PIN"
//           className="w-full p-3 mb-3 text-center rounded-lg text-gray-900"
//           maxLength={6}
//         />
//         {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-2 rounded-lg font-semibold"
//         >
//           Unlock
//         </button>
//        </form>

//         <button
//           onClick={handleResetPin}
//           className="mt-3 text-sm text-gray-400 hover:text-gray-200 underline"
//         >
//           Forgot PIN?
//         </button>
//       </motion.div>
//     </div>
//   );
// };



import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const LockScreen = ({ onUnlock }) => {
    const [enteredPin, setEnteredPin] = useState("");
    const [error, setError] = useState("");
    const [storedPin, setStoredPin] = useState("");
    const [isPinSet, setIsPinSet] = useState(false);

    useEffect(() => {
        const savedPin = localStorage.getItem("appPin");
        if (savedPin) {
            setStoredPin(savedPin);
            setIsPinSet(true);
        } else {
            setIsPinSet(false);
        }
    }, []);


    const handleUnlock = (e) => {
        e.preventDefault();
        if (enteredPin === storedPin) {
            setError("");
            sessionStorage.setItem("appUnlocked", "true"); // remember unlocked state
            onUnlock();
        } else {
            setError("❌ Incorrect PIN. Try again.");
        }
    };



    const handleSetPin = (e) => {
        e.preventDefault();
        if (/^\d{4,6}$/.test(enteredPin)) {
            localStorage.setItem("appPin", enteredPin);
            setStoredPin(enteredPin);
            setIsPinSet(true);
            setEnteredPin("");
            alert("✅ PIN set successfully!");
            onUnlock();
        } else {
            setError("❌ PIN must be 4–6 digits.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/95 text-white z-[9999]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-80 text-center"
            >
                <h2 className="text-2xl font-bold mb-4">{isPinSet ? "🔒 App Locked" : "🔑 Set a PIN"}</h2>
                <form onSubmit={isPinSet ? handleUnlock : handleSetPin}>


                    <input
                        type="password"
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value)}
                        placeholder={isPinSet ? "Enter your PIN" : "Enter new 4–6 digit PIN"}
                        className="w-full p-3 mb-3 text-center rounded-lg order-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={6}
                    />

                    {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-2 rounded-lg font-semibold"
                    >
                        {isPinSet ? "Unlock" : "Set PIN"}
                    </button>
                </form>

                {isPinSet && (
                    <button
                        onClick={() => {
                            if (window.confirm("Reset to default PIN (1234)?")) {
                                localStorage.setItem("appPin", "1234");
                                alert("✅ PIN reset to default: 1234");
                                setStoredPin("1234");
                                setEnteredPin("");
                            }
                        }}
                        className="mt-3 text-sm text-gray-400 hover:text-gray-200 underline"
                    >
                        Forgot PIN?
                    </button>
                )}
            </motion.div>
        </div>
    );
};
