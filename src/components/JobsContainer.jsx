import React, { useState } from 'react';
import Job from './Job';
import SavedJobs from './SavedJobs';

const JobsContainer = ({ jobs }) => {
    // State to manage saved jobs
    const [savedJobs, setSavedJobs] = useState([]);

    // Function to handle saving a job
    const handleSaveJob = (job) => {
        // Check if the job is already saved
        const isAlreadySaved = savedJobs.some(savedJob => savedJob._id === job._id);
        
        // If the job is already saved, remove it from the saved jobs
        if (isAlreadySaved) {
            setSavedJobs(savedJobs.filter(savedJob => savedJob._id !== job._id));
        } else {
            // Otherwise, add the job to the saved jobs
            setSavedJobs([...savedJobs, job]);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
            <div className="grid gap-6">
                {jobs.map(job => (
                    <Job
                        key={job._id}
                        job={job}
                        onSaveJob={handleSaveJob}
                        isBookmarked={savedJobs.some(savedJob => savedJob._id === job._id)}
                    />
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Saved Jobs</h2>
            <SavedJobs savedJobs={savedJobs} onSaveJob={handleSaveJob} />
        </div>
    );
};

export default JobsContainer;
