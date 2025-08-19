// Logical access control utility for user permissions
export function getUserAccess(user) {
  const isRootAdmin = user?.role === "ROOT_ADMIN";
  const isAdmin = user?.role === "ADMIN";
  const isPremium = !!user?.isPremium || isRootAdmin;

  return {
    isRootAdmin,
    isAdmin,
    isPremium,
    canAccessPremium: isPremium,
    canManageRoles: isRootAdmin,
    canAccessAdminPanel: isAdmin || isRootAdmin,
    // Extend as needed for more features
  };
}
