import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, Clock, CheckCircle, Circle } from 'lucide-react';

const RoutineCard = ({ routine, onEdit, onDelete, onToggle }) => {
    return (
        <div
            className={`p-4 rounded-lg border-2 transition-all ${routine.isCompleted
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
        >
            <div className="flex items-start gap-3">
                <button onClick={onToggle} className="mt-1">
                    {routine.isCompleted ? (
                        <CheckCircle className="text-green-600" size={24} />
                    ) : (
                        <Circle className="text-gray-400 hover:text-green-500 transition-colors" size={24} />
                    )}
                </button>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <h4
                            className={`font-semibold text-lg ${routine.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}
                        >
                            {routine.title}
                        </h4>
                        <div className="flex gap-1">
                            <button
                                onClick={onEdit}
                                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock size={14} />
                        <span className="font-medium">
                            {routine.startTime} - {routine.endTime}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {routine.repeatType}
                        </span>
                    </div>

                    {routine.description && <p className="text-sm text-gray-600">{routine.description}</p>}
                </div>
            </div>
        </div>
    );
};

const RoutineModal = ({ routine, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: routine?.title || '',
        startTime: routine?.startTime || '09:00',
        endTime: routine?.endTime || '10:00',
        description: routine?.description || '',
        repeatType: routine?.repeatType || 'daily',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            isCompleted: routine?.isCompleted || false,
            orderIndex: routine?.orderIndex || 0,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {routine ? 'Edit Routine' : 'New Routine'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Repeat</label>
                        <select
                            value={formData.repeatType}
                            onChange={(e) => setFormData({ ...formData, repeatType: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekdays">Weekdays</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            {routine ? 'Update Routine' : 'Create Routine'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const RoutineManager = () => {
    const { routines, addRoutine, updateRoutine, deleteRoutine, toggleRoutineComplete } = useApp();
    const [modalState, setModalState] = useState({ isOpen: false, routine: null });

    const sortedRoutines = [...routines].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const completedCount = routines.filter((r) => r.isCompleted).length;
    const completionPercentage =
        routines.length > 0 ? Math.round((completedCount / routines.length) * 100) : 0;

    const handleSaveRoutine = (routineData) => {
        if (modalState.routine) {
            updateRoutine(modalState.routine.id, routineData);
        } else {
            addRoutine(routineData);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily Routine</h2>
                        <p className="text-gray-600">Plan and track your daily schedule</p>
                    </div>
                    <button
                        onClick={() => setModalState({ isOpen: true, routine: null })}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Routine
                    </button>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">Today's Progress</h3>
                        <span className="text-2xl font-bold">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-blue-400/30 rounded-full h-3">
                        <div
                            className="bg-white rounded-full h-3 transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <p className="mt-3 text-sm text-blue-100">
                        {completedCount} of {routines.length} routines completed
                    </p>
                </div>

                {sortedRoutines.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No routines yet. Start planning your day!</p>
                        <button
                            onClick={() => setModalState({ isOpen: true, routine: null })}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Create First Routine
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedRoutines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                onEdit={() => setModalState({ isOpen: true, routine })}
                                onDelete={() => deleteRoutine(routine.id)}
                                onToggle={() => toggleRoutineComplete(routine.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {modalState.isOpen && (
                <RoutineModal
                    routine={modalState.routine}
                    onClose={() => setModalState({ isOpen: false, routine: null })}
                    onSave={handleSaveRoutine}
                />
            )}
        </div>
    );
};
