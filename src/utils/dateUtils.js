/**
 * Date Utilities với Timezone Việt Nam (UTC+7)
 * Sử dụng dayjs thay vì moment để tối ưu bundle size
 */

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi"; // Vietnamese locale

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(localeData);

// Set default timezone to Vietnam (Asia/Ho_Chi_Minh)
const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
dayjs.locale("vi"); // Set Vietnamese locale

/**
 * Get current date/time in Vietnam timezone
 */
export const nowVN = () => {
  return dayjs().tz(VIETNAM_TIMEZONE);
};

/**
 * Convert date to Vietnam timezone
 */
export const toVNTime = (date) => {
  if (!date) return null;
  return dayjs(date).tz(VIETNAM_TIMEZONE);
};

/**
 * Format date in Vietnamese format
 * @param {Date|string|dayjs} date - Date to format
 * @param {string} format - Format string (default: 'DD/MM/YYYY')
 * @returns {string} Formatted date string
 */
export const formatDateVN = (date, format = "DD/MM/YYYY") => {
  if (!date) return "";
  return toVNTime(date).format(format);
};

/**
 * Format datetime in Vietnamese format
 * @param {Date|string|dayjs} date - Date to format
 * @param {string} format - Format string (default: 'DD/MM/YYYY HH:mm')
 * @returns {string} Formatted datetime string
 */
export const formatDateTimeVN = (date, format = "DD/MM/YYYY HH:mm") => {
  if (!date) return "";
  return toVNTime(date).format(format);
};

/**
 * Format time in Vietnamese format
 * @param {Date|string|dayjs} date - Date to format
 * @param {string} format - Format string (default: 'HH:mm')
 * @returns {string} Formatted time string
 */
export const formatTimeVN = (date, format = "HH:mm") => {
  if (!date) return "";
  return toVNTime(date).format(format);
};

/**
 * Format date with Vietnamese locale
 * @param {Date|string|dayjs} date - Date to format
 * @returns {string} Formatted date string (e.g., "Thứ Hai, 24/11/2025")
 */
export const formatDateVNFull = (date) => {
  if (!date) return "";
  return toVNTime(date).format("dddd, DD/MM/YYYY");
};

/**
 * Format datetime with Vietnamese locale
 * @param {Date|string|dayjs} date - Date to format
 * @returns {string} Formatted datetime string (e.g., "Thứ Hai, 24/11/2025 14:30")
 */
export const formatDateTimeVNFull = (date) => {
  if (!date) return "";
  return toVNTime(date).format("dddd, DD/MM/YYYY HH:mm");
};

/**
 * Get relative time in Vietnamese (e.g., "2 phút trước")
 * @param {Date|string|dayjs} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTimeVN = (date) => {
  if (!date) return "";
  return toVNTime(date).fromNow();
};

/**
 * Format date for display with Vietnamese day names
 * @param {Date|string|dayjs} date - Date to format
 * @returns {string} Formatted string (e.g., "Thứ Hai, 24/11/2025")
 */
export const formatDateWithDayVN = (date) => {
  if (!date) return "";
  const vnDate = toVNTime(date);
  const dayNames = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const dayName = dayNames[vnDate.day()];
  return `${dayName}, ${vnDate.format("DD/MM/YYYY")}`;
};

/**
 * Format datetime with Vietnamese day names
 * @param {Date|string|dayjs} date - Date to format
 * @returns {string} Formatted string (e.g., "Thứ Hai, 24/11/2025 14:30")
 */
export const formatDateTimeWithDayVN = (date) => {
  if (!date) return "";
  const vnDate = toVNTime(date);
  const dayNames = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const dayName = dayNames[vnDate.day()];
  return `${dayName}, ${vnDate.format("DD/MM/YYYY HH:mm")}`;
};

/**
 * Get start of day in Vietnam timezone
 */
export const startOfDayVN = (date) => {
  if (!date) return null;
  return toVNTime(date).startOf("day").toDate();
};

/**
 * Get end of day in Vietnam timezone
 */
export const endOfDayVN = (date) => {
  if (!date) return null;
  return toVNTime(date).endOf("day").toDate();
};

/**
 * Get start of week in Vietnam timezone
 */
export const startOfWeekVN = (date) => {
  if (!date) return null;
  return toVNTime(date).startOf("week").toDate();
};

/**
 * Get end of week in Vietnam timezone
 */
export const endOfWeekVN = (date) => {
  if (!date) return null;
  return toVNTime(date).endOf("week").toDate();
};

/**
 * Get start of month in Vietnam timezone
 */
export const startOfMonthVN = (date) => {
  if (!date) return null;
  return toVNTime(date).startOf("month").toDate();
};

/**
 * Get end of month in Vietnam timezone
 */
export const endOfMonthVN = (date) => {
  if (!date) return null;
  return toVNTime(date).endOf("month").toDate();
};

/**
 * Add days in Vietnam timezone
 */
export const addDaysVN = (date, days) => {
  if (!date) return null;
  return toVNTime(date).add(days, "day").toDate();
};

/**
 * Subtract days in Vietnam timezone
 */
export const subtractDaysVN = (date, days) => {
  if (!date) return null;
  return toVNTime(date).subtract(days, "day").toDate();
};

