import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
  isLoading?: boolean;
  analysisResult?: unknown | null;
  onAnalyze?: () => void;
}

export default function FileUpload({
  onFileSelect,
  isLoading = false,
  analysisResult = null,
  onAnalyze,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Please upload a valid PDF or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Max size limit is 5MB.');
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);

    if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Box */}
      {!selectedFile && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${dragActive
              ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
              : 'border-slate-700 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Drag & drop your resume or <span className="text-emerald-400 underline decoration-emerald-500/40">browse files</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX formats (Max size: 5MB)</p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium animate-shake">
          {errorMsg}
        </div>
      )}

      {/* Selected File Box & Preview */}
      {selectedFile && (
        <div className="space-y-3">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-mono text-xs uppercase shrink-0 font-black shadow-sm">
                {selectedFile.name.split('.').pop()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-slate-400 hover:text-rose-400 p-2 text-xs transition-colors bg-slate-900 rounded-xl border border-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Document Preview Embed */}
          {previewUrl && (
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80 p-2 shadow-inner">
              <iframe src={previewUrl} className="w-full h-56 rounded-xl bg-slate-900 border border-slate-800" title="Resume Preview" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}