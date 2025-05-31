import { useState } from 'react';
import { fetchEventsByDate } from '../helpers/fetchEvents';

function CalendarEvents() {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState([]);

  function handleDayClick(date) {
    setSelectedDate(date);
    fetchEventsByDate(date).then(setEvents);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Calendar UI (simplified for example) */}
      <div className="bg-base-200 rounded-lg p-4 w-full md:w-1/2">
        <div className="text-center font-bold text-lg mb-2">Septiembre 2024</div>
        <div className="grid grid-cols-7 gap-2">
          {/* Example: Render days 1-30 */}
          {[...Array(30)].map((_, i) => {
            const day = i + 1;
            const dateStr = `2024-09-${day.toString().padStart(2, '0')}`;
            return (
              <button
                key={dateStr}
                className={`rounded p-2 ${selectedDate === dateStr ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}
                onClick={() => handleDayClick(dateStr)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      {/* Events Sidebar */}
      <div className="bg-base-100 rounded-lg p-4 w-full md:w-1/2">
        <div className="font-bold text-center mb-2">Próximos Eventos</div>
        {events.length === 0 ? (
          <div className="text-center text-gray-400">No hay eventos para este día.</div>
        ) : (
          <ul className="space-y-4">
            {events.map((event, idx) => (
              <li key={idx} className="border-b pb-2">
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-primary">{event.time}</div>
                {event.location && (
                  <div className="text-xs text-gray-500">{event.location}</div>
                )}
                <div className="text-xs">{event.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CalendarEvents; 