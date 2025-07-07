import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const createLog = async (logData) => {
  const response = await fetch('http://localhost:5000/api/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(logData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create log entry');
  }

  const result = await response.json();
  return result;
};


export default function LogForm() {
  const [form, setForm] = useState({
    level: '',
    message: '',
    timestamp: '',
    service: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(null);

  const isFormValid = form.level && form.message && form.timestamp && form.service;

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (response) setResponse(null);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setResponse(null);

    try {
      const result = await createLog(form);
      setResponse({
        type: 'success',
        message: 'Log entry created successfully!',
        data: result
      });
      setForm({ level: '', message: '', timestamp: '', service: '' });
    } catch (error) {
      setResponse({
        type: 'error',
        message: error.message || 'Something went wrong.',
        data: null
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-1">📄 Create Log Entry</h2>
        <p className="text-gray-500">Add a new log record to the system for monitoring.</p>
      </div>

      {response && (
        <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${response.type === 'success'
          ? 'bg-emerald-50 border border-emerald-200'
          : 'bg-rose-50 border border-rose-200'
          }`}>
          {response.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-rose-600 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${response.type === 'success' ? 'text-emerald-800' : 'text-rose-800'}`}>
              {response.message}
            </p>
            {response.data && (
              <p className="text-sm text-gray-500 mt-1">
                Log ID: {response.data.id}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Level */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
            Log Level *
          </label>
          <select
            id="level"
            value={form.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="">Select log level</option>
            <option value="DEBUG">DEBUG</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="FATAL">FATAL</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Enter a detailed log message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-vertical"
          />
        </div>

        {/* Timestamp */}
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
            Timestamp *
          </label>

          <DatePicker
            selected={form.timestamp ? new Date(form.timestamp) : null}
            onChange={(date) =>
              handleInputChange('timestamp', date ? date.toISOString().slice(0, 16) : '')
            }
            showTimeSelect
            timeIntervals={1}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select date and time"
            customInput={
              <button
                type="button"
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
                {form.timestamp
                  ? new Date(form.timestamp).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  : 'Select date & time'}
              </button>
            }
            popperClassName="!z-50"
          />
        </div>

        {/* Service */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            Service *
          </label>
          <input
            id="service"
            type="text"
            placeholder="e.g., auth-service"
            value={form.service}
            onChange={(e) => handleInputChange('service', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${isFormValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Log Entry...</span>
              </>
            ) : (
              <span>Create Log Entry</span>
            )}
          </button>
        </div>
      </div>

      {!isFormValid && (
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Please fill in all required fields before submitting.
          </p>
        </div>
      )}
    </div>
  );
}
