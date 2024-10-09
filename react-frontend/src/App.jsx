import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import useAuthCheck from './hooks/useAuthCheck';
import Loader from './components/UI/Loader';
import PublicRoute from './components/Layout/PublicRoute';
import PrivateRoute from './components/Layout/PrivateRoute';
import Employees from './pages/Employees/Employees';
import Layout from './components/Layout/Layout';
import Attendance from './pages/Attendance/Attendance';
import Loan from './pages/Loan/Loan';
import Salary from './pages/Salary/Salary';
import PaymentHistory from './pages/PaymentHistory/PaymentHistory';
// import Project from './pages/Project/Project';
import AttendanceReport from './pages/AttendanceReport/AttendanceReport';
import Profile from './pages/Profile/Profile';
import SalaryReport from './pages/SalaryReport/SalaryReport';
import Settings from './pages/Settings/Settings';
import SuperAdminRoute from './components/Layout/SuperAdminRoute';

function App() {
  const authChecked = useAuthCheck();
  return !authChecked ? (
    <Loader />
  ) : (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Layout>
                <Employees />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/attendances"
          element={
            <PrivateRoute>
              <Layout>
                <Attendance />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <SuperAdminRoute>
              <Layout>
                <Loan />
              </Layout>
            </SuperAdminRoute>
          }
        />
        <Route
          path="/salaries"
          element={
            <SuperAdminRoute>
              <Layout>
                <Salary />
              </Layout>
            </SuperAdminRoute>
          }
        />
        <Route
          path="/payment-history"
          element={
            <SuperAdminRoute>
              <Layout>
                <PaymentHistory />
              </Layout>
            </SuperAdminRoute>
          }
        />
        <Route
          path="/payment-history/:reference"
          element={
            <SuperAdminRoute>
              <Layout>
                <PaymentHistory />
              </Layout>
            </SuperAdminRoute>
          }
        />
        <Route
          path="/payment-history/:reference/:employeeId"
          element={
            <SuperAdminRoute>
              <Layout>
                <PaymentHistory />
              </Layout>
            </SuperAdminRoute>
          }
        />
        <Route
          path="/attendance-report"
          element={
            <SuperAdminRoute>
              <Layout>
                <AttendanceReport />
              </Layout>
            </SuperAdminRoute>
          }
        />
        <Route
          path="/salary-report"
          element={
            <SuperAdminRoute>
              <Layout>
                <SalaryReport />
              </Layout>
            </SuperAdminRoute>
          }
        />
        {/* <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Layout>
                <Project />
              </Layout>
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/settings"
          element={
            <SuperAdminRoute>
              <Layout>
                <Settings />
              </Layout>
            </SuperAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
