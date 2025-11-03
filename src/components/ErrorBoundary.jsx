import React from "react";
import "../ErrorBoundary.css";
import { toast } from "react-toastify";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, countdown: 3 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);

    toast.error(`Error: ${error.message || "Something went wrong"}`);

    this.interval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.countdown <= 1) {
          clearInterval(this.interval);
          window.location.reload();
          return { countdown: 0 };
        }
        return { countdown: prevState.countdown - 1 };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <h3>Something went wrong.</h3>
          <p>Reloading the page in {this.state.countdown}...</p>
        </div>
      );
    }

    return this.props.children;
  }
}
