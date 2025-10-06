// import React, { useState, useEffect, useRef } from 'react';
// import { useApp } from '../context/AppContext';
// import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
// import { format, startOfDay, endOfDay } from 'date-fns';

// export const PomodoroTimer = () => {
//   const { preferences, focusSessions, addFocusSession } = useApp();
//   const [seconds, setSeconds] = useState(preferences.pomodoroDuration * 60);
//   const [isActive, setIsActive] = useState(false);
//   const [sessionType, setSessionType] = useState('focus'); // 'focus' | 'break'
//   const intervalRef = useRef(null);

//   const totalSeconds =
//     sessionType === 'focus' ? preferences.pomodoroDuration * 60 : preferences.breakDuration * 60;

//   useEffect(() => {
//     if (isActive && seconds > 0) {
//       intervalRef.current = setInterval(() => {
//         setSeconds((s) => s - 1);
//       }, 1000);
//     } else if (seconds === 0 && isActive) {
//       handleSessionComplete();
//     } else {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isActive, seconds]);

//   const handleSessionComplete = () => {
//     setIsActive(false);

//     addFocusSession({
//       duration: sessionType === 'focus' ? preferences.pomodoroDuration : preferences.breakDuration,
//       sessionType,
//     });

//     if (sessionType === 'focus') {
//       setSessionType('break');
//       setSeconds(preferences.breakDuration * 60);
//     } else {
//       setSessionType('focus');
//       setSeconds(preferences.pomodoroDuration * 60);
//     }
//   };

//   const toggleTimer = () => setIsActive(!isActive);
//   const resetTimer = () => {
//     setIsActive(false);
//     setSeconds(totalSeconds);
//   };

//   const minutes = Math.floor(seconds / 60);
//   const displaySeconds = seconds % 60;
//   const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

//   const today = new Date();
//   const todaySessions = focusSessions.filter(
//     (s) =>
//       s.completedAt >= startOfDay(today) &&
//       s.completedAt <= endOfDay(today) &&
//       s.sessionType === 'focus'
//   );

//   const totalFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
//   const completedSessionsCount = todaySessions.length;

//   return (
//     <div className="h-full overflow-y-auto p-6">
//       <div className="max-w-2xl mx-auto">
//         <div className="mb-6">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Focus Timer</h2>
//           <p className="text-gray-600">Stay focused with the Pomodoro technique</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
//           <div className="flex items-center justify-center mb-4">
//             <span
//               className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                 sessionType === 'focus'
//                   ? 'bg-blue-100 text-blue-700'
//                   : 'bg-green-100 text-green-700'
//               }`}
//             >
//               {sessionType === 'focus' ? 'Focus Session' : 'Break Time'}
//             </span>
//           </div>

//           <div className="relative w-64 h-64 mx-auto mb-8">
//             <svg className="transform -rotate-90 w-64 h-64">
//               <circle cx="128" cy="128" r="120" stroke="#e5e7eb" strokeWidth="8" fill="none" />
//               <circle
//                 cx="128"
//                 cy="128"
//                 r="120"
//                 stroke={sessionType === 'focus' ? '#3b82f6' : '#10b981'}
//                 strokeWidth="8"
//                 fill="none"
//                 strokeDasharray={`${2 * Math.PI * 120}`}
//                 strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
//                 className="transition-all duration-1000"
//               />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-6xl font-bold text-gray-900">
//                   {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
//                 </div>
//                 <div className="text-sm text-gray-500 mt-2">
//                   {sessionType === 'focus' ? 'minutes of focus' : 'minutes of break'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center gap-4">
//             <button
//               onClick={toggleTimer}
//               className={`px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
//                 isActive
//                   ? 'bg-orange-500 hover:bg-orange-600'
//                   : sessionType === 'focus'
//                   ? 'bg-blue-600 hover:bg-blue-700'
//                   : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {isActive ? (
//                 <>
//                   <Pause className="inline mr-2" size={20} />
//                   Pause
//                 </>
//               ) : (
//                 <>
//                   <Play className="inline mr-2" size={20} />
//                   Start
//                 </>
//               )}
//             </button>
//             <button
//               onClick={resetTimer}
//               className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
//             >
//               <RotateCcw className="inline mr-2" size={20} />
//               Reset
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
//             <div className="flex items-center gap-3 mb-2">
//               <Clock size={24} />
//               <h3 className="font-semibold">Total Focus Time Today</h3>
//             </div>
//             <p className="text-4xl font-bold">{totalFocusTime} min</p>
//             <p className="text-sm text-blue-100 mt-2">Keep up the great work!</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
//             <div className="flex items-center gap-3 mb-2">
//               <Clock size={24} />
//               <h3 className="font-semibold">Sessions Completed</h3>
//             </div>
//             <p className="text-4xl font-bold">{completedSessionsCount}</p>
//             <p className="text-sm text-green-100 mt-2">{format(today, 'MMMM d, yyyy')}</p>
//           </div>
//         </div>

