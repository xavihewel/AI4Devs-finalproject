import React from 'react';

interface DirectionFilterProps {
  label: string;
  value: 'TO_SEDE' | 'FROM_SEDE';
  onChange: (value: 'TO_SEDE' | 'FROM_SEDE') => void;
}

export default function DirectionFilter({ label, value, onChange }: DirectionFilterProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm text-gray-700">{label}</label>
      <select
        className="border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value as 'TO_SEDE' | 'FROM_SEDE')}
      >
        <option value="TO_SEDE">To sede</option>
        <option value="FROM_SEDE">From sede</option>
      </select>
    </div>
  );
}


