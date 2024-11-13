import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4">
  <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 my-5">
    <Input
      className="w-full md:w-fit"
      placeholder="Filter by name, role"
      onChange={(e) => setInput(e.target.value)}
    />
    <h1 className="text-xl sm:text-2xl border-2 capitalize p-3 sm:p-4 rounded-lg shadow-lg font-semibold w-full sm:w-auto mx-auto text-center">
      List of Jobs
    </h1>
    <Button className="w-full md:w-auto" onClick={() => navigate("/admin/jobs/create")}>
      New Job
    </Button>
  </div>
  <AdminJobsTable />
</div>

    </div>
  )
}

export default AdminJobs