import React from 'react';
import Job from './Job';

const SavedJobs = ({ savedJobs, onSaveJob }) => {
    return (
        <div>
            {savedJobs.length > 0 ? (
                <div className="grid gap-6">
                    {savedJobs.map(job => (
                        <Job key={job._id} job={job} onSaveJob={onSaveJob} isBookmarked={true} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No jobs saved yet.</p>
            )}
        </div>
    );
};

export default SavedJobs;
