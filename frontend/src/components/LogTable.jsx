import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Bug
} from 'lucide-react';

// Optional: Replace this with fetched data from backend
const sampleLogs = [
  {
    id: 1,
    timestamp: '2024-07-07T10:30:00Z',
    level: 'ERROR',
    message: 'Database connection failed after 3 retry attempts',
    service: 'auth-service',
    resourceId: 'db-conn-001'
  },
  {
    id: 2,
    timestamp: '2024-07-07T10:25:00Z',
    level: 'WARN',
    message: 'High memory usage detected - 85% of allocated memory in use',
    service: 'payment-api',
    resourceId: 'mem-monitor-002'
  },
  {
    id: 3,
    timestamp: '2024-07-07T10:20:00Z',
    level: 'INFO',
    message: 'User authentication successful',
    service: 'auth-service',
    resourceId: 'user-12345'
  },
  {
    id: 4,
    timestamp: '2024-07-07T10:15:00Z',
    level: 'DEBUG',
    message: 'Processing payment request with validation checks',
    service: 'payment-api',
    resourceId: 'payment-67890'
  },
  {
    id: 5,
    timestamp: '2024-07-07T10:10:00Z',
    level: 'FATAL',
    message: 'Critical system failure - immediate attention required',
    service: 'core-system',
    resourceId: 'sys-critical-001'
  }
];

const levelConfig = {
  FATAL: {
    icon: XCircle,
    badge: 'bg-red-100 text-red-800'
  },
  ERROR: {
    icon: AlertCircle,
    badge: 'bg-red-100 text-red-700'
  },
  WARN: {
    icon: AlertTriangle,
    badge: 'bg-yellow-100 text-yellow-800'
  },
  INFO: {
    icon: Info,
    badge: 'bg-blue-100 text-blue-700'
  },
  DEBUG: {
    icon: Bug,
    badge: 'bg-gray-100 text-gray-700'
  }
};

const LogLevelBadge = ({ level }) => {
  const { icon: Icon, badge } = levelConfig[level] || levelConfig.INFO;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge}`}>
      <Icon className="w-3.5 h-3.5" />
      {level}
    </span>
  );
};

export default function LogTable({ logs = sampleLogs }) {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredLogs = logs
    .filter((log) => {
      const query = searchTerm.toLowerCase();
      return (
        (!levelFilter || log.level === levelFilter) &&
        (log.message.toLowerCase().includes(query) ||
          log.service.toLowerCase().includes(query) ||
          log.resourceId.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'timestamp') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

  const uniqueLevels = [...new Set(logs.map((log) => log.level))];
  const SortIcon = ({ field }) =>
    sortField === field ? (
      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
    ) : null;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">📊 System Logs</h2>
        <p className="text-sm text-gray-500">Monitor and filter log entries efficiently</p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative w-full md:w-1/4">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            {uniqueLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 text-xs font-medium text-gray-600 uppercase border-b border-gray-200">
            <button onClick={() => handleSort('timestamp')} className="col-span-3 flex items-center gap-1 text-left">
              Timestamp <SortIcon field="timestamp" />
            </button>
            <button onClick={() => handleSort('level')} className="col-span-2 flex items-center gap-1 text-left">
              Level <SortIcon field="level" />
            </button>
            <button onClick={() => handleSort('message')} className="col-span-4 flex items-center gap-1 text-left">
              Message <SortIcon field="message" />
            </button>
            <button onClick={() => handleSort('service')} className="col-span-2 flex items-center gap-1 text-left">
              Service <SortIcon field="service" />
            </button>
            <button onClick={() => handleSort('resourceId')} className="col-span-1 flex items-center gap-1 text-left">
              ID <SortIcon field="resourceId" />
            </button>
          </div>

          {/* Table Body */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              No logs found
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="col-span-3 text-sm text-gray-800">
                  <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </div>
                </div>
                <div className="col-span-2">
                  <LogLevelBadge level={log.level} />
                </div>
                <div className="col-span-4 text-sm text-gray-900 truncate" title={log.message}>
                  {log.message}
                </div>
                <div className="col-span-2">
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 text-xs font-mono rounded">
                    {log.service}
                  </span>
                </div>
                <div className="col-span-1 text-xs font-mono text-gray-500 truncate" title={log.resourceId}>
                  {log.resourceId}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
        Showing {filteredLogs.length} of {logs.length} log entries
      </div>
    </div>
  );
}
