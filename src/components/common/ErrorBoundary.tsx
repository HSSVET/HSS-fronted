import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Paper,
  Fade,
  Slide,
  CircularProgress
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  BugReport as BugReportIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Report as ReportIcon,
  Code as CodeIcon,
  Timeline as TimelineIcon,
  Storage as StorageIcon,
  Computer as ComputerIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  showDetails: boolean;
  showReportDialog: boolean;
  reportSent: boolean;
  lastErrorTime: Date | null;
  errorHistory: ErrorLogEntry[];
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting?: boolean;
  enableRecovery?: boolean;
  maxRetries?: number;
  showErrorDetails?: boolean;
  reportEndpoint?: string;
  level?: 'page' | 'component' | 'global';
  context?: string;
  customActions?: ErrorAction[];
}

interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  error: Error;
  errorInfo: ErrorInfo;
  context?: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  additionalInfo?: Record<string, any>;
}

interface ErrorAction {
  label: string;
  action: () => void;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

interface ErrorReport {
  errorId: string;
  description: string;
  steps: string;
  userEmail: string;
  includeDetails: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// Error Reporting Service
// ============================================================================

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private errorQueue: ErrorLogEntry[] = [];
  private reportingEnabled: boolean = true;

  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  public async reportError(entry: ErrorLogEntry): Promise<boolean> {
    if (!this.reportingEnabled) return false;

    try {
      // In a real app, this would send to your error reporting service
      // like Sentry, LogRocket, Bugsnag, etc.
      console.group('🚨 Error Report');
      console.error('Error:', entry.error);
      console.error('Error Info:', entry.errorInfo);
      console.error('Context:', entry.context);
      console.error('Additional Info:', entry.additionalInfo);
      console.groupEnd();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in local storage for persistence
      const existingErrors = this.getStoredErrors();
      existingErrors.push(entry);
      localStorage.setItem('errorHistory', JSON.stringify(existingErrors.slice(-50))); // Keep last 50 errors

      return true;
    } catch (error) {
      console.error('Failed to report error:', error);
      return false;
    }
  }

  public getStoredErrors(): ErrorLogEntry[] {
    try {
      const stored = localStorage.getItem('errorHistory');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public clearErrorHistory(): void {
    localStorage.removeItem('errorHistory');
  }

  public setReportingEnabled(enabled: boolean): void {
    this.reportingEnabled = enabled;
  }
}

// ============================================================================
// Error Boundary Component
// ============================================================================

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorReporter: ErrorReportingService;
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      showDetails: false,
      showReportDialog: false,
      reportSent: false,
      lastErrorTime: null,
      errorHistory: []
    };

    this.errorReporter = ErrorReportingService.getInstance();
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastErrorTime: new Date()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorEntry: ErrorLogEntry = {
      id: this.state.errorId || `error_${Date.now()}`,
      timestamp: new Date(),
      error,
      errorInfo,
      context: this.props.context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      additionalInfo: {
        level: this.props.level,
        retryCount: this.state.retryCount,
        props: this.props,
        timestamp: new Date().toISOString()
      }
    };

    this.setState(prevState => ({
      errorInfo,
      errorHistory: [...prevState.errorHistory, errorEntry]
    }));

    // Report error
    if (this.props.enableReporting !== false) {
      this.errorReporter.reportError(errorEntry);
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  componentWillUnmount() {
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private getUserId(): string | undefined {
    // This would get the actual user ID from your auth context
    return 'user_123';
  }

  private getSessionId(): string | undefined {
    // This would get the actual session ID from your auth context
    return 'session_456';
  }

  private generateErrorReport(): string {
    const { error, errorInfo } = this.state;
    if (!error || !errorInfo) return '';

    return `
Error Report
============

Error Message: ${error.message}
Error Stack: ${error.stack}
Component Stack: ${errorInfo.componentStack}
Context: ${this.props.context || 'Unknown'}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
Retry Count: ${this.state.retryCount}

Additional Info:
${JSON.stringify(this.state.errorHistory.slice(-1)[0]?.additionalInfo || {}, null, 2)}
    `.trim();
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      alert(`Maximum retry attempts (${maxRetries}) reached. Please refresh the page.`);
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      showDetails: false
    }));

