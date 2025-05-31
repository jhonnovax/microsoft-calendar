// import axios from 'axios'; // Comment out if you were using axios or fetch

// Mock data for events
const mockEvents = {
  '2024-09-06': [
    {
      title: 'Acciones de preparación frente a la alerta por mpox, en Colombia',
      time: '10:00 - 11:00',
      location: 'Microsoft TEAMS',
      description: 'Sesión virtual Microsoft TEAMS'
    }
  ],
  '2024-09-10': [
    {
      title: 'Semana de Prevención del Suicidio',
      time: '09:00 - 10:00',
      location: '',
      description: 'Riesgo psicosocial y prevención de la conducta suicida'
    },
    {
      title: 'Semana de Prevención del Suicidio',
      time: '11:00 - 12:00',
      location: '',
      description: 'La demencia: mitos y realidades'
    },
    {
      title: 'Semana de Prevención del Suicidio',
      time: '14:00 - 15:00',
      location: '',
      description: 'Programa para fortalecer la Atención Primaria en Salud...'
    }
  ]
  // ...more mock events
};

export function getEventsByDate(date) {
  // Always return mock data, never call a real API
  return Promise.resolve(mockEvents[date] || []);
} 