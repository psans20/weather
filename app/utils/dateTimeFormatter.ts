
export function formatDateTime(date: Date): string {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.toLocaleDateString('en-US', { year: 'numeric' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    return `${dayName}, ${day} ${month} ${year} | Local time: ${time}`;
  }
  