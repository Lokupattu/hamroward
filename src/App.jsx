import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/public/LandingPage"));
const WardSelector = lazy(() => import("./pages/public/WardSelector"));
const DocumentsList = lazy(() => import("./pages/public/DocumentsList"));
const DocumentDetails = lazy(() => import("./pages/public/DocumentDetails"));
const LoginPage = lazy(() => import("./pages/public/LoginPage"));
const SignupPage = lazy(() => import("./pages/public/SignupPage"));
const ResetPasswordPage = lazy(() => import("./pages/public/ResetPasswordPage"));
const SearchPage = lazy(() => import("./pages/public/SearchPage"));
const WardDetails = lazy(() => import("./pages/public/WardDetails"));
const TodaysIssuesPage = lazy(() => import("./pages/public/TodaysIssuesPage"));
const NotificationsPage = lazy(() => import("./pages/public/NotificationsPage"));
const SponsorsPage = lazy(() => import("./pages/public/SponsorsPage"));
const DonationPage = lazy(() => import("./pages/public/DonationPage"));
const DonorsPage = lazy(() => import("./pages/public/DonorsPage"));
const VideoListPage = lazy(() => import("./pages/videos/VideoListPage"));
const UploadVideoPage = lazy(() => import("./pages/user/UploadVideoPage"));
const ReportIssuePage = lazy(() => import("./pages/user/ReportIssuePage"));
const MyIssuesPage = lazy(() => import("./pages/user/MyIssuesPage"));
const MyVideosPage = lazy(() => import("./pages/user/MyVideosPage"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminIssuesPage = lazy(() => import("./pages/admin/AdminIssuesPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminVideosPage = lazy(() => import("./pages/admin/AdminVideosPage"));
const AdminDocumentsPage = lazy(() => import("./pages/admin/AdminDocumentsPage"));
const AdminSponsorsPage = lazy(() => import("./pages/admin/AdminSponsorsPage"));

// Loading fallback
const LoadingPage = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wards" element={<WardSelector />} />
          <Route path="/wards/:id" element={<WardDetails />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/:docId" element={<DocumentDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/todays-issues" element={<TodaysIssuesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/donors" element={<DonorsPage />} />
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
    </Suspense>
  </BrowserRouter>
);
}

