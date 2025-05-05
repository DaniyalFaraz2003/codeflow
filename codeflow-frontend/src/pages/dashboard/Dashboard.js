import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Layout } from '../../components/layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import Project from './Project';
import api from '../../services/api';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    const { currentUser, logout } = useAuth();

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await api.get('/projects');
                setProjects(response.data.projects);
                console.log('Projects:', response.data.projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    

    // Function to handle project deletion
    const handleDeleteProject = async (projectId) => {
        try {
            await api.delete(`/projects/${projectId}`);
            
            // Update the projects state by filtering out the deleted project
            setProjects(projects.filter(project => project._id !== projectId));
            
            // Optional: Show success notification
            console.log('Project deleted successfully');
        } catch (error) {
            console.error('Error deleting project:', error);
            // Optional: Show error notification
        }
    };

    // Function to handle project update
    const handleUpdateProject = async (projectId, updatedData) => {
        try {
            const response = await api.put(`/projects/${projectId}`, updatedData);
            
            // Update the projects state with the updated project
            setProjects(projects.map(project => 
                project._id === projectId ? response.data.data : project
            ));
            
            // Optional: Show success notification
            console.log('Project updated successfully');
        } catch (error) {
            console.error('Error updating project:', error);
            // Optional: Show error notification
            throw error; // Re-throw the error so the Project component can handle it
        }
    };

    // Function to handle new project form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to handle the creation of a new project
    const handleCreateProject = async () => {
        // Basic validation
        if (!newProject.name.trim()) {
            setError('Project name is required');
            return;
        }

        setIsCreating(true);
        setError('');

        try {
            const response = await api.post('/projects', newProject);
            
            // Add the new project to the projects state
            setProjects(prev => [...prev, response.data.project]);
            
            // Close the modal and reset the form
            setShowNewProjectModal(false);
            setNewProject({ name: '', description: '' });
            
            console.log('Project created successfully');
        } catch (error) {
            console.error('Error creating project:', error);
            setError(error.response?.data?.message || 'Failed to create project');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl">Welcome Back <span className='font-bold'>{currentUser?.name || 'User'}!</span></h1>
                <button 
                    className="bg-[#0078D4] hover:bg-[#106EBE] px-4 py-2 rounded flex items-center gap-2"
                    onClick={() => setShowNewProjectModal(true)}
                >
                    <Plus size={16} />
                    New project
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#333] mb-6">
                <div className="flex gap-6">
                    <button
                        className={`pb-2 px-1 text-sm ${activeTab === 'projects'
                            ? 'text-white border-b-2 border-[#0078D4]'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
                    </button>

                </div>
            </div>

            {/* Project Cards */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Filter projects"
                        className="bg-[#3C3C3C] border border-[#444] rounded px-9 py-1 text-sm focus:outline-none focus:border-[#0078D4] w-64"
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {loading ? (
                    <div className="flex mt-5 h-32 w-full text-gray-400 text-xl">
                        Loading...
                    </div>
                ) : projects.length > 0 ? (
                    projects.map((project) => (
                        <Project 
                            key={project._id} 
                            id={project._id} 
                            name={project.name} 
                            description={project.description}
                            onDelete={handleDeleteProject}
                            onUpdate={handleUpdateProject}
                            role={project.role}
                        />
                    ))
                ) : (
                    <div className="flex mt-5 h-32 w-full text-gray-400 text-xl">
                        Get Started By Creating a New Project!
                    </div>
                )}
            </div>

            {/* New Project Modal */}
            {showNewProjectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#2D2D2D] rounded-md p-6 w-96 shadow-lg">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Create New Project</h3>
                        </div>
                        
                        {error && (
                            <div className="mb-4 p-2 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-300 text-sm">
                                {error}
                            </div>
                        )}
                        
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Project Name*
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newProject.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#3C3C3C] border border-[#444] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0078D4]"
                                    placeholder="Enter project name"
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newProject.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full bg-[#3C3C3C] border border-[#444] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0078D4]"
                                    placeholder="Enter project description"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button"
                                    className="px-4 py-2 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-gray-300"
                                    onClick={() => setShowNewProjectModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    className="px-4 py-2 rounded bg-[#0078D4] hover:bg-[#106EBE] text-white"
                                    onClick={handleCreateProject}
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Dashboard;