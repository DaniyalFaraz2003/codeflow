import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layouts/ProjectLayout';
import { Star, Users, Settings, ChevronDown, Maximize2, Filter } from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';
import { useParams } from 'react-router-dom';
import api from '../../services/api';


export function Board() {
  const { projectid, boardid } = useParams(); // Get the project ID and board ID from the URL
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


  if (loading) return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    </div>
  );

  return (
    <Layout project={data.project} board={data.board} repository={data.repository}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">{data.project.name} Team</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-blue-400 hover:underline">View as backlog</button>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-[#3D3D3D] rounded">
              <Filter size={16} className="text-gray-400" />
            </button>
            <button className="p-1.5 hover:bg-[#3D3D3D] rounded">
              <Settings size={16} className="text-gray-400" />
            </button>
            <button className="p-1.5 hover:bg-[#3D3D3D] rounded">
              <Maximize2 size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button className="px-3 py-1 text-sm border-b-2 border-blue-500 text-blue-400">Board</button>
      </div>

      <KanbanBoard />
    </Layout>
  );
}