/**
 * Add months in Vietnam timezone
 */
export const addMonthsVN = (date, months) => {
  if (!date) return null;
  return toVNTime(date).add(months, "month").toDate();
};

/**
 * Subtract months in Vietnam timezone
 */
export const subtractMonthsVN = (date, months) => {
  if (!date) return null;
  return toVNTime(date).subtract(months, "month").toDate();
};

/**
 * Add years in Vietnam timezone
 */
export const addYearsVN = (date, years) => {
  if (!date) return null;
  return toVNTime(date).add(years, "year").toDate();
};

/**
 * Subtract years in Vietnam timezone
 */
export const subtractYearsVN = (date, years) => {
  if (!date) return null;
  return toVNTime(date).subtract(years, "year").toDate();
};

/**
 * Check if date is today in Vietnam timezone
 */
export const isTodayVN = (date) => {
  if (!date) return false;
  return toVNTime(date).isSame(nowVN(), "day");
};

/**
 * Check if date is yesterday in Vietnam timezone
 */
export const isYesterdayVN = (date) => {
  if (!date) return false;
  return toVNTime(date).isSame(nowVN().subtract(1, "day"), "day");
};

/**
 * Check if date is tomorrow in Vietnam timezone
 */
export const isTomorrowVN = (date) => {
  if (!date) return false;
  return toVNTime(date).isSame(nowVN().add(1, "day"), "day");
};

/**
 * Get difference in days between two dates (Vietnam timezone)
 */
export const diffDaysVN = (date1, date2) => {
  if (!date1 || !date2) return 0;
  return toVNTime(date1).diff(toVNTime(date2), "day");
};

/**
 * Get difference in hours between two dates (Vietnam timezone)
 */
export const diffHoursVN = (date1, date2) => {
  if (!date1 || !date2) return 0;
  return toVNTime(date1).diff(toVNTime(date2), "hour");
};

/**
 * Get difference in minutes between two dates (Vietnam timezone)
 */
export const diffMinutesVN = (date1, date2) => {
  if (!date1 || !date2) return 0;
  return toVNTime(date1).diff(toVNTime(date2), "minute");
};

/**
 * Parse date string in Vietnamese format
 * @param {string} dateString - Date string to parse
 * @param {string} format - Format string (default: 'DD/MM/YYYY')
 * @returns {Date|null} Parsed date or null
 */
export const parseDateVN = (dateString, format = "DD/MM/YYYY") => {
  if (!dateString) return null;
  const parsed = dayjs(dateString, format, "vi");
  return parsed.isValid() ? parsed.tz(VIETNAM_TIMEZONE).toDate() : null;
};

/**
 * Parse datetime string in Vietnamese format
 * @param {string} dateString - Datetime string to parse
 * @param {string} format - Format string (default: 'DD/MM/YYYY HH:mm')
 * @returns {Date|null} Parsed date or null
 */
export const parseDateTimeVN = (dateString, format = "DD/MM/YYYY HH:mm") => {
  if (!dateString) return null;
  const parsed = dayjs(dateString, format, "vi");
  return parsed.isValid() ? parsed.tz(VIETNAM_TIMEZONE).toDate() : null;
};

/**
 * Format date for Google Sheets (Vietnam timezone)
 */
export const formatForSheetVN = (date, includeTime = false) => {
  if (!date) return "";
  const vnDate = toVNTime(date);
  return includeTime
    ? vnDate.format("DD/MM/YYYY HH:mm:ss")
    : vnDate.format("DD/MM/YYYY");
};

/**
 * Parse date from Google Sheets (Vietnam timezone)
 */
export const parseSheetDateVN = (dateString) => {
  if (!dateString) return null;

  const formats = [
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "YYYY-MM-DD",
    "DD-MM-YYYY",
    "MM-DD-YYYY",
    "DD/MM/YYYY HH:mm",
    "MM/DD/YYYY HH:mm",
    "YYYY-MM-DD HH:mm:ss",
    "DD/MM/YYYY HH:mm:ss",
  ];

  for (const format of formats) {
    const parsed = dayjs(dateString, format, "vi");
    if (parsed.isValid()) {
      return parsed.tz(VIETNAM_TIMEZONE).toDate();
    }
  }

  // Fallback to automatic parsing
  const parsed = dayjs(dateString);
  return parsed.isValid() ? parsed.tz(VIETNAM_TIMEZONE).toDate() : null;
};

/**
 * Get current timestamp in Vietnam timezone (ISO string)
 */
export const getCurrentTimestampVN = () => {
  return nowVN().toISOString();
};

/**
 * Format timestamp for display (Vietnam timezone)
 */
export const formatTimestampVN = (timestamp) => {
  if (!timestamp) return "";
  return toVNTime(timestamp).format("DD/MM/YYYY HH:mm:ss");
};

// Export default functions for backward compatibility
export const formatDate = formatDateVN;
export const formatDateTime = formatDateTimeVN;
export const formatTime = formatTimeVN;

// Export dayjs instance for advanced usage
export { dayjs };
export const VIETNAM_TIMEZONE_NAME = VIETNAM_TIMEZONE;
