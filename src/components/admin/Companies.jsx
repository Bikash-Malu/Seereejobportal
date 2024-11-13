import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);
    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto my-10 px-4">
  <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 my-5">
    <Input
      className="w-full md:w-fit"
      placeholder="Filter by name"
      onChange={(e) => setInput(e.target.value)}
    />
    <h1 className="text-xl sm:text-2xl border-2 capitalize p-3 sm:p-4 rounded-lg shadow-lg font-semibold w-full sm:w-auto mx-auto text-center">
      List of Companies
    </h1>
    <Button
      className="w-full md:w-auto"
      onClick={() => navigate("/admin/companies/create")}
    >
      New Company
    </Button>
  </div>
  <CompaniesTable />
</div>

        </div>
    )
}

export default Companies