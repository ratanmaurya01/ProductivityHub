import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export const WeeklyPlan = () => {
    const { weeklyPlan, addPlanItem, updatePlanItem, deletePlanItem } = useApp();
    const [day, setDay] = useState("Monday");
    const [title, setTitle] = useState("");
    
    const handleAdd = () => {
        if (!title) return;
        addPlanItem(day, title);
        setTitle("");
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className=" font-bold mb-4">Weekly Plan</h2>
            <div className="flex gap-2 mb-4">
                <select value={day} onChange={e => setDay(e.target.value)} className="border p-2 rounded">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Task title"
                    className="border p-2 rounded flex-1"
                />
                <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {weeklyPlan.map(item => (
                    <li key={item.id} className="flex justify-between items-center border p-2 rounded">
                        <span>{item.day}: {item.title}</span>
                        <button
                            onClick={() => deletePlanItem(item.id)}
                            className="text-red-600 font-bold"
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
