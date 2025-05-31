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
  private readonly graphApiEndpoint = 'https://graph.microsoft.com/v1.0';

  constructor(private http: HttpClient) {}

  getEvents(email: string): Observable<CalendarEvent[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Content-Type': 'application/json'
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Get events for next 30 days

    const queryParams = new URLSearchParams({
      $select: 'id,subject,start,end,location,attendees',
      $filter: `start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'`,
      $orderby: 'start/dateTime'
    });

    return this.http.get<{ value: CalendarEvent[] }>(
      `${this.graphApiEndpoint}/users/${email}/calendar/events?${queryParams}`,
      { headers }
    ).pipe(
      map(response => response.value)
    );
  }

  private getAccessToken(): string {
    // Implement your token acquisition logic here
    // This could be from a token service, local storage, or other secure storage
    const token = localStorage.getItem('msal.accessToken');
    if (!token) {
      throw new Error('No access token available');
    }
    return token;
  }
} 