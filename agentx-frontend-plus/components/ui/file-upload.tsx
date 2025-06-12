import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ onFileSelected, accept, label }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? {
      [accept]: accept.split(',').map(ext => ext.trim())
    } : undefined,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the file here...</p>
      ) : (
        <div>
          <p className="text-gray-600">{label || 'Drag & drop a file here, or click to select'}</p>
          <p className="text-sm text-gray-500 mt-2">
            {accept ? `Supported formats: ${accept}` : 'Any file type'}
          </p>
        </div>
      )}
    </div>
  );
}