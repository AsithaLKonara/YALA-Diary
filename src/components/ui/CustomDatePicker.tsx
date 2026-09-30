import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek, isBefore, startOfDay, parseISO } from 'date-fns';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string;
  placeholder?: string;
}

export default function CustomDatePicker({ value, onChange, minDate, placeholder = "Select date" }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    return value ? parseISO(value) : new Date();
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    if (minDate && isBefore(startOfDay(date), startOfDay(parseISO(minDate)))) {
      return; // disabled
    }
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="custom-datepicker" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="input-with-icon" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <CalendarIcon size={18} className="input-icon" />
        <div 
          className="form-input" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: value ? '#fff' : 'rgba(255,255,255,0.4)',
            userSelect: 'none'
          }}
        >
          {value ? format(parseISO(value), 'MMM dd, yyyy') : placeholder}
        </div>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '8px',
          background: 'var(--dash-surface)',
          border: '1px solid var(--dash-border)',
          borderRadius: '12px',
          padding: '16px',
          zIndex: 1000,
          width: '320px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button 
              onClick={handlePrevMonth}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <button 
              onClick={handleNextMonth}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekdays */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {weekDays.map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', padding: '4px 0' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {days.map((day, idx) => {
              const isSelected = value && isSameDay(day, parseISO(value));
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isPastDate = minDate ? isBefore(startOfDay(day), startOfDay(parseISO(minDate))) : false;
              
              let bgColor = 'transparent';
              let color = '#fff';
              let cursor = 'pointer';

              if (!isCurrentMonth) {
                color = 'rgba(255,255,255,0.2)';
              }
              if (isPastDate) {
                color = 'rgba(255,255,255,0.1)';
                cursor = 'not-allowed';
              }
              if (isSelected) {
                bgColor = 'var(--primary)';
                color = '#000';
              } else if (isToday(day) && !isSelected) {
                color = 'var(--primary)';
              }

              return (
                <div 
                  key={idx} 
                  onClick={() => handleDateClick(day)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '36px',
                    borderRadius: '50%',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    color,
                    background: bgColor,
                    cursor,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !isPastDate) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isPastDate) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
