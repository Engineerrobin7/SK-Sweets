// Simple logger utility for production-safe logging
enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

const isDevelopment = process.env.NODE_ENV === 'development';

function formatLog(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const logger = {
  error: (message: string, error?: any) => {
    formatLog(LogLevel.ERROR, message, error);
  },
  warn: (message: string, data?: any) => {
    formatLog(LogLevel.WARN, message, data);
  },
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      formatLog(LogLevel.INFO, message, data);
    }
  },
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      formatLog(LogLevel.DEBUG, message, data);
    }
  },
};
