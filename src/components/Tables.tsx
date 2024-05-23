import React, { useState, useEffect, ChangeEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Data from '../Data/Salaries.json';

// Define the type for your data
interface SalaryData {
  work_year: number;
  job_title: string;
  salary: number;
}

interface AggregatedData {
  job_title: string;
  count: number;
}

const SalaryTable: React.FC = () => {
  const [sortedData, setSortedData] = useState<SalaryData[]>([]);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    // Initialize sortedData with the imported JSON data, casting it to the correct type
    setSortedData(Data as SalaryData[]); 
  }, []);

  const handleSort = (jobTitle: string) => {
    if (jobTitle) {
      const filteredData = (Data as SalaryData[]).filter(item => item.job_title === jobTitle);
      setSortedData(filteredData);
    } else {
      setSortedData(Data as SalaryData[]);
    }
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedJobTitle = event.target.value;
    setJobTitle(selectedJobTitle);
    handleSort(selectedJobTitle);
  };

  const handleRowClicked = (row: { work_year: number }) => {
    setSelectedYear(row.work_year);
    const yearData = (Data as SalaryData[]).filter(item => item.work_year === row.work_year);
    const aggregated = yearData.reduce<Record<string, number>>((acc, item) => {
      acc[item.job_title] = (acc[item.job_title] || 0) + 1;
      return acc;
    }, {});
    const aggregatedArray = Object.keys(aggregated).map(jobTitle => ({
      job_title: jobTitle,
      count: aggregated[jobTitle],
    }));
    setAggregatedData(aggregatedArray);
  };

  const mainTableColumns: TableColumn<any>[] = [
    {
      name: "Year",
      selector: row => row.work_year,
      sortable: true,
    },
    {
      name: "Total Jobs",
      selector: row => row.length,
      sortable: true,
    },
    {
      name: "Avg Salary (in USD)",
      selector: row => row.avg,
      sortable: true,
    }
  ];

  const uniqueJobTitles = [...new Set((Data as SalaryData[]).map(item => item.job_title))];

  const yearData = [2024, 2023, 2022, 2021, 2020].map(year => {
    const yearItems = (Data as SalaryData[]).filter(item => item.work_year === year);
    const totalJobs = yearItems.length;
    const totalSalary = yearItems.reduce((sum, item) => sum + item.salary, 0);
    const avgSalary = totalJobs ? Math.ceil(totalSalary / totalJobs) : 0;
    return { work_year: year, length: totalJobs, avg: avgSalary };
  });

  const aggregatedTableColumns: TableColumn<any>[] = [
    {
      name: "Job Title",
      selector: row => row.job_title,
      sortable: true,
    },
    {
      name: "Number of Jobs",
      selector: row => row.count,
      sortable: true,
    }
  ];

  return (
    <div className="w-full h-screen container mx-auto px-10 py-10 ">
      <h1 className="text-5xl font-semibold text-center mb-4">Job Titles</h1>
      <DataTable
        columns={mainTableColumns}
        data={yearData}
        onRowClicked={handleRowClicked}
        className="border border-gray-300 rounded mb-4"
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold',
            },
          },
          rows: {
            style: {
              minHeight: '48px',
              '&:nth-of-type(even)': {
                backgroundColor: '#f9f9f9',
              },
              '&:hover': {
                backgroundColor: '#f1f1f1',
              },
            },
          },
        }}
      />
      {selectedYear && (
        <div className='m-10'>
          <h2 className="text-xl font-semibold text-center mb-4">Job Titles in {selectedYear}</h2>
          <DataTable
            columns={aggregatedTableColumns}
            data={aggregatedData}
            className="border border-gray-300 rounded"
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: '#f2f2f2',
                  fontWeight: 'bold',
                },
              },
              rows: {
                style: {
                  minHeight: '48px',
                  '&:nth-of-type(even)': {
                    backgroundColor: '#f9f9f9',
                  },
                  '&:hover': {
                    backgroundColor: '#f1f1f1',
                  },
                },
              },
            }}
            pagination
          />
        </div>
      )}
    </div>
  );
};

export default SalaryTable;
