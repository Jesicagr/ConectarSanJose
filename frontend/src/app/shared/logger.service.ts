import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {

  private readonly prefix = '[ConectarSanJose]';

  info(message: string, ...data: unknown[]): void {
    console.info(`%c${this.prefix} INFO`, 'color:#2563eb', message, ...data);
  }

  warn(message: string, ...data: unknown[]): void {
    console.warn(`%c${this.prefix} WARN`, 'color:#d97706', message, ...data);
  }

  error(message: string, ...data: unknown[]): void {
    console.error(`%c${this.prefix} ERROR`, 'color:#dc2626', message, ...data);
  }
}
