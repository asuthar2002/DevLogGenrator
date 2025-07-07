import { useEffect, useState } from 'react';
import { getLogs } from './services/api';
import LogForm from './components/LogForm';
import LogTable from './components/LogTable';
import FilterBar from './components/FilterBar';
import './Style.css'; // Ensure Tailwind is included here

export default function App() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    message: '',
    level: '',
    start: '',
    end: '',
    resourceId: ''
  });

  const fetchLogs = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, val]) => val)
      );
      const res = await getLogs(params);
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">📘 Log Query System</h1>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <LogForm onSuccess={fetchLogs} />
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <FilterBar filters={filters} setFilters={setFilters} />
        </section>

        <section>
          <LogTable logs={logs} />
        </section>
      </div>
    </main>
  );
}
