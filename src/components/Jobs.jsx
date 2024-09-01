import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector((store) => store.job);
    const dispatch = useDispatch();
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [searchTerm, setSearchTerm] = useState(searchedQuery || '');

    useEffect(() => {
        if (searchTerm) {
            const filteredJobs = allJobs.filter((job) => {
                return (
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-5 px-4">
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-1/4 lg:w-1/5">
                        <FilterCard />
                    </div>
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        <div className="mb-4">
                            {/* Search Bar */}
                            <input
                                type="text"
                                placeholder="Search for jobs..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        {filterJobs.length <= 0 ? (
                            <span>Job not found</span>
                        ) : (
                            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filterJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
