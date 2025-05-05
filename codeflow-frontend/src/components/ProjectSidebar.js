import React from 'react';
import { Home, LayoutDashboard, GitBranch, Grid2X2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from './Avatar';

export function Sidebar({ path, project, board, repository }) {


    const normalStyle = "w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white rounded flex items-center gap-2";
    const activeStyle = "w-full text-left px-3 py-2 text-sm text-white bg-[#37373D] rounded flex items-center gap-2";

    return (
        <div className="w-64 bg-[#252526] border-r border-[#333]">
            <div className="p-3 bg-[#2D2D2D] border-b border-[#333] flex items-center gap-2">
                <Avatar name={project.name} size={8} />
                <span className="text-sm">{project.name}</span>
            </div>

            <nav className="flex-1 p-2">
                <ul className="space-y-1">
                    <li>
                        <Link to="/">
                            <button className={path === 'dashboard' ? activeStyle : normalStyle} >
                                <Grid2X2 size={16} />
                                Dashboard
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/project/${project._id}`}>
                            <button className={path === `/project/${project._id}` ? activeStyle : normalStyle} >
                                <Home size={16} />
                                Overview
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/project/${project._id}/board/${board._id}`}>
                            <button className={path === `/project/${project._id}/board/${board._id}` ? activeStyle : normalStyle} >
                                <LayoutDashboard size={16} />
                                Boards
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/project/${project._id}/repository/${repository._id}`}>

                            <button className={path === `/project/${project._id}/repository/${repository._id}` ? activeStyle : normalStyle} >
                                <GitBranch size={16} />
                                Repos
                            </button>
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
}