import React from "react";
import ReactPaginate from 'react-paginate';

export default function Pages({...props}) {
    return (
        <div className="py-2">
            <ReactPaginate
                pageCount={props.pages + 1}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={props.action}
                containerClassName={'flex mx-auto mt-10 justify-center'}
                activePageClassName={'text-red-900'}
                nextLabel='navigate_next'
                previousLabel='navigate_before'
                activeLinkClassName={'text-bold text-2xl text-red-500'}
                previousClassName={'dark:text-white material-icons-outlined pt-0.5 hover:text-red-500'}
                nextClassName={'dark:text-white cursor-pointer select-none material-icons-outlined pt-0.5 hover:text-red-500'}
                pageClassName={'dark:text-white cursor-pointer select-none text-lg sm:px-3 mx-2 hover:text-red-500'}
                breakLinkClassName={'dark:text-white text-lg sm:px-3 mx-2 hover:text-red-500'}
                disabledClassName={'material-icons-outlined'}
                forcePage={props.currentPage - 1 || 0}
            />
        </div>
    );
}