//         <div className="mt-6 bg-gray-50 rounded-xl p-6">
//           <h3 className="font-bold text-gray-900 mb-3">Recent Sessions</h3>
//           {todaySessions.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No focus sessions completed today yet</p>
//           ) : (
//             <div className="space-y-2">
//               {todaySessions.slice(-5).reverse().map((session) => (
//                 <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full" />
//                     <span className="text-gray-700 font-medium">{session.duration} minute session</span>
//                   </div>
//                   <span className="text-gray-500 text-sm">{format(session.completedAt, 'h:mm a')}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };



// import React, { useState, useEffect, useRef } from 'react';
// import { useApp } from '../context/AppContext';
// import { Play, Pause, RotateCcw, Clock, Timer } from 'lucide-react';
// import { format, startOfDay, endOfDay } from 'date-fns';

// export const PomodoroTimer = () => {
//   const { preferences, focusSessions, addFocusSession } = useApp();
//   const [customFocus, setCustomFocus] = useState(preferences.pomodoroDuration);
//   const [customBreak, setCustomBreak] = useState(preferences.breakDuration);

//   const [focusDuration, setFocusDuration] = useState(preferences.pomodoroDuration);
//   const [breakDuration, setBreakDuration] = useState(preferences.breakDuration);

//   const [seconds, setSeconds] = useState(focusDuration * 60);
//   const [isActive, setIsActive] = useState(false);
//   const [sessionType, setSessionType] = useState('focus'); // 'focus' | 'break'
//   const intervalRef = useRef(null);

//   const totalSeconds = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;

//   useEffect(() => {
//     if (isActive && seconds > 0) {
//       intervalRef.current = setInterval(() => {
//         setSeconds((s) => s - 1);
//       }, 1000);
//     } else if (seconds === 0 && isActive) {
//       handleSessionComplete();
//     } else {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isActive, seconds]);

//   const handleSessionComplete = () => {
//     setIsActive(false);

//     addFocusSession({
//       duration: sessionType === 'focus' ? focusDuration : breakDuration,
//       sessionType,
//     });

//     if (sessionType === 'focus') {
//       setSessionType('break');
//       setSeconds(breakDuration * 60);
//     } else {
//       setSessionType('focus');
//       setSeconds(focusDuration * 60);
//     }
//   };

//   const toggleTimer = () => setIsActive(!isActive);

//   const resetTimer = () => {
//     setIsActive(false);
//     setSeconds(totalSeconds);
//   };

//   const applyCustomTimer = () => {
//     setFocusDuration(Number(customFocus));
//     setBreakDuration(Number(customBreak));
//     setIsActive(false);
//     setSessionType('focus');
//     setSeconds(Number(customFocus) * 60);
//   };

//   const minutes = Math.floor(seconds / 60);
//   const displaySeconds = seconds % 60;
//   const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

//   const today = new Date();
//   const todaySessions = focusSessions.filter(
//     (s) =>
//       s.completedAt >= startOfDay(today) &&
//       s.completedAt <= endOfDay(today) &&
//       s.sessionType === 'focus'
//   );

//   const totalFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
//   const completedSessionsCount = todaySessions.length;

//   return (
//     <div className="h-full overflow-y-auto p-6">
//       <div className="max-w-2xl mx-auto">
//         <div className="mb-6">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Focus Timer</h2>
//           <p className="text-gray-600">Stay focused with the Pomodoro technique</p>
//         </div>

