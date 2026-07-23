import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";

const queryClient = new QueryClient();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
    <ThemeProvider>

      <AuthProvider>

        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontWeight: "500",
            },
          }}
        />

      </AuthProvider>

    </ThemeProvider>
  </QueryClientProvider>
  </React.StrictMode>
);