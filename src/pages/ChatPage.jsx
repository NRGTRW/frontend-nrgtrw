import React, { useState } from "react";
import { ChatProvider } from "../context/ChatContext";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import NotificationBell from "../components/Chat/NotificationBell";
import CreateRequestModal from "../components/Chat/CreateRequestModal";
import AdminRequestStatus from "../components/Chat/AdminRequestStatus";
import AdminUserManagement from "../components/Chat/AdminUserManagement";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 700);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export default function ChatPage() {
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <ChatProvider>
      <div style={{ display: "flex", height: "100vh", background: "#f7f7f7" }}>
        {(!isMobile || sidebarOpen) && (
          <ChatSidebar
            onCreateRequest={() => setShowModal(true)}
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: 56,
              background: "#fff",
              borderBottom: "1.5px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 24px",
              position: "relative",
            }}
          >
            {isMobile && (
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label="Open sidebar"
                style={{
                  position: "absolute",
                  left: 16,
                  top: 10,
                  background: "none",
                  border: "none",
                  fontSize: 28,
                  color: "#bfa600",
                  cursor: "pointer",
                  zIndex: 4000,
                }}
              >
                ☰
              </button>
            )}
            <AdminRequestStatus userRole="admin" />
            <NotificationBell />
          </div>
          <ChatWindow />
        </div>
        <AdminUserManagement userRole="admin" />
        {showModal && (
          <CreateRequestModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </ChatProvider>
  );
}
