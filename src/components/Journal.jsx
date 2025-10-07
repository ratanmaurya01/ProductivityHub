// import React, { useState, useEffect } from 'react';
// import { useApp } from '../context/AppContext';
// import { BookOpen, Calendar, Smile, Meh, Frown, CloudRain } from 'lucide-react';
// import { format, startOfDay } from 'date-fns';

// const moodIcons = {
//   happy: { icon: Smile, color: 'text-green-600', bg: 'bg-green-100' },
//   neutral: { icon: Meh, color: 'text-blue-600', bg: 'bg-blue-100' },
//   tired: { icon: Frown, color: 'text-orange-600', bg: 'bg-orange-100' },
//   stressed: { icon: CloudRain, color: 'text-red-600', bg: 'bg-red-100' },
// };

// const JournalEntry = ({ date, content, mood, onClick }) => {
//   const MoodIcon = mood ? moodIcons[mood].icon : null;
//   const moodConfig = mood ? moodIcons[mood] : null;

//   return (
//     <button
//       onClick={onClick}
//       className="w-full text-left bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
//     >
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center gap-2">
//           <Calendar size={16} className="text-gray-500" />
//           <span className="font-semibold text-gray-900">{format(date, 'MMMM d, yyyy')}</span>
//         </div>
//         {MoodIcon && moodConfig && (
//           <div className={`${moodConfig.bg} p-2 rounded-full`}>
//             <MoodIcon size={18} className={moodConfig.color} />
//           </div>
//         )}
//       </div>
//       <p className="text-gray-600 line-clamp-2">
//         {content || 'No entry yet...'}
//       </p>
//     </button>
//   );
// };

// export const Journal = () => {
//   const { journals, updateJournal } = useApp();
//   const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
//   const [content, setContent] = useState('');
//   const [mood, setMood] = useState(null);

//   const currentJournal = journals.find(
//     (j) => startOfDay(j.date).getTime() === selectedDate.getTime()
//   );

//   useEffect(() => {
//     if (currentJournal) {
//       setContent(currentJournal.content);
//       setMood(currentJournal.mood);
//     } else {
//       setContent('');
//       setMood(null);
//     }
//   }, [selectedDate, currentJournal]);

//   const handleSave = () => {
//     updateJournal(selectedDate, content, mood);
//   };

//   const sortedJournals = [...journals].sort((a, b) => b.date.getTime() - a.date.getTime());

//   return (
//     <div className="h-full overflow-y-auto p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily Journal</h2>
//           <p className="text-gray-600">Reflect on your day and track your mood</p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="md:col-span-2">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <BookOpen className="text-blue-600" size={24} />
//                   <h3 className="font-bold text-gray-900 text-lg">
//                     {format(selectedDate, 'EEEE, MMMM d, yyyy')}
//                   </h3>
//                 </div>
//                 <input
//                   type="date"
//                   value={format(selectedDate, 'yyyy-MM-dd')}
//                   onChange={(e) => setSelectedDate(startOfDay(new Date(e.target.value)))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   How are you feeling today?
//                 </label>
//                 <div className="flex gap-3">
//                   {Object.keys(moodIcons).map((moodOption) => {
//                     const MoodIcon = moodIcons[moodOption].icon;
//                     const config = moodIcons[moodOption];
//                     const isSelected = mood === moodOption;

//                     return (
//                       <button
//                         key={moodOption}
//                         onClick={() => setMood(moodOption)}
//                         className={`flex-1 p-4 rounded-lg border-2 transition-all ${
//                           isSelected
//                             ? `${config.bg} border-current ${config.color}`
//                             : 'bg-gray-50 border-gray-200 hover:border-gray-300'
//                         }`}
//                       >
//                         <MoodIcon
//                           size={32}
//                           className={`mx-auto mb-2 ${isSelected ? config.color : 'text-gray-400'}`}
//                         />
//                         <span className={`text-sm font-medium ${isSelected ? config.color : 'text-gray-600'}`}>
//                           {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Journal Entry
//                 </label>
//                 <textarea
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   rows={12}
//                   placeholder="What did you learn today? What are you grateful for? What could be improved?"
//                 />
//               </div>