//         {/* Custom Timer Section */}
//         <div className="bg-gray-100 rounded-xl p-6 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Timer size={20} className="text-blue-600" />
//             <h3 className="font-semibold text-gray-800 text-lg">Custom Timer</h3>
//           </div>

//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Focus Duration (min)
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 value={customFocus}
//                 onChange={(e) => setCustomFocus(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Break Duration (min)
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 value={customBreak}
//                 onChange={(e) => setCustomBreak(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
//               />
//             </div>
//           </div>

//           <button
//             onClick={applyCustomTimer}
//             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
//           >
//             Apply Custom Timer
//           </button>
//         </div>

//         {/* Timer Display */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
//           <div className="flex items-center justify-center mb-4">
//             <span
//               className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                 sessionType === 'focus'
//                   ? 'bg-blue-100 text-blue-700'
//                   : 'bg-green-100 text-green-700'
//               }`}
//             >
//               {sessionType === 'focus' ? 'Focus Session' : 'Break Time'}
//             </span>
//           </div>

//           <div className="relative w-64 h-64 mx-auto mb-8">
//             <svg className="transform -rotate-90 w-64 h-64">
//               <circle cx="128" cy="128" r="120" stroke="#e5e7eb" strokeWidth="8" fill="none" />
//               <circle
//                 cx="128"
//                 cy="128"
//                 r="120"
//                 stroke={sessionType === 'focus' ? '#3b82f6' : '#10b981'}
//                 strokeWidth="8"
//                 fill="none"
//                 strokeDasharray={`${2 * Math.PI * 120}`}
//                 strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
//                 className="transition-all duration-1000"
//               />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-6xl font-bold text-gray-900">
//                   {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
//                 </div>
//                 <div className="text-sm text-gray-500 mt-2">
//                   {sessionType === 'focus' ? 'minutes of focus' : 'minutes of break'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center gap-4">
//             <button
//               onClick={toggleTimer}
//               className={`px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
//                 isActive
//                   ? 'bg-orange-500 hover:bg-orange-600'
//                   : sessionType === 'focus'
//                   ? 'bg-blue-600 hover:bg-blue-700'
//                   : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {isActive ? (
//                 <>
//                   <Pause className="inline mr-2" size={20} />
//                   Pause
//                 </>
//               ) : (
//                 <>
//                   <Play className="inline mr-2" size={20} />
//                   Start
//                 </>
//               )}
//             </button>
//             <button
//               onClick={resetTimer}
//               className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
//             >
//               <RotateCcw className="inline mr-2" size={20} />
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
//             <div className="flex items-center gap-3 mb-2">
//               <Clock size={24} />
//               <h3 className="font-semibold">Total Focus Time Today</h3>
//             </div>
//             <p className="text-4xl font-bold">{totalFocusTime} min</p>
//             <p className="text-sm text-blue-100 mt-2">Keep up the great work!</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
//             <div className="flex items-center gap-3 mb-2">
//               <Clock size={24} />
//               <h3 className="font-semibold">Sessions Completed</h3>
//             </div>
//             <p className="text-4xl font-bold">{completedSessionsCount}</p>
//             <p className="text-sm text-green-100 mt-2">{format(today, 'MMMM d, yyyy')}</p>
//           </div>
//         </div>

//         {/* Recent Sessions */}
//         <div className="mt-6 bg-gray-50 rounded-xl p-6">
//           <h3 className="font-bold text-gray-900 mb-3">Recent Sessions</h3>
//           {todaySessions.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No focus sessions completed today yet</p>
//           ) : (
//             <div className="space-y-2">
//               {todaySessions.slice(-5).reverse().map((session) => (
//                 <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full" />
//                     <span className="text-gray-700 font-medium">{session.duration} minute session</span>
//                   </div>
//                   <span className="text-gray-500 text-sm">{format(session.completedAt, 'h:mm a')}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };




import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, Clock, Timer } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';

