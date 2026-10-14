import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PortalLayout } from './components/PortalLayout';

import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';

// Student Pages (7 Mandatory Modules)
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAcademic } from './pages/student/StudentAcademic';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentFees } from './pages/student/StudentFees';
import { StudentMarks } from './pages/student/StudentMarks';
import { StudentDownloads } from './pages/student/StudentDownloads';
import { StudentContact } from './pages/student/StudentContact';
import { StudentCourses } from './pages/student/StudentCourses';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { StudentAttendance } from './pages/student/StudentAttendance';

// Faculty Pages (6 Mandatory Modules)
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyAttendance } from './pages/faculty/FacultyAttendance';
import { FacultyMarksEntry } from './pages/faculty/FacultyMarksEntry';
import { FacultyTimetable } from './pages/faculty/FacultyTimetable';
import { FacultyLeave } from './pages/faculty/FacultyLeave';
import { FacultyStudentProfiles } from './pages/faculty/FacultyStudentProfiles';
import { FacultyLMS } from './pages/faculty/FacultyLMS';
import { FacultyAssignments } from './pages/faculty/FacultyAssignments';

// Admin Pages (7 Mandatory Modules via /admin)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminFaculty } from './pages/admin/AdminFaculty';
import { AdminOBE } from './pages/admin/AdminOBE';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminFees } from './pages/admin/AdminFees';
import { AdminCompliance } from './pages/admin/AdminCompliance';
import { AdminPlacements } from './pages/admin/AdminPlacements';
import { AdminCampus } from './pages/admin/AdminCampus';
import { AdminLeaves } from './pages/admin/AdminLeaves';
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
              <Route path="/student/academic" element={<StudentAcademic />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
              <Route path="/student/fees" element={<StudentFees />} />
              <Route path="/student/marks" element={<StudentMarks />} />
              <Route path="/student/downloads" element={<StudentDownloads />} />
              <Route path="/student/contact" element={<StudentContact />} />
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
            </Route>
          </Route>

          {/* Faculty Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/attendance" element={<FacultyAttendance />} />
              <Route path="/faculty/marks" element={<FacultyMarksEntry />} />
              <Route path="/faculty/timetable" element={<FacultyTimetable />} />
              <Route path="/faculty/leaves" element={<FacultyLeave />} />
              <Route path="/faculty/students" element={<FacultyStudentProfiles />} />
              <Route path="/faculty/lms" element={<FacultyLMS />} />
              <Route path="/faculty/assignments" element={<FacultyAssignments />} />
            </Route>
          </Route>

          {/* Admin Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<PortalLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/faculty" element={<AdminFaculty />} />
              <Route path="/admin/obe" element={<AdminOBE />} />
              <Route path="/admin/attendance" element={<AdminAttendance />} />
              <Route path="/admin/fees" element={<AdminFees />} />
              <Route path="/admin/compliance" element={<AdminCompliance />} />
              <Route path="/admin/placements" element={<AdminPlacements />} />
              <Route path="/admin/campus" element={<AdminCampus />} />
              <Route path="/admin/leaves" element={<AdminLeaves />} />
              <Route path="/admin/results" element={<AdminResults />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            </Route>
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Floating AI Campus Assistant */}
        <ChatbotWidget />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
