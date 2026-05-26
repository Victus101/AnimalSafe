/**
 * Logger Utility
 * Simple logging with environment awareness
 */

import { APP_CONFIG } from '../constants/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private prefix = '[AnimalSafe]';

  private formatMessage(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const levelTag = level.toUpperCase();

    if (data) {
      return `${this.prefix} [${timestamp}] ${levelTag}: ${message} ${JSON.stringify(data)}`;
    }

    return `${this.prefix} [${timestamp}] ${levelTag}: ${message}`;
  }

  debug(message: string, data?: any) {
    if (APP_CONFIG.DEBUG) {
      console.log(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: any) {
    console.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any) {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: Error | any) {
    console.error(this.formatMessage('error', message, error));
  }
}

export const logger = new Logger();
