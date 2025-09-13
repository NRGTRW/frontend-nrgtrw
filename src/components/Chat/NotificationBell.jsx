import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext";

export default function NotificationBell() {
  const chatContext = useChatContext();
  const notifications = chatContext?.notifications || [];
  const notificationsLoading = chatContext?.notificationsLoading || false;
  const markNotificationRead = chatContext?.markNotificationRead;
  const isAuthenticated = chatContext?.isAuthenticated || false;
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ position: "relative", marginLeft: 18 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: 0,
        }}
        aria-label="Notifications"
      >
        <span style={{ fontSize: 26, color: "#bfa600" }}>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#ffe067",
              color: "#181a1b",
              borderRadius: "50%",
              fontSize: 13,
              fontWeight: 700,
              padding: "2px 7px",
              border: "1.5px solid #fff",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 36,
            width: 320,
            background: "#fff",
            border: "1.5px solid #ffe067",
            borderRadius: 10,
            boxShadow: "0 4px 24px #ffe06722",
            zIndex: 100,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1.5px solid #eee",
              fontWeight: 700,
              color: "#bfa600",
              fontSize: 16,
            }}
          >
            Notifications
          </div>
          {notificationsLoading ? (
            <div style={{ padding: 18 }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: 18, color: "#888" }}>No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f7f7f7",
                  background: n.read ? "#fff" : "#fffbe6",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    color: n.read ? "#888" : "#181a1b",
                    fontWeight: n.read ? 400 : 600,
                  }}
                >
                  {n.content}
                </span>
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    style={{
                      fontSize: 13,
                      color: "#bfa600",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
