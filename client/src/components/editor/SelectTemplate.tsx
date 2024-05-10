import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const IPFS_URL_BASE = process.env.REACT_APP_IPFS_URL_BASE;
const API_SERVER = process.env.REACT_APP_PROCESSOR_API;


export default function SelectTemplate(props) {
  const { getRemoteTemplateData, templateOptionList, addImageToCanvas, resetCurrentView } = props;

  // State for managing pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(22);  // Assuming you know the total pages

  // Fetch data when the component mounts and when currentPage changes
  useEffect(() => {
    getRemoteTemplateData(currentPage);
  }, [currentPage]);

  // Function to handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  console.log(templateOptionList);

  return (
    <div className={`m-auto bg-neutral-50 rounded-lg mb-8 mt-[50px] pl-2 pr-2`}>
      <div>
        <div className='grid grid-cols-3'>

          <div className=''>
            <div className='w-90px text-left float-left pl-2 cursor-pointer ' onClick={() => resetCurrentView()} >
            <FaChevronLeft className='inline-flex align-baseline'/>
            <div className='text-2xl inline-flex'>Templates</div>
            </div>

          </div>

          <div className=' ml-auto'>
         
          </div>

          <div className=''>
            <div className='inline-flex cursor-pointer bg-gray-200 rounded-md p-2 h-[30px] align-top' onClick={() => handlePageChange(currentPage - 1)} >
              <FaChevronLeft />
               <div className='inline-flex text-sm font-bold mb-1'>Prev</div>
            </div>
            <div className='inline-flex mt-1'>
              <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
            </div>
            <div className='inline-flex cursor-pointer bg-gray-200 rounded-md p-2 h-[30px] align-top' onClick={() => handlePageChange(currentPage + 1)}>
              <div className=' inline-flex text-sm font-bold mb-1'>Next</div>
              <FaChevronRight />
            </div>

          </div>
        </div>

      </div>
      <div className='max-w-6xl mx-auto p-4'>
        <div className='columns-4 gap-2'>
          {templateOptionList.map((templateOption, index) => (
            <div key={`${index}_template_item_${currentPage}`}
              className='break-inside-avoid mb-4 cursor-pointer'
              onClick={() => addImageToCanvas(templateOption)}>
              <img alt={`Template ${index}`}
                src={`${API_SERVER}/templates/mm_final/${templateOption}`}
                className='w-full rounded-lg' 
                loading="lazy"/>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
