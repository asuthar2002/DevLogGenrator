import { useState } from 'react';
import { createLog } from '../services/api';

export default function LogForm() {
  const [form, setForm] = useState({ level: '', message: '', timestamp: '', service: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createLog(form);
    setForm({ level: '', message: '', timestamp: '', service: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Level" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} />
      <input placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      <input type="datetime-local" value={form.timestamp} onChange={e => setForm({ ...form, timestamp: e.target.value })} />
      <input placeholder="Service" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
      <button type="submit">Add Log</button>
    </form>
  );
}
