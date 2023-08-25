import React from "react"

import CustomizableDashboard from "../pages/CustomizableDashboard/CustomizableDashboard"
import DashboardNavigator from "../pages/CustomizableDashboard/DashboardNavigator";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

export const AllRoutes = {
  BASE_PATH: { path: '/', component: NotFoundPage },

  // // ------------ DASHBOARD ROUTES ------------
  CUSTOMIZABLE_DASHBOARD: {
    path: '/buildings/534/dashboard/202',
    component: CustomizableDashboard,
    public: true
  },
  DASHBOARD_NAVIGATOR: {
    path: '/buildings/:buildingId/dashboards',
    component: DashboardNavigator,
    public: true
  },
  NOT_FOUND: { path: '', component: NotFoundPage, public: true },
}