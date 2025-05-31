import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
    type: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // private readonly graphApiEndpoint = 'https://graph.microsoft.com/v1.0';

  // Generate mock events for the current month
  private readonly mockEvents: CalendarEvent[] = (() => {
    const subjects = [
      'Reunión de equipo',
      'Llamada con cliente',
      'Planificación de proyecto',
      'Revisión de código',
      'Presentación de resultados',
      'Sesión de brainstorming',
      'Capacitación interna',
      'Demo de producto',
      'Actualización semanal',
      'Cierre de sprint'
    ];
    const locations = [
      'Sala A',
      'Sala B',
      'Sala de conferencias',
      'Oficina principal',
      'Remoto',
      'Microsoft Teams',
      'Zoom',
      'Google Meet'
    ];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Pick 5 random days in the month
    const eventDays = Array.from(new Set(Array.from({length: 5}, () => Math.floor(Math.random() * daysInMonth) + 1)));
    let idCounter = 1;
    const events: CalendarEvent[] = [];
    for (const day of eventDays) {
      const numEvents = Math.floor(Math.random() * 4) + 3; // 3-6 events
      for (let i = 0; i < numEvents; i++) {
        const startHour = 9 + i * 2;
        const start = new Date(year, month, day, startHour, 0, 0);
        const end = new Date(year, month, day, startHour + 1, 0, 0);
        events.push({
          id: (idCounter++).toString(),
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          start: {
            dateTime: start.toISOString(),
            timeZone: 'America/Bogota'
          },
          end: {
            dateTime: end.toISOString(),
            timeZone: 'America/Bogota'
          },
          location: {
            displayName: locations[Math.floor(Math.random() * locations.length)]
          },
          attendees: []
        });
      }
    }
    return events;
  })();

  constructor(/* private http: HttpClient */) {}

  // Always return mock data, never call a real API
  getEvents(email: string): Observable<CalendarEvent[]> {
    // Commented out real API/token logic
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.getAccessToken()}`,
    //   'Content-Type': 'application/json'
    // });
    // ...
    // return this.http.get<{ value: CalendarEvent[] }>(...)
    //   .pipe(map(response => response.value));

    return new Observable(observer => {
      observer.next(this.mockEvents);
      observer.complete();
    });
  }

  // private getAccessToken(): string {
  //   // Implement your token acquisition logic here
  //   // This could be from a token service, local storage, or other secure storage
  //   const token = localStorage.getItem('msal.accessToken');
  //   if (!token) {
  //     throw new Error('No access token available');
  //   }
  //   return token;
  // }
} 