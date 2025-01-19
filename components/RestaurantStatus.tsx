import { useState, useEffect } from 'react';
import { format, differenceInMinutes, addDays } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

type TimeRange = {
  start: string;
  end: string;
};

type Schedule = {
  morning: TimeRange;
  lunch: TimeRange;
  dinner: TimeRange;
};

const schedule: Schedule = {
  morning: { start: '08:00', end: '09:30' },
  lunch: { start: '12:30', end: '16:00' },
  dinner: { start: '18:00', end: '21:00' },
};

function getStatus(currentTime: Date): { isOpen: boolean; message: string; color: string } {
  const timeStr = format(currentTime, 'HH:mm');
  const dayStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());

  for (const [meal, { start, end }] of Object.entries(schedule)) {
    const startTime = new Date(dayStart.getTime() + parseTime(start));
    const endTime = new Date(dayStart.getTime() + parseTime(end));

    if (timeStr >= start && timeStr < end) {
      const remainingMinutes = differenceInMinutes(endTime, currentTime);
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      const timeString = hours > 0 ? `${hours} ώρ${hours > 1 ? 'ες' : 'α'} και ${minutes} λεπτά` : `${minutes} λεπτά`;
      return {
        isOpen: true,
        message: `Το εστιατόριο θα είναι ανοιχτό για το ${meal === 'morning' ? 'πρωινό' : meal === 'lunch' ? 'μεσημεριανό' : 'βραδινό' } για ${timeString} ακόμα.`,
        color: 'bg-green-100 border-green-500 text-green-700',
      };
    }

    if (timeStr < start) {
      const waitMinutes = differenceInMinutes(startTime, currentTime);
      const hours = Math.floor(waitMinutes / 60);
      const minutes = waitMinutes % 60;
      const timeString = hours > 0 ? `${hours} ώρ${hours > 1 ? 'ες' : 'α'} και ${minutes} λεπτά` : `${minutes} λεπτά`;
      return {
        isOpen: false,
        message: `Το εστιατόριο είναι κλειστό. Το ${meal === 'morning' ? 'πρωινό' : meal === 'lunch' ? 'μεσημεριανό' : 'βραδινό'} θα είναι διαθέσιμο σε ${timeString}.`,
        color: 'bg-yellow-100 border-yellow-500 text-yellow-700',
      };
    }
  }

  // If we're past the last meal of the day
  const nextDayMorning = addDays(dayStart, 1);
  const waitMinutes = differenceInMinutes(nextDayMorning, currentTime) + parseTime(schedule.morning.start) / 60000;
  const hours = Math.floor(waitMinutes / 60);
  const minutes = waitMinutes % 60;
  return {
    isOpen: false,
    message: `Το εστιατόριο έχει κλείσει για σήμερα. Θα ανοίξει αύριο σε ${hours} ώρες και ${minutes} λεπτά για το πρωινό.`,
    color: 'bg-red-100 border-red-500 text-red-700',
  };
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60 + minutes) * 60000;
}

export function RestaurantStatus() {
  const [status, setStatus] = useState(getStatus(new Date()));
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getStatus(new Date()));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <div className={`relative ${status.color} rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'h-auto' : 'h-12'}`} role="alert">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-bold">Κατάσταση Εστιατορίου</p>
        <button
          onClick={toggleExpanded}
          className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200"
          aria-label={isExpanded ? "Απόκρυψη κατάστασης εστιατορίου" : "Εμφάνιση κατάστασης εστιατορίου"}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      <div className={`px-4 pb-4 transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <p>{status.message}</p>
      </div>
    </div>
  );
}


