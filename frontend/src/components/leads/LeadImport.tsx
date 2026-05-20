import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Lead, ImportResult } from '../../types';

type InputMode = 'csv' | 'json';

interface LeadImportProps {
  onImport: (leads: Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>>) => Promise<void>;
  onClose: () => void;
  isImporting?: boolean;
  importResult?: ImportResult | null;
}

function parseCsv(text: string): Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>> {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const nameIdx = headers.indexOf('name');
  const emailIdx = headers.indexOf('email');
  const statusIdx = headers.indexOf('status');
  const sourceIdx = headers.indexOf('source');

  if (nameIdx === -1 || emailIdx === -1) return [];

  const leads: Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const name = values[nameIdx]?.trim();
    const email = values[emailIdx]?.trim();
    if (!name || !email) continue;

    leads.push({
      name,
      email,
      status: (values[statusIdx]?.trim() as Lead['status']) || 'New',
      source: (values[sourceIdx]?.trim() as Lead['source']) || 'Website',
    });
  }

  return leads;
}

function parseJson(text: string): Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>> {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item: unknown) =>
        item && typeof item === 'object' && 'name' in (item as Record<string, unknown>) && 'email' in (item as Record<string, unknown>)
    ) as Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>>;
  } catch {
    return [];
  }
}

const sampleCsv = `name,email,status,source
John Doe,john@example.com,New,Website`;

const sampleJson = JSON.stringify(
  [
    { name: 'John Doe', email: 'john@example.com', status: 'New', source: 'Website' },
  ],
  null,
  2
);

export function LeadImport({ onImport, onClose, isImporting, importResult }: LeadImportProps) {
  const [mode, setMode] = useState<InputMode>('csv');
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [parsedLeads, setParsedLeads] = useState<Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>>>([]);
  const [parseError, setParseError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCsvChange = (text: string) => {
    setCsvText(text);
    setParseError('');
    try {
      const leads = parseCsv(text);
      if (leads.length === 0 && text.trim()) {
        setParseError('No valid leads found. Ensure CSV has name and email columns.');
        setParsedLeads([]);
        return;
      }
      setParsedLeads(leads);
    } catch {
      setParseError('Failed to parse CSV');
      setParsedLeads([]);
    }
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    setParseError('');
    if (!text.trim()) {
      setParsedLeads([]);
      return;
    }
    try {
      const leads = parseJson(text);
      if (leads.length === 0) {
        setParseError('No valid leads found. JSON must be an array of objects with name and email.');
        setParsedLeads([]);
        return;
      }
      setParsedLeads(leads);
    } catch {
      setParseError('Invalid JSON format');
      setParsedLeads([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      handleCsvChange(text);
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (parsedLeads.length === 0) return;
    onImport(parsedLeads);
  };

  const handleUseSample = () => {
    if (mode === 'csv') {
      setCsvText(sampleCsv);
      handleCsvChange(sampleCsv);
    } else {
      setJsonText(sampleJson);
      handleJsonChange(sampleJson);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setMode('csv'); setParsedLeads([]); setParseError(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'csv'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Upload className="h-4 w-4" />
          CSV
        </button>
        <button
          type="button"
          onClick={() => { setMode('json'); setParsedLeads([]); setParseError(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'json'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          JSON
        </button>
      </div>

      {mode === 'csv' ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CSV file
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or paste CSV</span>
            </div>
          </div>
          <textarea
            value={csvText}
            onChange={(e) => handleCsvChange(e.target.value)}
            placeholder="name,email,status,source&#10;John Doe,john@example.com,New,Website"
            rows={6}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder='[{&#10;  "name": "John Doe",&#10;  "email": "john@example.com",&#10;  "status": "New",&#10;  "source": "Website"&#10;}]'
            rows={8}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          />
        </div>
      )}

      {parseError && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {parsedLeads.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {parsedLeads.length} lead{parsedLeads.length !== 1 ? 's' : ''} parsed
          </p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {parsedLeads.slice(0, 10).map((lead, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-xs text-gray-600 bg-white rounded px-2 py-1"
              >
                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                <span className="font-medium truncate">{lead.name}</span>
                <span className="truncate">{lead.email}</span>
                <span className="text-gray-400 shrink-0">{lead.status}</span>
              </div>
            ))}
            {parsedLeads.length > 10 && (
              <p className="text-xs text-gray-400 text-center pt-1">
                ...and {parsedLeads.length - 10} more
              </p>
            )}
          </div>
        </div>
      )}

      {importResult && (
        <div
          className={`rounded-lg p-3 text-sm ${
            importResult.errors.length > 0
              ? 'bg-yellow-50 text-yellow-800'
              : 'bg-green-50 text-green-800'
          }`}
        >
          <p className="font-medium">
            {importResult.imported} lead{importResult.imported !== 1 ? 's' : ''} imported
          </p>
          {importResult.errors.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {importResult.errors.map((err, i) => (
                <li key={i} className="text-xs">
                  Row {err.row}: {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!parsedLeads.length && !csvText && !jsonText && (
        <button
          type="button"
          onClick={handleUseSample}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Use sample data
        </button>
      )}

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={parsedLeads.length === 0}
          isLoading={isImporting}
        >
          Import {parsedLeads.length > 0 ? `${parsedLeads.length} lead${parsedLeads.length !== 1 ? 's' : ''}` : ''}
        </Button>
      </div>
    </div>
  );
}
