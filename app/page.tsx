'use client';

import { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { monthlySchedule } from '@/lib/schedule';
import elLocale from 'date-fns/locale/el';

export default function FoodSchedule() {
  const [date, setDate] = useState<Date>(new Date());
  const [schedule, setSchedule] = useState<any>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    updateSchedule(date);
    document.body.classList.toggle('dark', isDarkTheme);
  }, [date, isDarkTheme]);

  const dayMapping = {
    κυριακή: "sunday",
    δευτέρα: "monday",
    τρίτη: "tuesday",
    τετάρτη: "wednesday",
    πέμπτη: "thursday",
    παρασκευή: "friday",
    σάββατο: "saturday",
  };

  const updateSchedule = (selectedDate: Date) => {
    const dayOfWeekGreek = format(selectedDate, "EEEE", { locale: elLocale }).toLowerCase(); // Greek day name
    const dayOfWeek = dayMapping[dayOfWeekGreek as keyof typeof dayMapping]; // Map to English

    const weekNumber = Math.min(Math.floor((selectedDate.getDate() - 1) / 7) + 1, 4); // Cap weekNumber to 4
    const weekKey = `week${weekNumber}` as keyof typeof monthlySchedule;

    // Check if the week and day exist in the schedule
    if (
      dayOfWeek &&
      monthlySchedule[weekKey] &&
      monthlySchedule[weekKey][dayOfWeek as keyof typeof monthlySchedule[typeof weekKey]]
    ) {
      setSchedule(
        monthlySchedule[weekKey][dayOfWeek as keyof typeof monthlySchedule[typeof weekKey]]
      );
    } else {
      setSchedule(null); // No schedule available
    }
  };

  const handlePrevDay = () => setDate(prevDate => subDays(prevDate, 1));
  const handleNextDay = () => setDate(nextDate => addDays(nextDate, 1));

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const currentTime = new Date().getHours();
  const isLunchPassed = isToday(date) && currentTime >= 16;
  const isDinnerPassed = isToday(date) && currentTime >= 21;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-8">
        <h1 className="text-2xl font-semibold">Πρόγραμμα Λέσχης</h1>
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={isDarkTheme}
            onCheckedChange={setIsDarkTheme}
          />
          <Moon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" size="icon" onClick={handlePrevDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: elLocale }) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate && newDate.getFullYear() === 2025) {
                  setDate(newDate);
                }
              }}
              fromDate={new Date(2025, 0, 1)} // January 1, 2025
              toDate={new Date(2025, 11, 31)} // December 31, 2025
              initialFocus
              locale={elLocale}
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="icon" onClick={handleNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {schedule ? (
        <Card className="w-full max-w-md mb-8">
          <CardHeader>
            <CardTitle>{format(date, 'EEEE, d MMMM, yyyy', { locale: elLocale })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MealSection title="Μεσημεριανό" options={schedule.lunch} isPassed={isLunchPassed} />
            <MealSection title="Βραδινό" options={schedule.dinner} isPassed={isDinnerPassed} />
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md mb-8">
          <CardHeader>
            <CardTitle>{format(date, 'EEEE, MMMM d, yyyy', { locale: elLocale })}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No schedule available for this date.</p>
          </CardContent>
        </Card>
      )}
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle>Ωράρια Λέσχης</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><span className="font-medium">Πρωί:</span> 8:00-9:30</p>
            <p><span className="font-medium">Μεσημέρι:</span> 12:30-16:00</p>
            <p><span className="font-medium">Βράδυ:</span> 18:00-21:00</p>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} - Made with ❤ by <a href="https://opensourceduth.gr" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}> OpenSource DUTH</a>
      </footer>
    </div>
  );
}

function MealSection({ title, options, isPassed, }: {
  title: string;
  options: Record<string, string>;
  isPassed: boolean;
}) {
  return (
    <div className={cn("space-y-2", isPassed && "opacity-50")}>
      <h3 className="font-medium">{title}</h3>
      <ul className="space-y-1">
        {Object.entries(options).map(([key, value], index) => (
          <li key={key} className="text-sm">
            {/* <span className="font-medium">{`• ${index + 1}`}</span> {value} */}
            <span className="font-medium">{`• `}</span> {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

