import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toast = new BehaviorSubject<Toast>({ message: '', type: 'info', visible: false });
  toast$ = this.toast.asObservable();
  private timeout: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.toast.next({ message, type, visible: true });
    this.timeout = setTimeout(() => {
      this.toast.next({ message: '', type: 'info', visible: false });
    }, 3500);
  }

  hide(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.toast.next({ message: '', type: 'info', visible: false });
  }
}
