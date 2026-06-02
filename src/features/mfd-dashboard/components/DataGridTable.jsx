import React from 'react';

const DataGridTable = ({ headers, rows, compact = false }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full ${compact ? 'text-xs' : 'text-sm'}`}>
      <thead className="bg-navy-900 text-white">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-3 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  </div>
);

export default DataGridTable;

