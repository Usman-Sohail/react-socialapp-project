import React from "react";
import { toast } from "react-toastify";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
    toast.error("Session expired or unexpected error. Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "1rem",
            background: "#000000ff",
            color: "red",
            borderRadius: "8px",
            margin: "1rem 0",
            textAlign: "center",
          }}
        >
          <h3>Something went wrong.</h3>
          <p>{this.state.error?.message}</p>
          <p>Reloading the page...</p>
        </div>
      );
    }

    return this.props.children;
  }
}
