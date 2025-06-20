/**
 * Convert UTC ISO string to local time
 * @param {String} utcString - UTC time in ISO format
 * @returns {Date} Local time Date object
 */
export const utcToLocal = (utcString) => {
  const date = new Date(utcString);
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc);
};

/**
 * Convert local time to UTC
 * @param {Date} localDate - Local time Date object
 * @returns {Date} UTC time Date object
 */
export const localToUtc = (localDate) => {
  return new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
};

/**
 * Calculate the remaining time for a competition
 * @param {Date} startTime - When the user started the competition
 * @param {Date} endTime - The latest time the competition can end
 * @param {Number} competitionLength - Duration of competition in seconds
 * @returns {Number} Remaining time in seconds
 */
export const calculateRemainingTime = (startTime, endTime, competitionLength) => {
  const now = new Date();
  
  // Calculate when this user's competition should end
  const userEndTime = new Date(startTime.getTime() + competitionLength * 1000);
  
  // Ensure it doesn't exceed the global end time
  const effectiveEndTime = userEndTime < endTime ? userEndTime : endTime;
  
  // Calculate remaining time in seconds
  const remainingMs = effectiveEndTime - now;
  return Math.max(0, Math.floor(remainingMs / 1000));
};

/**
 * Format a duration in seconds to human-readable string
 * @param {Number} seconds - Duration in seconds
 * @returns {String} Formatted duration string (e.g. "2h 30m 15s")
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = '';
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    result += `${minutes}m `;
  }
  result += `${secs}s`;
  
  return result;
};

/**
 * Calculate the competition status based on timestamps
 * @param {Date} startTime - Competition start time
 * @param {Date} entranceDeadline - Last time users can join
 * @param {Date} endTime - Competition end time
 * @returns {String} Status of the competition
 */
export const calculateCompetitionStatus = (startTime, entranceDeadline, endTime) => {
  const now = new Date();
  const localStartTime = new Date(startTime);
  const localEntranceDeadline = new Date(entranceDeadline);
  const localEndTime = new Date(endTime);
  
  if (now < localStartTime) {
    return 'upcoming';
  } else if (now >= localStartTime && now < localEntranceDeadline) {
    return 'in_progress_can_enter';
  } else if (now >= localEntranceDeadline && now < localEndTime) {
    return 'in_progress_no_entry';
  } else {
    return 'ended';
  }
}; 