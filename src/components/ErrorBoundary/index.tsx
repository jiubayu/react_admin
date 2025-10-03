import React from "react";
import type { PropsWithChildren } from "react";

class ErrorBoundary extends React.Component {
  state: { hasError: boolean; error: string };
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Catch errors in any components below and re-render with error message
    this.setState({
      hasError: true,
      error: error.message,
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>{this.state.error}</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;