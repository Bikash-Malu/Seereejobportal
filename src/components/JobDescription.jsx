import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some((application) => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        setLoading(true); // Set loading state to true
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some((application) => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b pb-4">
                <div className="md:w-3/4 mb-4 md:mb-0">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{singleJob?.title}</h1>
                    <div className="flex flex-wrap gap-2">
                        <Badge className="text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded">{singleJob?.position} Positions</Badge>
                        <Badge className="text-[#F83002] font-bold bg-red-100 px-2 py-1 rounded">{singleJob?.jobType}</Badge>
                        <Badge className="text-[#b709ab] font-bold bg-purple-100 px-2 py-1 rounded">{singleJob?.salary} LPA</Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied || loading ? null : applyJobHandler}
                    disabled={isApplied || loading}
                    className={`py-2 px-4 text-white rounded-md transition-all duration-300 ${
                        isApplied ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                    }`}
                >
                    {loading ? 'Applying...' : isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Job Details</h2>
                    <p className="text-gray-700 mb-2"><span className="font-bold">Role:</span> {singleJob?.title}</p>
                    <p className="text-gray-700 mb-2"><span className="font-bold">Location:</span> {singleJob?.location}</p>
                    <p className="text-gray-700 mb-2"><span className="font-bold">Description:</span> {singleJob?.description}</p>
                    <p className="text-gray-700 mb-2"><span className="font-bold">Experience:</span> {singleJob?.experienceLevel} yrs</p>
                </div>

                {/* Right Column */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                    <p className="text-gray-700 mb-2"><span className="font-bold">Salary:</span> {singleJob?.salary} LPA</p>
                    <p className="text-gray-700 mb-2"><span className="font-bold">Total Applicants:</span> {singleJob?.applications?.length}</p>
                    <p className="text-gray-700 mb-2"><span className="font-bold">Posted Date:</span> {singleJob?.createdAt.split("T")[0]}</p>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;
