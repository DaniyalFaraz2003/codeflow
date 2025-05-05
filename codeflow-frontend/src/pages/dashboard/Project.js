import React, { useState } from "react";
import { Trash2, SquareArrowUp, AlertCircle } from "lucide-react";
import { Avatar } from "../../components/Avatar";
import { Link } from "react-router-dom";

const Project = ({ id, name, description, onDelete, onUpdate, role }) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedProject, setUpdatedProject] = useState({
        name: name,
        description: description
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    // Delete handlers
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
        try {
            if (onDelete) {
                await onDelete(id);
            }
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    // Update handlers
    const handleUpdateClick = () => {
        // Reset form values to current project values
        setUpdatedProject({
            name: name,
            description: description
        });
        setError('');
        setShowUpdateModal(true);
    };

    const handleCancelUpdate = () => {
        setShowUpdateModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleConfirmUpdate = async () => {
        // Basic validation
        if (!updatedProject.name.trim()) {
            setError('Project name is required');
            return;
        }

        setIsUpdating(true);
        setError('');

        try {
            if (onUpdate) {
                await onUpdate(id, updatedProject);
            }
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error updating project:", error);
            setError(error.response?.data?.message || 'Failed to update project');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-[#2D2D2D] rounded-sm p-6 w-full shadow-md hover:shadow-lg transition-shadow duration-300 relative">
            <div className="flex items-center gap-4 mb-4">
                <Avatar name={name} size={12} />
                <div>
                    <Link to={`/project/${id}`} >
                        <h3 className="text-lg font-semibold hover:cursor-pointer hover:underline">{name}</h3>
                    </Link>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
            </div>

            {role === "owner" && (
                <div className="flex justify-end gap-2">
                    <button
                        className="p-1 hover:bg-[#3D3D3D] rounded transition-all"
                        onClick={handleDeleteClick}
                    >
                        <Trash2 size={18} className="text-gray-400 hover:text-red-500" />
                    </button>
                    <button
                        className="p-1 hover:bg-[#3D3D3D] rounded transition-all"
                        onClick={handleUpdateClick}
                    >
                        <SquareArrowUp size={18} className="text-gray-400 hover:text-green-500" />
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#2D2D2D] rounded-md p-6 w-96 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle size={24} className="text-red-500" />
                            <h3 className="text-lg font-semibold">Delete Project</h3>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete "{name}"? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded bg-[#3D3D3D] hover:bg-[#4D4D4D] text-gray-300"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Project Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#2D2D2D] rounded-md p-6 w-96 shadow-lg">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Update Project</h3>
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
                                    value={updatedProject.name}
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
                                    value={updatedProject.description}
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
                                    onClick={handleCancelUpdate}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-[#0078D4] hover:bg-[#106EBE] text-white"
                                    onClick={handleConfirmUpdate}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Updating...' : 'Update Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Project;