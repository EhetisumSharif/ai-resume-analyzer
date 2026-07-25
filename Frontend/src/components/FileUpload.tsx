import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    // Validation: PDF or DOCX only, max size 5MB
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid format. Please upload PDF or DOCX files.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB threshold.');
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
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Drag & Drop Box */}
      {!selectedFile && (
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-slate-800 hover:border-slate-700 bg-[#0b0f19]'
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
            <div className="h-12 w-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag & drop your resume or <span className="text-indigo-400">browse</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Supports PDF, DOCX (Max 5MB)</p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Selected File Box & Preview */}
      {selectedFile && (
        <div className="space-y-3">
          <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-9 w-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-indigo-400 font-mono text-xs uppercase shrink-0">
                {selectedFile.name.split('.').pop()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={removeFile}
              className="text-slate-500 hover:text-rose-400 p-1 text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Document Preview Embed */}
          {previewUrl && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f19] p-2">
              <iframe src={previewUrl} className="w-full h-64 rounded-lg bg-white" title="Resume Preview" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}