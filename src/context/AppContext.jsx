import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const DEMO_USER_ID = "demo-user";

export const AppProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [habits, setHabits] = useState([]);
    const [habitCompletions, setHabitCompletions] = useState([]);
    const [focusSessions, setFocusSessions] = useState([]);
    const [journals, setJournals] = useState([]);
    const [preferences, setPreferences] = useState({
        userId: DEMO_USER_ID,
        theme: "light",
        pomodoroDuration: 25,
        breakDuration: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [currentView, setCurrentView] = useState("home");

    // ------------------ Load saved data ------------------
    useEffect(() => {
        const savedData = localStorage.getItem("productivityAppData");
        if (savedData) {
            const data = JSON.parse(savedData);

            setTasks(
                data.tasks?.map((t) => ({
                    ...t,
                    dueDate: t.dueDate ? new Date(t.dueDate) : null,
                    createdAt: new Date(t.createdAt),
                    updatedAt: new Date(t.updatedAt),
                })) || []
            );

            setRoutines(
                data.routines?.map((r) => ({
                    ...r,
                    createdAt: new Date(r.createdAt),
                })) || []
            );

            setHabits(
                data.habits?.map((h) => ({
                    ...h,
                    createdAt: new Date(h.createdAt),
                })) || []
            );

            setHabitCompletions(
                data.habitCompletions?.map((hc) => ({
                    ...hc,
                    completedDate: new Date(hc.completedDate),
                    createdAt: new Date(hc.createdAt),
                })) || []
            );

            setFocusSessions(
                data.focusSessions?.map((fs) => ({
                    ...fs,
                    completedAt: new Date(fs.completedAt),
                    createdAt: new Date(fs.createdAt),
                })) || []
            );

            setJournals(
                data.journals?.map((j) => ({
                    ...j,
                    date: new Date(j.date),
                    createdAt: new Date(j.createdAt),
                    updatedAt: new Date(j.updatedAt),
                })) || []
            );

            if (data.preferences) {
                setPreferences({
                    ...data.preferences,
                    createdAt: new Date(data.preferences.createdAt),
                    updatedAt: new Date(data.preferences.updatedAt),
                });
            }
        }
    }, []);

    // ------------------ Save data to localStorage ------------------
    useEffect(() => {
        const dataToSave = {
            tasks,
            routines,
            habits,
            habitCompletions,
            focusSessions,
            journals,
            preferences,
        };
        localStorage.setItem("productivityAppData", JSON.stringify(dataToSave));
    }, [tasks, routines, habits, habitCompletions, focusSessions, journals, preferences]);

    // ------------------ Task Functions ------------------
    const addTask = (task) => {
        const newTask = {
            ...task,
            id: crypto.randomUUID(),
            userId: DEMO_USER_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const updateTask = (id, updates) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const moveTask = (id, newStatus, newIndex) => {
        setTasks((prev) => {
            const task = prev.find((t) => t.id === id);
            if (!task) return prev;

            const filtered = prev.filter((t) => t.id !== id);
            const sameStatusTasks = filtered.filter((t) => t.status === newStatus);
            const otherTasks = filtered.filter((t) => t.status !== newStatus);

            sameStatusTasks.splice(newIndex, 0, {
                ...task,
                status: newStatus,
                orderIndex: newIndex,
                updatedAt: new Date(),
            });

            sameStatusTasks.forEach((t, idx) => (t.orderIndex = idx));

            return [...sameStatusTasks, ...otherTasks].sort(
                (a, b) => a.orderIndex - b.orderIndex
            );
        });
    };

    // ------------------ Routine Functions ------------------
    const addRoutine = (routine) => {
        const newRoutine = {
            ...routine,
            id: crypto.randomUUID(),
            userId: DEMO_USER_ID,
            createdAt: new Date(),
        };
        setRoutines((prev) => [...prev, newRoutine]);
    };

    const updateRoutine = (id, updates) => {
        setRoutines((prev) =>
            prev.map((routine) => (routine.id === id ? { ...routine, ...updates } : routine))
        );
    };

    const deleteRoutine = (id) => {
        setRoutines((prev) => prev.filter((routine) => routine.id !== id));
    };

    const toggleRoutineComplete = (id) => {
        setRoutines((prev) =>
            prev.map((routine) =>
                routine.id === id ? { ...routine, isCompleted: !routine.isCompleted } : routine
            )
        );
    };

    // ------------------ Habit Functions ------------------
    const addHabit = (habit) => {
        const newHabit = {
            ...habit,
            id: crypto.randomUUID(),
            userId: DEMO_USER_ID,
            currentStreak: 0,
            bestStreak: 0,
            createdAt: new Date(),
        };
        setHabits((prev) => [...prev, newHabit]);
    };

    const updateHabit = (id, updates) => {
        setHabits((prev) =>
            prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit))
        );
    };

    const deleteHabit = (id) => {
        setHabits((prev) => prev.filter((habit) => habit.id !== id));
        setHabitCompletions((prev) => prev.filter((hc) => hc.habitId !== id));
    };

    const toggleHabitCompletion = (habitId, date) => {
        const dateStr = date.toISOString().split("T")[0];
        const existing = habitCompletions.find(
            (hc) =>
                hc.habitId === habitId &&
                hc.completedDate.toISOString().split("T")[0] === dateStr
        );

        if (existing) {
            setHabitCompletions((prev) => prev.filter((hc) => hc.id !== existing.id));
        } else {
            const newCompletion = {
                id: crypto.randomUUID(),
                habitId,
                userId: DEMO_USER_ID,
                completedDate: date,
                createdAt: new Date(),
            };
            setHabitCompletions((prev) => [...prev, newCompletion]);
        }

        setHabits((prev) =>
            prev.map((habit) => {
                if (habit.id !== habitId) return habit;

                const completions = habitCompletions.filter((hc) => hc.habitId === habitId);
                const sortedDates = completions
                    .map((c) => c.completedDate)
                    .sort((a, b) => b.getTime() - a.getTime());

                let currentStreak = 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                for (let i = 0; i < sortedDates.length; i++) {
                    const expectedDate = new Date(today);
                    expectedDate.setDate(today.getDate() - i);
                    const completionDate = new Date(sortedDates[i]);
                    completionDate.setHours(0, 0, 0, 0);

                    if (completionDate.getTime() === expectedDate.getTime()) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }

                const bestStreak = Math.max(habit.bestStreak, currentStreak);
                return { ...habit, currentStreak, bestStreak };
            })
        );
    };

    // ------------------ Focus Session ------------------
    const addFocusSession = (session) => {
        const newSession = {
            ...session,
            id: crypto.randomUUID(),
            userId: DEMO_USER_ID,
            completedAt: new Date(),
            createdAt: new Date(),
        };
        setFocusSessions((prev) => [...prev, newSession]);
    };

    // ------------------ Journal ------------------
    const updateJournal = (date, content, mood) => {
        const dateStr = date.toISOString().split("T")[0];
        const existing = journals.find(
            (j) => j.date.toISOString().split("T")[0] === dateStr
        );

        if (existing) {
            setJournals((prev) =>
                prev.map((journal) =>
                    journal.id === existing.id
                        ? { ...journal, content, mood, updatedAt: new Date() }
                        : journal
                )
            );
        } else {
            const newJournal = {
                id: crypto.randomUUID(),
                userId: DEMO_USER_ID,
                date,
                content,
                mood,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setJournals((prev) => [...prev, newJournal]);
        }
    };

    // ------------------ Preferences ------------------
    const updatePreferences = (updates) => {
        setPreferences((prev) => ({
            ...prev,
            ...updates,
            updatedAt: new Date(),
        }));
    };


    const [weeklyPlan, setWeeklyPlan] = useState([
        { id: crypto.randomUUID(), day: "Monday", title: "Read 20 pages" },
        { id: crypto.randomUUID(), day: "Monday", title: "Exercise 30 min" },
        { id: crypto.randomUUID(), day: "Tuesday", title: "Write blog post" },
        // ... default plan
    ]);

    const addPlanItem = (day, title) => {
        const newItem = { id: crypto.randomUUID(), day, title };
        setWeeklyPlan(prev => [...prev, newItem]);
    };

    const updatePlanItem = (id, updates) => {
        setWeeklyPlan(prev =>
            prev.map(item => (item.id === id ? { ...item, ...updates } : item))
        );
    };

    const deletePlanItem = (id) => {
        setWeeklyPlan(prev => prev.filter(item => item.id !== id));
    };


    return (
        <AppContext.Provider
            value={{
                weeklyPlan,
                addPlanItem,
                updatePlanItem,
                deletePlanItem,
                tasks,
                routines,
                habits,
                habitCompletions,
                focusSessions,
                journals,
                preferences,
                addTask,
                updateTask,
                deleteTask,
                moveTask,
                addRoutine,
                updateRoutine,
                deleteRoutine,
                toggleRoutineComplete,
                addHabit,
                updateHabit,
                deleteHabit,
                toggleHabitCompletion,
                addFocusSession,
                updateJournal,
                updatePreferences,
                currentView,
                setCurrentView,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// ------------------ Custom Hook ------------------
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};
