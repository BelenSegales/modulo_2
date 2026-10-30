import { Component, type ErrorInfo, type ReactNode } from "react";

// Component hereda los componentes de clase
// ErrorInfo
// ReactNode nos van a indicar que se borrar al momento de compilar

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  tieneError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { tieneError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { tieneError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log("Error Boundaryc capturado: ", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.tieneError) {
      return (
        this.props.fallback ?? (
          <div>
            <p>Salio mal</p>
            <p>{this.state.error?.message} </p>

            <button
              type="button"
              onClick={() => this.setState({ tieneError: false, error: null })}
            >
              Intentar de nuevo
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
