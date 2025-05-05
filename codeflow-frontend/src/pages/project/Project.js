import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layouts/ProjectLayout';
import { Star, Users, X, Search, GitCommit, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Avatar } from '../../components/Avatar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function Project() {
  const { projectid } = useParams(); // Get the project ID from the URL

  const [data, setData] = useState({
    project: null,
    board: null,
    repository: null,
  });

  const [stats, setStats] = useState({
    commits: 0,
    files: 0,
    collaborators: 0,
    totalTasks: 0,
    doneTasks: 0,
    todoTasks: 0,
    doingTasks: 0
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState('7days');

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
        });
        
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectid]);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        // Fetch all stats in parallel
        const [
          commitsRes,
          filesRes,
          collaboratorsRes,
          tasksRes,
          doneTasksRes,
          todoTasksRes,
          doingTasksRes
        ] = await Promise.all([
          api.get(`/projects/stats/commits/${projectid}`),
          api.get(`/projects/stats/files/${projectid}`),
          api.get(`/projects/stats/collaborators/${projectid}`),
          api.get(`/projects/stats/tasks/${projectid}`),
          api.get(`/projects/stats/done/${projectid}`),
          api.get(`/projects/stats/todo/${projectid}`),
          api.get(`/projects/stats/doing/${projectid}`)
        ]);

        
        setStats({
          commits: commitsRes.data.total,
          files: filesRes.data.total,
          collaborators: collaboratorsRes.data.total,
          totalTasks: tasksRes.data.total,
          doneTasks: doneTasksRes.data.total,
          todoTasks: todoTasksRes.data.total,
          doingTasks: doingTasksRes.data.total
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (projectid) {
      fetchStats();
    }
  }, [projectid, timeFrame]);

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setInviteLoading(true);
    setError('');

    try {
      // This is a placeholder for the actual API call
      // Replace with your actual API call to invite users
      const response = await api.post(`/projects/collaborator/${projectid}`, { username });
      
      // If successful:
      setShowInviteModal(false);
      setUsername('');
      // Maybe add a success toast notification here
    } catch (error) {
      // Handle different error types
      if (error.response && error.response.status === 404) {
        setError('User not found. Please check the username and try again.');
      } else {
        setError(error.response.data.error || 'An error occurred while inviting the user.');
      }
      console.error('Error inviting user:', error);
    } finally {
      setInviteLoading(false);
    }
  };

  
  if (loading) return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    </div>
  );

  // Prepare data for the pie chart
  const taskStatusData = [
    { name: 'To Do', value: stats.todoTasks, color: '#F59E0B' },
    { name: 'In Progress', value: stats.doingTasks, color: '#3B82F6' },
    { name: 'Done', value: stats.doneTasks, color: '#10B981' }
  ].filter(item => item.value > 0);

  return (
    <Layout project={data.project} board={data.board} repository={data.repository}>
      {/* Project Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={data.project.name} size={12} />
          <div>
            <h1 className="text-2xl font-semibold">{data.project.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#2D2D2D] hover:bg-[#3D3D3D] px-3 py-1.5 rounded flex items-center gap-2">
            <Star size={16} />
          </button>
          <button 
            className="bg-[#0078D4] hover:bg-[#106EBE] px-4 py-1.5 rounded"
            onClick={() => setShowInviteModal(true)}
          >
            Invite
          </button>
        </div>
      </div>

      {/* Top Row: Project Description and Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Project Description */}
        <div className="col-span-2 bg-[#2D2D2D] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About this project</h2>
          <p className="text-gray-400">{data.project.description ? data.project.description : "Describe your project and make it easier for other people to understand it."}</p>
        </div>

        {/* Project Stats */}
        <div className="bg-[#2D2D2D] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Project stats</h2>
            <select 
              className="bg-[#3C3C3C] border border-[#444] rounded px-2 py-1 text-sm"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>

          {statsLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Repository</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <GitCommit size={16} className="text-gray-400" />
                      <span>Total commits</span>
                    </div>
                    <span>{stats.commits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span>Total files</span>
                    </div>
                    <span>{stats.files}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-2">Team</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>Collaborators</span>
                  </div>
                  <span>{stats.collaborators}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-2">Tasks</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-[#F59E0B]" />
                      <span>To Do</span>
                    </div>
                    <span>{stats.todoTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#3B82F6]" />
                      <span>In Progress</span>
                    </div>
                    <span>{stats.doingTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#10B981]" />
                      <span>Done</span>
                    </div>
                    <span>{stats.doneTasks}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Task Distribution Chart */}
      {stats.totalTasks > 0 && (
        <div className="bg-[#2D2D2D] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Task Distribution</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} tasks`, 'Count']}
                      contentStyle={{ backgroundColor: '#3C3C3C', borderColor: '#444', borderRadius: '4px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-medium mb-4">Task Status Overview</h3>
              <div className="space-y-4">
                {taskStatusData.map((entry, index) => (
                  <div key={`stat-${index}`} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-sm text-gray-300">{entry.value} tasks</span>
                      </div>
                      <div className="w-full bg-[#3C3C3C] h-2 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${Math.round((entry.value / stats.totalTasks) * 100)}%`,
                            backgroundColor: entry.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-[#444]">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Tasks</span>
                    <span className="text-sm text-gray-300">{stats.totalTasks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2D2D2D] rounded-lg w-full max-w-md p-6 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => {
                setShowInviteModal(false);
                setUsername('');
                setError('');
              }}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold mb-6">Invite to project</h2>
            
            <form onSubmit={handleInviteUser}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    className="bg-[#1E1E1E] border border-[#444] text-white rounded-md block w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0078D4] focus:border-transparent"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-red-400 text-sm">{error}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="bg-[#3C3C3C] hover:bg-[#4C4C4C] px-4 py-2 rounded"
                  onClick={() => {
                    setShowInviteModal(false);
                    setUsername('');
                    setError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0078D4] hover:bg-[#106EBE] px-4 py-2 rounded flex items-center justify-center min-w-[80px]"
                  disabled={inviteLoading}
                >
                  {inviteLoading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    'Invite'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}