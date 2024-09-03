import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ClipLoader } from 'react-spinners';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [localApplicants, setLocalApplicants] = useState(applicants?.applications || []); // Local state for applicants
    const [loadingStatus, setLoadingStatus] = useState({}); // State to manage loading for each applicant

    const statusHandler = async (status, id) => {
        setLoadingStatus(prev => ({ ...prev, [id]: status })); // Set loading to the specific status for this applicant
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoadingStatus(prev => ({ ...prev, [id]: null })); // Reset loading status for this applicant
        }
    };

    const handleDeleteApplicant = async (id) => {
        setLoadingStatus(prev => ({ ...prev, [id]: 'Deleting' })); // Set loading to 'Deleting' for this applicant
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/applicants/${id}`);

            if (res.data.success) {
                toast.success(res.data.message);
                // Remove the deleted applicant from the local state
                setLocalApplicants(prev => prev.filter(applicant => applicant._id !== id));
            }
        } catch (error) {
            toast.error(error.response.data.message || "Failed to delete the applicant. Please try again.");
        } finally {
            setLoadingStatus(prev => ({ ...prev, [id]: null })); // Reset loading status for this applicant
        }
    };

    const confirmDeleteApplicant = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this applicant?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleDeleteApplicant(id)
                },
                {
                    label: 'No',
                    onClick: () => {} // Do nothing if 'No' is selected
                }
            ]
        });
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {localApplicants.map((item) => (
                        <tr key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{item?.applicant?.email}</TableCell>
                            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a
                                        className="text-blue-600 cursor-pointer"
                                        href={item?.applicant?.profile?.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span>NA</span>
                                )}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="float-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        {shortlistingStatus.map((status, index) => (
                                            <div
                                                onClick={() => statusHandler(status, item?._id)}
                                                key={index}
                                                className="flex items-center my-2 cursor-pointer"
                                            >
                                                {loadingStatus[item._id] === status && (
                                                    <ClipLoader size={16} color={"#3498db"} loading={true} className="mr-2" />
                                                )}
                                                <span>{status}</span>
                                            </div>
                                        ))}
                                        <div
                                            onClick={() => confirmDeleteApplicant(item?._id)}
                                            className="flex w-fit items-center my-2 cursor-pointer text-red-600"
                                        >
                                            {loadingStatus[item._id] === 'Deleting' && (
                                                <ClipLoader size={16} color={"#e74c3c"} loading={true} className="mr-2" />
                                            )}
                                            <Trash2 className="w-4" />
                                            <span>Delete</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
