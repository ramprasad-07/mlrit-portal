import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PortalLayout } from './components/PortalLayout';

import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCourses } from './pages/student/StudentCourses';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentMarks } from './pages/student/StudentMarks';
import { StudentFees } from './pages/student/StudentFees';
import { StudentTimetable } from './pages/student/StudentTimetable';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyLMS } from './pages/faculty/FacultyLMS';
import { FacultyAssignments } from './pages/faculty/FacultyAssignments';
import { FacultyMarksEntry } from './pages/faculty/FacultyMarksEntry';
import { FacultyAttendance } from './pages/faculty/FacultyAttendance';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminFaculty } from './pages/admin/AdminFaculty';
import { AdminFees } from './pages/admin/AdminFees';
import { AdminResults } from './pages/admin/AdminResults';
import { AdminNotices } from './pages/admin/AdminNotices';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/marks" element={<StudentMarks />} />
              <Route path="/student/fees" element={<StudentFees />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
            </Route>
          </Route>

          {/* Faculty Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/lms" element={<FacultyLMS />} />
              <Route path="/faculty/assignments" element={<FacultyAssignments />} />
              <Route path="/faculty/marks" element={<FacultyMarksEntry />} />
              <Route path="/faculty/attendance" element={<FacultyAttendance />} />
            </Route>
          </Route>

          {/* Admin Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/faculty" element={<AdminFaculty />} />
              <Route path="/admin/fees" element={<AdminFees />} />
              <Route path="/admin/results" element={<AdminResults />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            </Route>
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
