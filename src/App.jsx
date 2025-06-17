import React, { useState, useEffect, useMemo } from 'react';

// Main App component that renders the DataTable
function App() {
  // Sample data to demonstrate the table features
  const initialData = [
    { id: 1, name: 'Alice Smith', age: 30, city: 'New York', occupation: 'Engineer', salary: 75000 },
    { id: 2, name: 'Bob Johnson', age: 24, city: 'Los Angeles', occupation: 'Designer', salary: 60000 },
    { id: 3, name: 'Charlie Brown', age: 35, city: 'Chicago', occupation: 'Doctor', salary: 120000 },
    { id: 4, name: 'Diana Prince', age: 28, city: 'Houston', occupation: 'Artist', salary: 50000 },
    { id: 5, name: 'Eve Adams', age: 42, city: 'Phoenix', occupation: 'Manager', salary: 90000 },
    { id: 6, name: 'Frank White', age: 29, city: 'Philadelphia', occupation: 'Developer', salary: 80000 },
    { id: 7, name: 'Grace Taylor', age: 31, city: 'San Antonio', occupation: 'Teacher', salary: 55000 },
    { id: 8, name: 'Henry King', age: 27, city: 'San Diego', occupation: 'Sales Rep', salary: 65000 },
    { id: 9, name: 'Ivy Green', age: 33, city: 'Dallas', occupation: 'Accountant', salary: 70000 },
    { id: 10, name: 'Jack Hall', age: 26, city: 'San Jose', occupation: 'Marketing', salary: 58000 },
    { id: 11, name: 'Karen Miller', age: 38, city: 'Austin', occupation: 'Consultant', salary: 95000 },
    { id: 12, name: 'Liam Davis', age: 22, city: 'Jacksonville', occupation: 'Intern', salary: 40000 },
    { id: 13, name: 'Mia Wilson', age: 45, city: 'Fort Worth', occupation: 'CEO', salary: 150000 },
    { id: 14, 'first name': 'Noah', 'last name': 'Thomas', age: 30, city: 'Columbus', occupation: 'Architect', salary: 85000 }, // Example with multi-word keys
    { id: 15, name: 'Olivia Clark', age: 29, city: 'Charlotte', occupation: 'Journalist', salary: 62000 },
    { id: 16, name: 'Peter Lewis', age: 36, city: 'San Francisco', occupation: 'Data Scientist', salary: 110000 },
    { id: 17, name: 'Quinn Roberts', age: 25, city: 'Indianapolis', occupation: 'UX Designer', salary: 68000 },
    { id: 18, name: 'Rachel Walker', age: 32, city: 'Seattle', occupation: 'Product Manager', salary: 100000 },
    { id: 19, name: 'Sam Baker', age: 40, city: 'Denver', occupation: 'HR Specialist', salary: 72000 },
    { id: 20, name: 'Tina Wright', age: 23, city: 'Washington', occupation: 'Photographer', salary: 48000 },
    { id: 21, name: 'Uma Nelson', age: 37, city: 'Boston', occupation: 'Researcher', salary: 88000 },
    { id: 22, name: 'Victor Hill', age: 30, city: 'El Paso', occupation: 'Geologist', salary: 70000 },
    { id: 23, name: 'Wendy Scott', age: 28, city: 'Detroit', occupation: 'Chef', salary: 53000 },
    { id: 24, name: 'Xavier Adams', age: 34, city: 'Memphis', occupation: 'Consultant', salary: 92000 },
    { id: 25, name: 'Yara King', age: 27, city: 'Boston', occupation: 'Software Engineer', salary: 98000 },
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen mx-auto bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-8 text-center drop-shadow-lg animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            React Table
          </span>
        </h1>
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-lg p-6">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
            <p className="mt-6 text-xl text-gray-700 font-medium">Loading your data with style...</p>
          </div>
        ) : (
          <DataTable data={initialData} rowsPerPageOptions={[5, 10, 15, 20, 25]} initialRowsPerPage={10} />
        )}
      </div>
    </div>
  );
}

// DataTable component
function DataTable({ data, rowsPerPageOptions = [10, 20, 50], initialRowsPerPage = 10 }) {
  // State to hold the original, unfiltered data
  const [originalData] = useState(data);
  // State for the current sort column
  const [sortColumn, setSortColumn] = useState(null);
  // State for the sort direction ('asc' or 'desc')
  const [sortDirection, setSortDirection] = useState('asc');
  // State for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // State for the current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State for the number of rows to display per page
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Derive column headers from the keys of the first data object
  // Uses useMemo to re-calculate only if originalData changes (which it won't here, but good practice)
  const columns = useMemo(() => {
    if (originalData.length === 0) return [];
    return Object.keys(originalData[0]);
  }, [originalData]);

  // Filter and sort the data based on search term, sort column, and direction
  // This memoized value ensures filtering/sorting is only re-calculated when relevant states change
  const filteredSortedData = useMemo(() => {
    let currentData = [...originalData];

    // 1. Filtering
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentData = currentData.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }

    // 2. Sorting
    if (sortColumn) {
      currentData.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];

        // Handle numeric and string comparisons
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        } else {
          // Fallback to string comparison for other types
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
          if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }
    return currentData;
  }, [originalData, searchTerm, sortColumn, sortDirection]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredSortedData.length / rowsPerPage);

  // Adjust current page if it's out of bounds after filtering/sorting
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1); // Reset to page 1 if no data
    }
  }, [filteredSortedData, rowsPerPage, totalPages, currentPage]);


  // Get the data for the current page
  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredSortedData.slice(startIndex, endIndex);
  }, [filteredSortedData, currentPage, rowsPerPage]);

  // Handle column header clicks for sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on new sort
  };

  // Handle search input changes
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle rows per page selection change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle next page button click
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Handle previous page button click
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 overflow-x-auto border border-gray-100 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.005]">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search all columns..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 text-lg shadow-sm"
        />
      </div>

      {/* Data Table */}
      <div className="relative overflow-x-auto max-h-[60vh] rounded-xl shadow-inner border border-gray-200"> {/* Max height for scrollable content */}
        <table className="w-full text-left text-gray-800 table-auto">
          {/* Table Header */}
          <thead className="text-sm uppercase bg-gradient-to-r from-blue-500 to-purple-600 text-white sticky top-0 z-10 shadow-md">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className={`px-5 py-3 cursor-pointer hover:bg-blue-600 transition duration-200 ease-in-out select-none
                              ${sortColumn === column ? 'bg-blue-700 font-bold' : ''}`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center justify-between">
                    {/* Capitalize first letter of each word in column header */}
                    {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    {sortColumn === column && (
                      <span className="ml-2 text-white text-base">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {currentTableData.length > 0 ? (
              currentTableData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="bg-white border-b border-gray-100 hover:bg-purple-50 transition duration-200 ease-in-out">
                  {columns.map((column) => (
                    <td key={column} className="px-5 py-3 whitespace-nowrap text-gray-700">
                      {String(row[column])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 text-lg">
                  No data found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
        <div className="mb-4 sm:mb-0">
          <label htmlFor="rows-per-page" className="mr-3 text-gray-700 text-base font-medium">Rows per page:</label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm transition duration-200"
          >
            {rowsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="text-base text-gray-600 mb-4 sm:mb-0">
          Page <span className="font-semibold text-gray-800">{currentPage}</span> of <span className="font-semibold text-gray-800">{totalPages === 0 ? 1 : totalPages}</span> (Total <span className="font-semibold text-gray-800">{filteredSortedData.length}</span> entries)
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


export default App
