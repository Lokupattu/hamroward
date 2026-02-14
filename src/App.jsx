import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import AdminLayout from "./components/layout/AdminLayout";
import LandingPage from "./pages/public/LandingPage";
import WardSelector from "./pages/public/WardSelector";
import DocumentsList from "./pages/public/DocumentsList";
import DocumentDetails from "./pages/public/DocumentDetails";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";
import SearchPage from "./pages/public/SearchPage";
import TodaysIssuesPage from "./pages/public/TodaysIssuesPage";
import NotificationsPage from "./pages/public/NotificationsPage";
import SponsorsPage from "./pages/public/SponsorsPage";
import VideoListPage from "./pages/videos/VideoListPage";
import UploadVideoPage from "./pages/user/UploadVideoPage";
import ReportIssuePage from "./pages/user/ReportIssuePage";
import MyIssuesPage from "./pages/user/MyIssuesPage";
import MyVideosPage from "./pages/user/MyVideosPage";
import ProfilePage from "./pages/user/ProfilePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminIssuesPage from "./pages/admin/AdminIssuesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminVideosPage from "./pages/admin/AdminVideosPage";
import AdminDocumentsPage from "./pages/admin/AdminDocumentsPage";
import AdminSponsorsPage from "./pages/admin/AdminSponsorsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wards" element={<WardSelector />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/:docId" element={<DocumentDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/todays-issues" element={<TodaysIssuesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <VideoListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadVideoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-issue"
            element={
              <ProtectedRoute>
                <ReportIssuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-issues"
            element={
              <ProtectedRoute>
                <MyIssuesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-videos"
            element={
              <ProtectedRoute>
                <MyVideosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="issues" element={<AdminIssuesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="videos" element={<AdminVideosPage />} />
          <Route path="documents" element={<AdminDocumentsPage />} />
          <Route path="sponsors" element={<AdminSponsorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

