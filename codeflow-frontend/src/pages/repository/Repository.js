import React, { useState, useEffect } from 'react';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './Editor/CodeEditor';
import { CommitDialog } from './CommitDialog';

import { Layout } from '../../components/layouts/ProjectLayout';
import { useParams } from 'react-router-dom';
import api from '../../services/api';



function Repository() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const { projectid, repoid } = useParams(); // Get the project ID and board ID from the URL
  const [data, setData] = useState({
    project: null,
    board: null,
    repository: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r1 = await api.get(`/projects/${projectid}`);
        const r2 = await api.get(`/boards/${projectid}`);
        const r3 = await api.get(`/repositories/${projectid}`);
        setData({
          project: r1.data.project,
          board: r2.data.kanban,
          repository: r3.data.repository,
        })
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await api.get(`/repositories/files/${repoid}`);
        setFiles(response.data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    }

    getFiles();
  }, [])



  const handleFileSelect = (file) => {

    setSelectedFile(file);

  };



  const handleCommit = async (file, message) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', message);

      const response = await api.post(
        `/repositories/files/${repoid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFiles(response.data.files);
    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to commit file');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    </div>
  );

  return (
    <Layout project={data.project} board={data.board} repository={data.repository}>
      <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
        <div className="flex-1 flex">
          <div className="w-[400px] border-r border-[#3E3E42]">
            <FileExplorer
              initialFiles={files}
              onFileSelect={handleFileSelect}
              className="h-full rounded-none border-0"
              setIsCommitDialogOpen={setIsCommitDialogOpen}
            />
          </div>
          <div className="flex-1 flex flex-col">
            {selectedFile ? (
              <>
                <div className="flex items-center justify-between px-6 py-3 border-b border-[#3E3E42]">
                  <span className="text-[#CCCCCC]">{selectedFile.name} -- <span className="truncate text-[#BBBBBB]">{selectedFile.message}</span></span>
                  <span className="text-[#CCCCCC]">Committed By: {selectedFile.userId.username}</span>
                </div>
                <div className="flex-1">
                  <CodeEditor
                    key={selectedFile.name}
                    content={selectedFile.content || ''}
                    language={selectedFile.name.split('.').pop()}
                  />
                </div>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[#6B6B6B]">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
        <CommitDialog
          isOpen={isCommitDialogOpen}
          onClose={() => setIsCommitDialogOpen(false)}
          onCommit={handleCommit}
        />
      </div>
    </Layout>
  );
}

export default Repository;