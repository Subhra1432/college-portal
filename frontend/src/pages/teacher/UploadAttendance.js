import React from 'react';
import AttendanceManagement from './AttendanceManagement';

// This component serves as a compatibility layer to avoid breaking existing imports
// It renders the AttendanceManagement component we've already created
const UploadAttendance = () => {
  return <AttendanceManagement />;
};

export default UploadAttendance; 