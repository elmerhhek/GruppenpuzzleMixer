import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
    durationSeconds: number;
    onComplete?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ durationSeconds, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onComplete?.();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = (timeLeft / durationSeconds) * 100;

    return (
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-md border border-slate-200">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="transform -rotate-90 w-10 h-10">
                    <circle
                        className="text-slate-100"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="18"
                        cx="20"
                        cy="20"
                    />
                    <circle
                        className="text-indigo-600 transition-all duration-1000 ease-linear"
                        strokeWidth="4"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (113 * progress) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="18"
                        cx="20"
                        cy="20"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <TimerIcon className="w-4 h-4 text-indigo-600" />
                </div>
            </div>

            <div className="text-xl font-mono font-bold text-slate-700">
                {formatTime(timeLeft)}
            </div>
        </div>
    );
};
