import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertType = 'success' | 'error';

interface Alert {
  id: number;
  message: string;
  type: AlertType;
  secondsLeft: number;
}

@Injectable({ providedIn: 'root' })
export class ToasterService {
  private alerts: Alert[] = [];
  private alertSubject = new BehaviorSubject<Alert[]>([]);
  alert$ = this.alertSubject.asObservable();

  private idCounter = 0;

  success(message: string, time?: number) {
    this.show(message, 'success', time);
  }

  error(message: string, time?: number) {
    this.show(message, 'error', time);
  }

  show(message: string, type?: AlertType, time?: number) {
    if (!type) {
      type = 'success';
    }
    if (!time) {
      time = 3;
    }
    const alert: Alert = {
      id: this.idCounter++,
      message,
      type,
      secondsLeft: time,
    };

    this.alerts.push(alert);
    this.alertSubject.next([...this.alerts]);

    const intervalId = setInterval(() => {
      const index = this.alerts.findIndex((a) => a.id === alert.id);
      if (index !== -1) {
        this.alerts[index].secondsLeft -= 1;
        this.alertSubject.next([...this.alerts]);

        if (this.alerts[index].secondsLeft === 0) {
          this.alerts.splice(index, 1);
          this.alertSubject.next([...this.alerts]);
          clearInterval(intervalId);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  }
}
