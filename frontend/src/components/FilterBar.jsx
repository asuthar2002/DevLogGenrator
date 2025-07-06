import { useState, useEffect } from 'react';

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <input placeholder="Search message..." name="message" onChange={handleChange} />
      <select name="level" onChange={handleChange}>
        <option value="">All Levels</option>
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
      </select>
      <input placeholder="Resource ID" name="resourceId" onChange={handleChange} />
      <input type="datetime-local" name="start" onChange={handleChange} />
      <input type="datetime-local" name="end" onChange={handleChange} />
    </div>
  );
}
