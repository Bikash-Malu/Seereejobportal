import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-6 sm:p-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                    <div className='flex items-center gap-4 mb-4 sm:mb-0'>
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div className='text-center sm:text-left'>
                            <h1 className='font-medium text-lg sm:text-xl'>{user?.fullname}</h1>
                            <p className='text-sm sm:text-base'>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="sm:ml-auto" variant="outline">
                        <Pen />
                    </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span className='text-sm sm:text-base'>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span className='text-sm sm:text-base'>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='text-lg sm:text-xl font-semibold'>Skills</h1>
                    <div className='flex flex-wrap gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                <Badge key={index} className="text-sm sm:text-base px-2 py-1">{item}</Badge>
                            )) : <span className='text-sm sm:text-base'>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume ? (
                            <a
                                target='blank'
                                href={user?.profile?.resume}
                                className='text-blue-500 w-full hover:underline cursor-pointer text-sm sm:text-base'
                            >
                                {user?.profile?.resumeOriginalName}
                            </a>
                        ) : <span className='text-sm sm:text-base'>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-6 sm:p-8'>
                <h1 className='font-bold text-lg sm:text-xl my-5'>Applied Jobs</h1>
                {/* Applied Job Table */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
