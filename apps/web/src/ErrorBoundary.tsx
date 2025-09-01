import { Component } from "react";
import type { ReactNode } from "react";
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <p>Something went wrong.</p> : this.props.children; }
}