import { useState, useEffect, useCallback } from "react";

export const useTimer = (initialTime: number = 1800) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const startTimer = useCallback(() => {
    setIsActive(true);
    console.log("🚀 Timer Started! isActive:", true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    console.log("🛑 Timer Stopped! isActive:", false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTime(initialTime);
    console.log("🔄 Timer Reset! isActive:", false);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive) return;

    console.log("⏳ Timer Running...");

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsActive(false);
          console.log("⏰ Timer Finished!");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return {
    time,
    isActive,
    formattedTime: formatTime(time),
    startTimer,
    stopTimer,
    resetTimer,
  };
};