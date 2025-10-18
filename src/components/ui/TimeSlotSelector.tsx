import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface TimeSlot {
  day: string;
  times: string[];
}

interface TimeSlotSelectorProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ value, onChange }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addTimeSlots = () => {
    if (selectedDays.length === 0 || !startTime || !endTime) return;

    if (startTime >= endTime) {
      return;
    }

    const timeSlot = `${startTime}-${endTime}`;

    const updatedSlots = [...value];

    selectedDays.forEach(day => {
      const existingDay = updatedSlots.find(slot => slot.day === day);
      
      if (existingDay) {
        if (!existingDay.times.includes(timeSlot)) {
          existingDay.times = [...existingDay.times, timeSlot].sort();
        }
      } else {
        updatedSlots.push({ day, times: [timeSlot] });
      }
    });

    onChange(updatedSlots);
    setSelectedDays([]);
    setStartTime('');
    setEndTime('');
  };

  const removeTimeSlot = (day: string, time: string) => {
    const updatedSlots = value
      .map(slot => {
        if (slot.day === day) {
          const newTimes = slot.times.filter(t => t !== time);
          return newTimes.length > 0 ? { ...slot, times: newTimes } : null;
        }
        return slot;
      })
      .filter(Boolean) as TimeSlot[];

    onChange(updatedSlots);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div>
          <Label className="text-sm font-semibold mb-3 block">Select Days</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DAYS.map(day => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                />
                <label
                  htmlFor={day}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <Button 
            onClick={addTimeSlots} 
            disabled={selectedDays.length === 0 || !startTime || !endTime}
            className="w-full"
          >
            Add Availability
          </Button>
        </div>
      </Card>

      {value.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-3">Selected Availability:</h4>
          <div className="space-y-3">
            {value.map(slot => (
              <div key={slot.day}>
                <p className="text-sm font-medium mb-2">{slot.day}</p>
                <div className="flex flex-wrap gap-2">
                  {slot.times.map(time => (
                    <Badge key={time} variant="secondary" className="gap-1 pr-1">
                      {time}
                      <button
                        onClick={() => removeTimeSlot(slot.day, time)}
                        className="ml-1 hover:bg-destructive/10 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
