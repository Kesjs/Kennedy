import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant ErrorBoundary pour capturer et afficher les erreurs JavaScript dans l'interface utilisateur
 * au lieu de planter tout le composant.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour que le prochain rendu affiche l'UI de secours
    return { 
      hasError: true,
      error: error,
      errorInfo: error.stack 
    };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez également enregistrer l'erreur dans un service de rapport d'erreurs
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo.componentStack
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
    
    // Appeler la fonction de réinitialisation si elle est fournie
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle UI de secours personnalisée
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function' 
          ? this.props.fallback({ 
              error: this.state.error, 
              errorInfo: this.state.errorInfo,
              resetError: this.handleReset 
            })
          : this.props.fallback;
      }

      // UI de secours par défaut
      return (
        <div className="error-boundary p-6 max-w-2xl mx-auto my-8 bg-red-50 rounded-lg shadow">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">
                Une erreur s'est produite
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{this.state.error?.toString()}</p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-sm font-medium text-red-600 cursor-pointer">
                      Détails techniques
                    </summary>
                    <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto max-h-40">
                      {this.state.errorInfo}
                    </pre>
                  </details>
                )}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Si pas d'erreur, afficher les enfants normalement
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /**
   * Composant enfant à envelopper avec le périmètre d'erreur
   */
  children: PropTypes.node.isRequired,
  
  /**
   * UI de secours personnalisée à afficher en cas d'erreur
   * Peut être un composant React ou une fonction qui reçoit { error, errorInfo, resetError }
   */
  fallback: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  
  /**
   * Fonction à appeler lorsque l'erreur est réinitialisée
   */
  onReset: PropTypes.func,
};

export default ErrorBoundary;
