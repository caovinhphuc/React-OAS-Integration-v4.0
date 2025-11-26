/**
 * Vietnam Clock Component
 * Hiển thị thời gian Việt Nam real-time
 */

import React, { useState, useEffect } from "react";
import {
  formatDateTimeVN,
  formatTimeVN,
  formatDateVNFull,
  nowVN,
} from "../../utils/dateUtils";

const VietnamClock = ({
  showDate = true,
  showSeconds = true,
  size = "default",
}) => {
  const [currentTime, setCurrentTime] = useState(nowVN());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(nowVN());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeFormat = showSeconds ? "HH:mm:ss" : "HH:mm";
  const timeString = formatTimeVN(currentTime, timeFormat);
  const dateString = formatDateVNFull(currentTime);

  const sizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div
      className={`vietnam-clock ${sizeClasses[size] || sizeClasses.default}`}
    >
      {showDate && (
        <div className="date-display text-gray-600 mb-1">{dateString}</div>
      )}
      <div className="time-display font-mono font-bold text-blue-600">
        {timeString}
      </div>
      <div className="timezone-info text-xs text-gray-500 mt-1">
        Giờ Việt Nam (UTC+7)
      </div>
    </div>
  );
};

export default VietnamClock;
