import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((reset: () => void, error: Error | null) => ReactNode);
  onReset?: () => void;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    if (!this.props.onError) {
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (typeof this.props.fallback === "function") {
      return (this.props.fallback as (r: () => void, e: Error | null) => ReactNode)(
        this.handleReset,
        this.state.error
      );
    }
    if (this.props.fallback) return this.props.fallback as ReactNode;

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-card border rounded-2xl p-8 shadow-lg">
          <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This section couldn't load. You can try again or return home.
          </p>
          {this.state.error?.message && (
            <pre className="text-[11px] text-left bg-muted/40 rounded-lg p-3 mb-6 overflow-auto max-h-32 text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={this.handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Try again
            </Button>
            <Button onClick={() => (window.location.href = "/")}>
              <Home className="w-4 h-4 mr-1" /> Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
