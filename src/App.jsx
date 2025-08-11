import React from "react";
import Routes from "./Routes";
import { NavigationProvider } from "./components/ui/RoleBasedNavigation";

/**
 * Main App Component - Entry point of the application
 * 
 * Wraps the entire app with NavigationProvider to provide:
 * - Authentication state management
 * - User role management 
 * - Logout functionality
 * - Route navigation context
 */
function App() {
  return (
    <NavigationProvider>
      <Routes />
    </NavigationProvider>
  );
}

export default App;