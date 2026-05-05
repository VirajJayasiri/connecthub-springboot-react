import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import ChatRoomsPage from "./pages/ChatRoomsPage.jsx";
import "./App.css";

function PlaceholderPage({ title, description }) {
  return (
    <div className="placeholder">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function PageLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" replace />} />
      <Route
        path="/posts"
        element={
          <PageLayout>
            <PlaceholderPage
              title="Posts"
              description="Your ConnectHub feed will appear here."
            />
          </PageLayout>
        }
      />
      <Route
        path="/friends"
        element={
          <PageLayout>
            <PlaceholderPage
              title="Friends"
              description="Manage connections and friend requests in one place."
            />
          </PageLayout>
        }
      />
      <Route
        path="/chat-rooms"
        element={
          <PageLayout>
            <ChatRoomsPage />
          </PageLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PageLayout>
            <PlaceholderPage
              title="Profile"
              description="Profile details and settings will live here."
            />
          </PageLayout>
        }
      />
    </Routes>
  );
}

export default App;
