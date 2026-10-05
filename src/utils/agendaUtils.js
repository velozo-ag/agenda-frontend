export function calculateOverlaps(appointments) {
  if (!appointments || appointments.length === 0) return new Map();

  // Sort by start time, then end time
  const sorted = [...appointments].sort((a, b) => {
    const aStart = new Date(a.startTime).getTime();
    const bStart = new Date(b.startTime).getTime();
    if (aStart === bStart) {
      return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
    }
    return aStart - bStart;
  });

  const columns = [];
  
  for (const appt of sorted) {
    const start = new Date(appt.startTime).getTime();
    let placed = false;
    
    // Find a column where the last appointment ends before this one starts
    for (const col of columns) {
      const lastAppt = col[col.length - 1];
      if (new Date(lastAppt.endTime).getTime() <= start) {
        col.push(appt);
        placed = true;
        break;
      }
    }
    
    if (!placed) {
      columns.push([appt]);
    }
  }

  // Calculate widths and offsets
  const numColumns = columns.length;
  const layout = new Map();
  
  columns.forEach((col, colIndex) => {
    col.forEach(appt => {
      layout.set(appt.id, {
        width: `${100 / numColumns}%`,
        left: `${(colIndex * 100) / numColumns}%`
      });
    });
  });

  return layout;
}
