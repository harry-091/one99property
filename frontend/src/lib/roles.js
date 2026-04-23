export const roleLabels = {
  channel_partner: "Channel Partner",
  staff: "Staff / Telecaller",
  manager: "Manager",
  admin: "Admin",
  rental_team: "Rental Team"
};

export const dashboardRoutes = {
  channel_partner: "/dashboard",
  staff: "/dashboard",
  manager: "/dashboard",
  admin: "/admin/users",
  rental_team: "/dashboard"
};

export const hasAnyRole = (user, roles) => user && roles.includes(user.role);