export const PomodoroTimer = () => {
  const { preferences, focusSessions, addFocusSession } = useApp();

  // 🧠 Load from localStorage or fallback to preferences
  const getStoredDurations = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('pomodoroDurations'));
      if (saved && saved.focus && saved.break) return saved;
    } catch {}
    return {
      focus: preferences.pomodoroDuration,
      break: preferences.breakDuration,
    };
  };

  const { focus, break: breakTime } = getStoredDurations();

  // State for durations and custom inputs
  const [focusDuration, setFocusDuration] = useState(focus);
  const [breakDuration, setBreakDuration] = useState(breakTime);
  const [customFocus, setCustomFocus] = useState(focus);
  const [customBreak, setCustomBreak] = useState(breakTime);

  const [seconds, setSeconds] = useState(focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('focus');
  const intervalRef = useRef(null);

  const totalSeconds = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;

  // 🔁 Timer logic
  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds]);

  // ✅ Save sessions when completed
  const handleSessionComplete = () => {
    setIsActive(false);
    addFocusSession({
      duration: sessionType === 'focus' ? focusDuration : breakDuration,
      sessionType,
    });

    if (sessionType === 'focus') {
      setSessionType('break');
      setSeconds(breakDuration * 60);
    } else {
      setSessionType('focus');
      setSeconds(focusDuration * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(totalSeconds);
  };

  // 💾 Save custom durations to localStorage
  const applyCustomTimer = () => {
    const newFocus = Math.max(1, Number(customFocus));
    const newBreak = Math.max(1, Number(customBreak));

    setFocusDuration(newFocus);
    setBreakDuration(newBreak);
    setIsActive(false);
    setSessionType('focus');
    setSeconds(newFocus * 60);

    localStorage.setItem(
      'pomodoroDurations',
      JSON.stringify({ focus: newFocus, break: newBreak })
    );
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  // 📊 Daily stats
  const today = new Date();
  const todaySessions = focusSessions.filter(
    (s) =>
      s.completedAt >= startOfDay(today) &&
      s.completedAt <= endOfDay(today) &&
      s.sessionType === 'focus'
  );

  const totalFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const completedSessionsCount = todaySessions.length;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Focus Timer</h2>
          <p className="text-gray-600">Stay focused with the Pomodoro technique</p>
        </div>

        {/* 🎛️ Custom Timer Section */}
        <div className="bg-gray-100 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Timer size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800 text-lg">Custom Timer</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Focus Duration (min)
              </label>
              <input
                type="number"
                min="1"
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Break Duration (min)
              </label>
              <input
                type="number"
                min="1"
                value={customBreak}
                onChange={(e) => setCustomBreak(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
          </div>

          <button
            onClick={applyCustomTimer}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Apply Custom Timer
          </button>
        </div>

        {/* 🕒 Timer Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                sessionType === 'focus'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {sessionType === 'focus' ? 'Focus Session' : 'Break Time'}
            </span>
          </div>

          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="transform -rotate-90 w-64 h-64">
              <circle cx="128" cy="128" r="120" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke={sessionType === 'focus' ? '#3b82f6' : '#10b981'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900">
                  {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {sessionType === 'focus' ? 'minutes of focus' : 'minutes of break'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                isActive
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : sessionType === 'focus'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="inline mr-2" size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play className="inline mr-2" size={20} />
                  Start
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              <RotateCcw className="inline mr-2" size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* 📈 Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={24} />
              <h3 className="font-semibold">Total Focus Time Today</h3>
            </div>
            <p className="text-4xl font-bold">{totalFocusTime} min</p>
            <p className="text-sm text-blue-100 mt-2">Keep up the great work!</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={24} />
              <h3 className="font-semibold">Sessions Completed</h3>
            </div>
            <p className="text-4xl font-bold">{completedSessionsCount}</p>
            <p className="text-sm text-green-100 mt-2">{format(today, 'MMMM d, yyyy')}</p>
          </div>
        </div>

        {/* 🕓 Recent Sessions */}
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">Recent Sessions</h3>
          {todaySessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No focus sessions completed today yet
            </p>
          ) : (
            <div className="space-y-2">
              {todaySessions.slice(-5).reverse().map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between bg-white p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-gray-700 font-medium">
                      {session.duration} minute session
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {format(session.completedAt, 'h:mm a')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
