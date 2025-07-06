import { useEffect, useState } from 'react';
import { getLogs } from './services/api';
import LogForm from './components/LogForm';
import LogTable from './components/LogTable';
import FilterBar from './components/FilterBar';

function App() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    message: '',
    level: '',
    start: '',
    end: '',
    resourceId: ''
  });

  const fetchLogs = async () => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    const res = await getLogs(params);
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  return (
    <div>
      <h1>Log Query System</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <LogForm />
      <LogTable logs={logs} />
    </div>
  );
}

export default App;