//               <button
//                 onClick={handleSave}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//               >
//                 Save Entry
//               </button>
//             </div>
//           </div>

//           <div>
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="font-bold text-gray-900 text-lg mb-4">Past Entries</h3>

//               {sortedJournals.length === 0 ? (
//                 <div className="text-center py-8">
//                   <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
//                   <p className="text-gray-500 text-sm">No journal entries yet</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3 max-h-[600px] overflow-y-auto">
//                   {sortedJournals.map((journal) => (
//                     <JournalEntry
//                       key={journal.id}
//                       date={journal.date}
//                       content={journal.content}
//                       mood={journal.mood}
//                       onClick={() => setSelectedDate(startOfDay(journal.date))}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Calendar, Smile, Meh, Frown, CloudRain } from 'lucide-react';
import { format, startOfDay } from 'date-fns';

const moodIcons = {
  happy: { icon: Smile, color: 'text-green-600', bg: 'bg-green-100' },
  neutral: { icon: Meh, color: 'text-blue-600', bg: 'bg-blue-100' },
  tired: { icon: Frown, color: 'text-orange-600', bg: 'bg-orange-100' },
  stressed: { icon: CloudRain, color: 'text-red-600', bg: 'bg-red-100' },
};

const JournalEntry = ({ date, content, mood, onClick }) => {
  const MoodIcon = mood ? moodIcons[mood].icon : null;
  const moodConfig = mood ? moodIcons[mood] : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {format(date, 'MMMM d, yyyy')}
          </span>
        </div>
        {MoodIcon && moodConfig && (
          <div className={`${moodConfig.bg} p-2 rounded-full`}>
            <MoodIcon size={18} className={moodConfig.color} />
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm sm:text-base line-clamp-2">
        {content || 'No entry yet...'}
      </p>
    </button>
  );
};

export const Journal = () => {
  const { journals, updateJournal } = useApp();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(null);

  const currentJournal = journals.find(
    (j) => startOfDay(j.date).getTime() === selectedDate.getTime()
  );

  useEffect(() => {
    if (currentJournal) {
      setContent(currentJournal.content);
      setMood(currentJournal.mood);
    } else {
      setContent('');
      setMood(null);
    }
  }, [selectedDate, currentJournal]);

  const handleSave = () => {
    updateJournal(selectedDate, content, mood);
  };

  const sortedJournals = [...journals].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center md:text-left">
          <h2 className="sm:text-3xl font-bold text-gray-900 mb-1">
            Daily Journal
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Reflect on your day and track your mood
          </p>
        </div>

        {/* Grid Layout — Responsive: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Journal Form (takes 2 cols on desktop, 1 on mobile/tablet) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-blue-600 flex-shrink-0" size={24} />
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                </div>
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(startOfDay(new Date(e.target.value)))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base w-full sm:w-auto"
                />
              </div>

              {/* Mood Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.keys(moodIcons).map((moodOption) => {
                    const MoodIcon = moodIcons[moodOption].icon;
                    const config = moodIcons[moodOption];
                    const isSelected = mood === moodOption;

                    return (
                      <button
                        key={moodOption}
                        onClick={() => setMood(moodOption)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all duration-200 ${
                          isSelected
                            ? `${config.bg} border-current ${config.color}`
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <MoodIcon
                          size={28}
                          className={`mb-1 ${isSelected ? config.color : 'text-gray-400'}`}
                        />
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            isSelected ? config.color : 'text-gray-600'
                          }`}
                        >
                          {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Journal Textarea */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Journal Entry
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  rows={10}
                  placeholder="What did you learn today? What are you grateful for? What could be improved?"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Entry
              </button>
            </div>
          </div>

          {/* Past Entries (always right side, below on tablet) */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Past Entries</h3>

              {sortedJournals.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No journal entries yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                  {sortedJournals.map((journal) => (
                    <JournalEntry
                      key={journal.id}
                      date={journal.date}
                      content={journal.content}
                      mood={journal.mood}
                      onClick={() => setSelectedDate(startOfDay(journal.date))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
