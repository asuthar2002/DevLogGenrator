const getColor = (level) => {
  switch (level) {
    case 'error': return '#ffe5e5';
    case 'warning': return '#fff8dc';
    case 'info': return '#f0f8ff';
    default: return '#ffffff';
  }
};

export default function LogTable({ logs }) {
  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Level</th>
          <th>Message</th>
          <th>Service</th>
          <th>Resource ID</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index} style={{ backgroundColor: getColor(log.level) }}>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.level}</td>
            <td>{log.message}</td>
            <td>{log.service}</td>
            <td>{log.resourceId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
