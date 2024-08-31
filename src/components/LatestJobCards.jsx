import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="relative flex flex-col justify-between p-5 rounded-xl shadow-lg bg-white border border-gray-200 cursor-pointer transition-all transform hover:scale-[1.03] hover:shadow-xl max-w-full md:max-w-sm lg:max-w-md mx-auto"
    >
      {/* Header: Company and Location */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-lg text-gray-800">{job?.company?.name}</h1>
        <span className="text-sm text-gray-500">{job?.location || 'India'}</span>
      </div>

      {/* Main Content: Job Title and Description */}
      <div className="mb-4">
        <h2 className="font-bold text-xl text-gray-900 mb-2">{job?.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Footer: Job Details Badges */}
      <div className="flex flex-wrap items-center gap-3 mt-auto">
        <Badge className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-semibold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="bg-red-50 text-red-700 px-2 py-1 rounded-md font-semibold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-semibold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