    // Add a small delay to prevent immediate re-error
    const timeout = setTimeout(() => {
      // Force re-render
      this.forceUpdate();
    }, 500);

    this.retryTimeouts.push(timeout);
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleToggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  private handleOpenReportDialog = () => {
    this.setState({ showReportDialog: true });
  };

  private handleCloseReportDialog = () => {
    this.setState({ showReportDialog: false });
  };

  private handleSendReport = async (report: ErrorReport) => {
    try {
      // Simulate sending report
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({ 
        reportSent: true, 
        showReportDialog: false 
      });
      
      setTimeout(() => {
        this.setState({ reportSent: false });
      }, 3000);
    } catch (error) {
      console.error('Failed to send report:', error);
    }
  };

  private renderErrorDetails() {
    const { error, errorInfo, errorHistory } = this.state;
    if (!error || !errorInfo) return null;

    const errorReport = this.generateErrorReport();

    return (
      <Collapse in={this.state.showDetails}>
        <Box sx={{ mt: 2 }}>
          <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Error Details
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="error">
                Error Message:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                p: 1,
                borderRadius: 1,
                fontSize: '0.75rem'
              }}>
                {error.message}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="warning.main">
                Stack Trace:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backgroundColor: 'warning.light',
                color: 'warning.contrastText',
                p: 1,
                borderRadius: 1,
                fontSize: '0.75rem',
                maxHeight: 200,
                overflow: 'auto'
              }}>
                {error.stack}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="info.main">
                Component Stack:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backgroundColor: 'info.light',
                color: 'info.contrastText',
                p: 1,
                borderRadius: 1,
                fontSize: '0.75rem',
                maxHeight: 200,
                overflow: 'auto'
              }}>
                {errorInfo.componentStack}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                System Information:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  icon={<ComputerIcon />}
                  label={`Browser: ${navigator.userAgent.split(' ')[0]}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<ScheduleIcon />}
                  label={`Time: ${new Date().toLocaleString()}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<PersonIcon />}
                  label={`User: ${this.getUserId() || 'Anonymous'}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<TimelineIcon />}
                  label={`Retry: ${this.state.retryCount}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>

            {errorHistory.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Recent Error History:
                </Typography>
                <List dense>
                  {errorHistory.slice(-3).map((entry, index) => (
                    <ListItem key={entry.id} divider>
                      <ListItemIcon>
                        <ErrorIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={entry.error.message}
                        secondary={entry.timestamp.toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Box>
      </Collapse>
    );
  }

  private renderReportDialog() {
    const [description, setDescription] = React.useState('');
    const [steps, setSteps] = React.useState('');
    const [userEmail, setUserEmail] = React.useState('');
    const [includeDetails, setIncludeDetails] = React.useState(true);
    const [severity, setSeverity] = React.useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    const [sending, setSending] = React.useState(false);

    const handleSubmit = async () => {
      setSending(true);
      
      const report: ErrorReport = {
        errorId: this.state.errorId || '',
        description,
        steps,
        userEmail,
        includeDetails,
        severity
      };

      await this.handleSendReport(report);
      setSending(false);
    };

    return (
      <Dialog
        open={this.state.showReportDialog}
        onClose={this.handleCloseReportDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReportIcon sx={{ mr: 1 }} />
            Send Error Report
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe what happened"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            placeholder="Please describe what you were doing when the error occurred..."
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Steps to reproduce"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            margin="normal"
            placeholder="1. First I clicked...\n2. Then I..."
          />
          <TextField
            fullWidth
            label="Your email (optional)"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            margin="normal"
            placeholder="your.email@example.com"
          />
          <FormControlLabel
            control={
              <Switch
                checked={includeDetails}
                onChange={(e) => setIncludeDetails(e.target.checked)}
              />
            }
            label="Include technical details"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseReportDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={sending || !description.trim()}
            startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {sending ? 'Sending...' : 'Send Report'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    if (this.state.hasError) {
      const { error, retryCount } = this.state;
      const { maxRetries = 3, level = 'component', customActions = [] } = this.props;

      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Fade in={true} timeout={600}>
          <Card 
            elevation={4}
            sx={{ 
              m: 2, 
              borderLeft: 4, 
              borderColor: 'error.main',
              backgroundColor: 'error.light',
              color: 'error.contrastText'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ErrorIcon sx={{ mr: 1, fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {level === 'global' ? 'Application Error' : 
                     level === 'page' ? 'Page Error' : 'Component Error'}
                  </Typography>
                  <Typography variant="body1">
                    {error?.message || 'An unexpected error occurred'}
                  </Typography>
                </Box>
              </Box>

              {this.state.reportSent && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <AlertTitle>Report Sent</AlertTitle>
                  Thank you for reporting this error. We'll investigate and fix it soon.
                </Alert>
              )}

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={`Error ID: ${this.state.errorId}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Retry: ${retryCount}/${maxRetries}`}
                    size="small"
                    variant="outlined"
                    color={retryCount >= maxRetries ? 'error' : 'default'}
                  />
                  <Chip
                    label={`Level: ${level}`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {this.props.enableRecovery !== false && retryCount < maxRetries && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleRetry}
                      startIcon={<RefreshIcon />}
                    >
                      Try Again
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    onClick={this.handleRefresh}
                    startIcon={<RefreshIcon />}
                  >
                    Refresh Page
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={this.handleGoHome}
                    startIcon={<HomeIcon />}
                  >
                    Go Home
                  </Button>
                  
                  {this.props.enableReporting !== false && (
                    <Button
                      variant="text"
                      onClick={this.handleOpenReportDialog}
                      startIcon={<BugReportIcon />}
                    >
                      Report Error
                    </Button>
                  )}
                  
                  {customActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      color={action.color || 'primary'}
                      onClick={action.action}
                      startIcon={action.icon}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {this.props.showErrorDetails !== false && (
                <Box>
                  <Button
                    variant="text"
                    onClick={this.handleToggleDetails}
                    startIcon={this.state.showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                  </Button>
                  {this.renderErrorDetails()}
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Higher-Order Component for Error Boundaries
// ============================================================================

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// ============================================================================
// Utility Functions
// ============================================================================

export const logError = (error: Error, context?: string) => {
  const entry: ErrorLogEntry = {
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    error,
    errorInfo: { componentStack: 'N/A' },
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    additionalInfo: {
      manual: true,
      timestamp: new Date().toISOString()
    }
  };

  ErrorReportingService.getInstance().reportError(entry);
};

export const clearErrorHistory = () => {
  ErrorReportingService.getInstance().clearErrorHistory();
};

export const getErrorHistory = () => {
  return ErrorReportingService.getInstance().getStoredErrors();
};

// ============================================================================
// Specialized Error Boundaries
// ============================================================================

export const GlobalErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    level="global"
    context="Global Application"
    enableReporting={true}
    enableRecovery={true}
    maxRetries={1}
    showErrorDetails={true}
  >
    {children}
  </ErrorBoundary>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode; pageName?: string }> = ({ 
  children, 
  pageName 
}) => (
  <ErrorBoundary
    level="page"
    context={pageName ? `Page: ${pageName}` : 'Page'}
    enableReporting={true}
    enableRecovery={true}
    maxRetries={2}
    showErrorDetails={true}
  >
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{ 
  children: ReactNode; 
  componentName?: string;
  fallback?: ReactNode;
}> = ({ children, componentName, fallback }) => (
  <ErrorBoundary
    level="component"
    context={componentName ? `Component: ${componentName}` : 'Component'}
    enableReporting={true}
    enableRecovery={true}
    maxRetries={3}
    showErrorDetails={false}
    fallback={fallback}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary; 