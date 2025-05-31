import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService, CalendarEvent } from '../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-root">
      <div class="calendar-root__calendar-panel">
        <div class="calendar-root__calendar-header">
          <button class="calendar-root__nav-btn" (click)="prevMonth()">&#60;</button>
          <span class="calendar-root__month-label">{{ monthNames[displayMonth] }} {{ displayYear }}</span>
          <button class="calendar-root__nav-btn" (click)="nextMonth()">&#62;</button>
        </div>
        <div class="calendar-root__weekdays">
          <div *ngFor="let day of weekDays" class="calendar-root__weekday">{{ day }}</div>
        </div>
        <div class="calendar-root__days">
          <ng-container *ngFor="let day of calendarDays; let i = index">
            <div *ngIf="day === 0" class="calendar-root__empty-day"></div>
            <button *ngIf="day > 0"
              class="calendar-root__day-btn"
              [ngClass]="{
                'calendar-root__day-btn--selected': isSelected(day),
                'calendar-root__day-btn--has-events': hasEvents(day)
              }"
              (click)="selectDay(day)">
              {{ day }}
            </button>
          </ng-container>
        </div>
      </div>
      <div class="calendar-root__events-panel">
        <div class="calendar-root__events-header">Próximos Eventos</div>
        <ng-container *ngIf="selectedEvents.length > 0; else noEvents">
          <div *ngFor="let event of selectedEvents" class="calendar-root__event">
            <div class="calendar-root__event-date">
              <span class="calendar-root__event-day">{{ getDay(event.start.dateTime) }}</span>
              <span class="calendar-root__event-month">Sep</span>
            </div>
            <div class="calendar-root__event-title" [innerHTML]="highlightTitle(event.subject)"></div>
            <div class="calendar-root__event-location">{{ event.location?.displayName }}</div>
            <div class="calendar-root__event-description">{{ eventDescription(event) }}</div>
          </div>
        </ng-container>
        <ng-template #noEvents>
          <div class="calendar-root__no-events">No hay eventos para este día.</div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];
  selectedEvents: CalendarEvent[] = [];
  selectedDate: Date = new Date();
  displayMonth: number = this.selectedDate.getMonth();
  displayYear: number = this.selectedDate.getFullYear();
  calendarDays: number[] = [];

  weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.calendarService.getEvents('').subscribe(data => {
      this.events = data;
      this.updateCalendar();
      this.selectDay(this.selectedDate.getDate());
    });
  }

  updateCalendar() {
    const firstDay = new Date(this.displayYear, this.displayMonth, 1).getDay();
    const daysInMonth = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();
    this.calendarDays = [];
    for (let i = 0; i < firstDay; i++) this.calendarDays.push(0);
    for (let d = 1; d <= daysInMonth; d++) this.calendarDays.push(d);
  }

  prevMonth() {
    if (this.displayMonth === 0) {
      this.displayMonth = 11;
      this.displayYear--;
    } else {
      this.displayMonth--;
    }
    this.updateCalendar();
    this.selectedEvents = [];
  }

  nextMonth() {
    if (this.displayMonth === 11) {
      this.displayMonth = 0;
      this.displayYear++;
    } else {
      this.displayMonth++;
    }
    this.updateCalendar();
    this.selectedEvents = [];
  }

  selectDay(day: number) {
    this.selectedDate = new Date(this.displayYear, this.displayMonth, day);
    const dateStr = this.selectedDate.toISOString().slice(0, 10);
    this.selectedEvents = this.events.filter(ev => ev.start.dateTime.startsWith(dateStr));
  }

  isSelected(day: number): boolean {
    return (
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.displayMonth &&
      this.selectedDate.getFullYear() === this.displayYear
    );
  }

  hasEvents(day: number): boolean {
    const dateStr = new Date(this.displayYear, this.displayMonth, day).toISOString().slice(0, 10);
    return this.events.some(ev => ev.start.dateTime.startsWith(dateStr));
  }

  getDay(dateTime: string): string {
    return new Date(dateTime).getDate().toString().padStart(2, '0');
  }

  highlightTitle(title: string): string {
    // Bold the first part before a comma or dash
    const match = title.match(/^[^,\-]+/);
    if (match) {
      return `<b>${match[0]}</b>${title.slice(match[0].length)}`;
    }
    return title;
  }

  eventDescription(event: CalendarEvent): string {
    // Use subject as description if no description field
    return event.subject;
  }
} 