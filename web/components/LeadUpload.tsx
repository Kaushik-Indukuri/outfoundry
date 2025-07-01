import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { ParseResult } from "papaparse";
import { Upload } from "lucide-react";

const LEAD_FIELDS = [
  { key: "email", label: "Email", required: true },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "title", label: "Title" },
  { key: "company", label: "Company" },
];

export interface LeadUploadProps {
  onLeadsReady: (leads: any[]) => void;
}

export function LeadUpload({ onLeadsReady }: LeadUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  // mapping: { fieldKey: csvColumn | "" }, enrichedMapping: { csvColumn: true }
  const [mapping, setMapping] = useState<Record<string, string>>(
    () => Object.fromEntries(LEAD_FIELDS.map(f => [f.key, ""]))
  );
  const [enrichedMapping, setEnrichedMapping] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Handle file upload
  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<any>) => {
        if (!results.data || !Array.isArray(results.data) || results.data.length === 0) {
          toast.error("No data found in CSV");
          return;
        }
        setHeaders(Object.keys(results.data[0]));
        setCsvRows(results.data as any[]);
        setStep('map');
      },
      error: () => toast.error("Failed to parse CSV")
    });
  };

  // Handle mapping change for a lead field
  const handleMappingChange = (field: string, value: string) => {
    // Prevent mapping the same column to multiple fields
    setMapping(prev => {
      const updated = { ...prev };
      // Remove this value from any other field
      Object.keys(updated).forEach(k => {
        if (k !== field && updated[k] === value) updated[k] = "";
      });
      updated[field] = value;
      return updated;
    });
  };

  // Handle mapping to enriched data
  const handleEnrichedMappingChange = (csvColumn: string, checked: boolean) => {
    setEnrichedMapping(prev => ({ ...prev, [csvColumn]: checked }));
    // If mapping to enriched, remove from main mapping
    if (checked) {
      setMapping(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(k => {
          if (updated[k] === csvColumn) updated[k] = "";
        });
        return updated;
      });
    }
  };

  // Validate and go to preview
  const handleMapConfirm = () => {
    // Must map required fields
    for (const f of LEAD_FIELDS) {
      if (f.required && !mapping[f.key]) {
        toast.error(`Please map the required field: ${f.label}`);
        return;
      }
    }
    setStep('preview');
    validateRows();
  };

  // Validate rows
  const validateRows = () => {
    const newErrors: Record<number, string[]> = {};
    csvRows.forEach((row, idx) => {
      const rowErrors: string[] = [];
      if (!row[mapping.email] || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row[mapping.email])) {
        rowErrors.push("Invalid email");
      }
      // Add more validation as needed
      if (rowErrors.length) newErrors[idx] = rowErrors;
    });
    setErrors(newErrors);
  };

  // Confirm and send valid leads
  const handleConfirm = () => {
    const validLeads = csvRows.filter((_, idx) => !errors[idx]).map(row => {
      const lead: Record<string, any> = {};
      for (const f of LEAD_FIELDS) {
        if (mapping[f.key]) lead[f.key] = row[mapping[f.key]] || "";
      }
      // Add enriched data
      const enriched: Record<string, any> = {};
      Object.keys(enrichedMapping).forEach(col => {
        if (enrichedMapping[col]) enriched[col] = row[col];
      });
      if (Object.keys(enriched).length > 0) lead.enriched_data = enriched;
      return lead;
    });
    if (validLeads.length === 0) {
      toast.error("No valid leads to import");
      return;
    }
    onLeadsReady(validLeads);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
      setPendingFile(file);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
      setPendingFile(file);
    }
  };

  // Continue from upload step
  const handleUploadContinue = () => {
    if (pendingFile) {
      setSelectedFile(pendingFile);
      handleFile(pendingFile);
    }
  };

  // Back from map step
  const handleMapBack = () => {
    setStep('upload');
    setSelectedFile(null);
    setPendingFile(null);
    setCsvRows([]);
    setHeaders([]);
    setMapping(Object.fromEntries(LEAD_FIELDS.map(f => [f.key, ""])));
    setEnrichedMapping({});
    setErrors({});
  };

  return (
    <div>
      <div>
        {step === 'upload' && (
          <div className="space-y-4">
            <h3 className="font-semibold mb-2">Upload Leads CSV</h3>
            <div
              className="w-full border-2 border-dashed border-muted-foreground rounded-lg p-8 flex flex-col text-center items-center justify-center cursor-pointer hover:border-primary  transition-colors bg-muted/30"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-base font-medium text-muted-foreground mb-1">Drag and drop your CSV file here, or click to browse.</p>
              <p className="text-xs text-muted-foreground">Only one CSV file. Max 8MB.</p>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
            {pendingFile && (
              <div className="text-sm text-muted-foreground">Selected file: <span className="font-medium text-foreground">{pendingFile.name}</span></div>
            )}
            <Button onClick={handleUploadContinue} disabled={!pendingFile}>Continue</Button>
          </div>
        )}
        {step === 'map' && (
          <div className="space-y-4">
            <h3 className="font-semibold mb-2">Map CSV Columns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEAD_FIELDS.map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="font-medium">{f.label}{f.required && <span className="text-destructive">*</span>}</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={mapping[f.key]}
                    onChange={e => handleMappingChange(f.key, e.target.value)}
                  >
                    <option value="">Select column</option>
                    {headers.filter(h => !Object.values(mapping).includes(h) || mapping[f.key] === h).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Map to Enriched Data</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {headers.map(h => (
                  <label key={h} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!enrichedMapping[h]}
                      onChange={e => handleEnrichedMappingChange(h, e.target.checked)}
                      disabled={Object.values(mapping).includes(h)}
                    />
                    <span className="text-sm">{h}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Any column mapped here will be added to the enriched_data JSON for each lead.</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleMapBack}>Back</Button>
              <Button onClick={handleMapConfirm}>Continue</Button>
            </div>
          </div>
        )}
        {step === 'preview' && (
          <div className="space-y-4">
            <h4 className="font-semibold mb-2">Preview</h4>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    {LEAD_FIELDS.map(f => (
                      <th key={f.key} className="px-2 py-1 text-left font-semibold uppercase">{f.label}</th>
                    ))}
                    <th className="px-2 py-1 text-left font-semibold uppercase">Enriched Data</th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(0, 10).map((row, idx) => {
                    const enriched: Record<string, any> = {};
                    Object.keys(enrichedMapping).forEach(col => {
                      if (enrichedMapping[col]) enriched[col] = row[col];
                    });
                    return (
                      <tr key={idx} className={errors[idx] ? "bg-destructive/10" : ""}>
                        {LEAD_FIELDS.map(f => (
                          <td key={f.key} className="px-2 py-1">
                            {row[mapping[f.key]] || ""}
                          </td>
                        ))}
                        <td className="px-2 py-1 font-mono text-xs text-muted-foreground">
                          {Object.keys(enriched).length > 0 ? JSON.stringify(enriched) : ""}
                        </td>
                        <td className="px-2 py-1 text-destructive text-xs">
                          {errors[idx]?.join(", ")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-2">Showing first 10 rows</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('map')}>Back</Button>
              <Button onClick={handleConfirm} disabled={Object.keys(errors).length > 0}>Import Leads</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 