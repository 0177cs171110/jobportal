/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */

import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return null;

    const createdAt = new Date(mongodbTime);
    console.log("Created At:", mongodbTime, "Parsed Date:", createdAt); // Debugging log
    
    if (isNaN(createdAt.getTime())) {
      return null; // Invalid date
    }

    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysAgo;
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  useEffect(() => {
    console.log("Job Data:", job); // Log the whole job object for further inspection
  }, [job]);

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          {daysAgo === 0
            ? 'Today'
            : daysAgo !== null 
              ? `${daysAgo} days ago`
              : 'Date not available'}
        </p>
        <Button variant='outline' className='rounded-full' size='icon'>
          <Bookmark />
        </Button>
      </div>
      <div className='flex items-center gap-2 my-2'>
        <Button className='p-6' variant='outline' size='icon'>
          <Avatar className='flex items-center'>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>
      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>
      <div className='flex flex-center gap-2 mt-4'>
        <Badge className={'text-blue-700 font-bold'} variant='ghost'>
          {job?.position} Positions
        </Badge>
        <Badge className={'text-[#F83002] font-bold'} variant='ghost'>
          {job?.jobType} Time
        </Badge>
        <Badge className={'text-[#7209b7] font-bold'} variant='ghost'>
          {job?.salary}
        </Badge>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant='outline'>
          Details
        </Button>
        <Button className='bg-[#7209b7]'>Save for Later</Button>
      </div>
    </div>
  );
};

export default Job;
