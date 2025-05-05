import React from 'react';
import { Grid2X2 } from 'lucide-react';
import { getAvatar } from '../utils/utitlity';
import { useAuth } from '../context/AuthContext';


export function Sidebar() {
	const { currentUser } = useAuth();
	if (!currentUser) return null;
	

	return (
		<div className="w-64 bg-[#252526] border-r border-[#333]">
			<div className="p-3 bg-[#2D2D2D] border-b border-[#333] flex items-center gap-2">
				<div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
					{getAvatar(currentUser.name)}
				</div>
				<span className="text-sm">{currentUser.username}</span>
			</div>

			<nav className="flex-1 p-2">
				<ul className="space-y-1">

					<li>
						<button className="w-full text-left px-3 py-2 text-sm text-white bg-[#37373D] rounded flex items-center gap-2">
							<Grid2X2 size={16} />
							Dashboard
						</button>
					</li>

				</ul>
			</nav>

		</div>
	);
}