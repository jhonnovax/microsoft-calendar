import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarService, CalendarEvent } from '../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calendar-container p-4">
      <div class="calendar-header mb-4">
        <h2 class="text-2xl font-bold">Calendar Events</h2>
        <div class="flex gap-2 mt-2">
          <input 
            type="email" 
            [(ngModel)]="userEmail" 
            placeholder="Enter email address"
            class="input input-bordered w-full max-w-xs"
          />
          <button 
            (click)="fetchEvents()"
            class="btn btn-primary"
            [disabled]="isLoading"
          >
            {{ isLoading ? 'Loading...' : 'Fetch Events' }}
          </button>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-error mb-4">
        {{ error }}
      </div>

      <div class="calendar-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let event of events" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">{{ event.subject }}</h3>
            <div class="text-sm opacity-70">
              <p>Start: {{ formatDateTime(event.start.dateTime) }}</p>
              <p>End: {{ formatDateTime(event.end.dateTime) }}</p>
              <p *ngIf="event?.location?.displayName">
                Location: {{ event?.location?.displayName }}
              </p>
            </div>
            <div *ngIf="event.attendees?.length" class="mt-2">
              <h4 class="font-semibold">Attendees:</h4>
              <ul class="list-disc list-inside">
                <li *ngFor="let attendee of event.attendees">
                  {{ attendee.emailAddress.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="events.length === 0 && !isLoading && !error" class="text-center mt-8">
        <p class="text-lg opacity-70">No events found for the selected period.</p>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];
  userEmail: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {}

  fetchEvents(): void {
    if (!this.userEmail) {
      this.error = 'Please enter an email address';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.calendarService.getEvents(this.userEmail).subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error fetching calendar events. Please try again.';
        this.isLoading = false;
        console.error('Error fetching events:', err);
      }
    });
  }

  formatDateTime(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }
  
} 