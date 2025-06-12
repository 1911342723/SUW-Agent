"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/ui/file-upload';

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/knowledge/search?query=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>

      <div className="mb-6">
        <FileUpload
          onFileSelected={handleFileUpload}
          accept=".txt,.pdf,.docx,.md"
          label="Upload Document"
        />
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
              <div className="mt-2 text-xs text-gray-500">
                <span>Relevance score: {index + 1}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {isLoading ? 'Searching...' : 'No results found. Try a different query.'}
          </div>
        )}
      </div>
    </div>
  );
}