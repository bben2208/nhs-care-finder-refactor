import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from "react";
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { return this.state.hasError ? _jsx("p", { children: "Something went wrong." }) : this.props.children; }
}
