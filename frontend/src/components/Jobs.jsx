
/* eslint-disable no-unused-vars */
 import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import {motion} from 'framer-motion'



const Jobs = () => {
  const {allJobs, searchedQuery} = useSelector(store=>store.job)
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        // Extract numbers to check if the query is a salary range
        const salaryFilter = searchedQuery.match(/(\d+)/g); // Extract numbers
        let minSalary = 0, maxSalary = Infinity;
        let isSalaryFilter = false;
  
        if (salaryFilter) {
          if (salaryFilter.length === 1) {
            minSalary = parseInt(salaryFilter[0]);
            isSalaryFilter = true;
          } else if (salaryFilter.length === 2) {
            minSalary = parseInt(salaryFilter[0]);
            maxSalary = parseInt(salaryFilter[1]);
            isSalaryFilter = true;
          }
        }
  
        // Apply filters
        const matchesTitle = job.title.toLowerCase().includes(searchedQuery.toLowerCase());
        const matchesDescription = job.description.toLowerCase().includes(searchedQuery.toLowerCase());
        const matchesLocation = job.location.toLowerCase().includes(searchedQuery.toLowerCase());
        const matchesSalary = isSalaryFilter ? (job.salary >= minSalary && job.salary <= maxSalary) : false;
        const matchesIndustry = job.jobType.toLowerCase().includes(searchedQuery.toLowerCase());
  
        // Return jobs that match any condition
        return matchesTitle || matchesDescription || matchesLocation || matchesSalary || matchesIndustry;
      });
  
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);
  
  
  return (
    <div>
        <Navbar/>
        <div className='max-w-7xl mx-auto mt-5'>
        <div className='flex gap-5'>
          <div className='w-20%'>
              <FilterCard />
          </div>
          {
            filterJobs.length <= 0 ? <span>Job not found</span>:(
              <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                <div className='grid grid-cols-3 gap-4'>
                  {
                  filterJobs.map(job=>(
                    <motion.div 
                      initial={{opacity:0, x: 100}}
                      animate={{opacity:1, x: 0}}
                      exit={{opacity:0, x: 100}}
                      transition={{ duration: 0.3 }}
                    key={job?._id}>
                      <Job job={job}/>
                    </motion.div>
                  ))
                }
                </div>
              </div>
            )
          }

        </div>
        </div> 
    </div>
  )
}

export default Jobs


