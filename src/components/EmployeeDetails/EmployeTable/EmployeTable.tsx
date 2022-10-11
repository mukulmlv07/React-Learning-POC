import React, { useEffect, useMemo, useState } from "react";
import { EmpList } from "../model/EmpList";
import EditEmp from "../DialogBox/EditEmp";
import Status from "../DialogBox/Status";
import DeleteEmployee from "../DialogBox/DeleteEmployee";
import { FiEdit } from "react-icons/fi";
// import { MdClear } from "react-icons/md";
import { Input, Table } from 'semantic-ui-react';
import "./EmployeeTable.css";

interface Props {
  emp: EmpList[];
  setEmp: React.Dispatch<React.SetStateAction<EmpList[]>>;
}

const TableExampleCompact = () => (
  <Table compact='very'>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Notes</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>John</Table.Cell>
        <Table.Cell>Approved</Table.Cell>
        <Table.Cell>None</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

const useSortableData = (items: any[], setTableData: React.Dispatch<React.SetStateAction<any[]>>, config = null) => {
  const [sortConfig, setSortConfig] = useState<any>(config);

  const sortedItems = useMemo(() => {
    const sortableItems: any[] = Object.assign([], items);
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    setTableData(sortableItems);
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: any) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const EmployeTable: React.FC<Props> = ({ emp, setEmp }: Props) => {
  const [editData, setEditData] = useState<any>(null);

  const [isShow, setIsShow] = useState<boolean>(false);

  const [tableData, setTableData] = useState<any>(emp);
  const [filterKeys, setFilterKeys] = useState({});

  const { items, requestSort, sortConfig } = useSortableData(emp, setTableData);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const columns = [
    { title: "Employee ID", field: "empId" },
    { title: "Name", field: "name" },
    { title: "Email ID", field: "email" },
    { title: "Department", field: "department" },
    { title: "Designation", field: "designation" },
  ];

  useEffect(() => {
    if (items && items.length > 0) {
      setTableData(items);
    }

    let filterObject: any = {};
    columns.forEach((column) => {
      filterObject[column.field] = "";
    });
    setFilterKeys(filterObject);
  }, [emp]);

  const initModal = (data: any) => {
    setEditData(data);
    setIsShow(!isShow);
  };

  const filterDataOnSearch = (e: any, columnName: any) => {
    let searchText: any = e.target.value ? new RegExp(e.target.value, "i") : null;
    let result = [];
    let isFilterKeyEmpty = true;

    setFilterKeys({
      ...filterKeys,
      [columnName]: searchText,
    });

    let filterOptions: any = Object.assign({}, filterKeys);
    filterOptions[columnName as keyof typeof filterOptions] = searchText;
    Object.values(filterOptions).forEach((filterValue) => {
      if (filterValue && filterValue !== "") {
        isFilterKeyEmpty = false;
        return;
      }
    });

    if (isFilterKeyEmpty) {
      setTableData(JSON.parse(JSON.stringify(emp)));
      // setPartialData(data)
    } else {
      result = emp.filter((row) => {
        let condition = true;

        for (let [filterColumn, filterRegex] of Object.entries(filterOptions)) {
          let filterReg: any = filterRegex;
          if (filterReg) {
            if (!row[filterColumn as keyof EmpList].toString().match(filterReg))
              condition = false;
          }
        }
        if (condition) return row;
      });

      setTableData(result);
      // setPartialData(result)
    }
  };

  // const clearColumnFilter = (field: any) => {
  //   if(filterKeys.hasOwnProperty(field)){
  //     delete filterKeys[field as keyof typeof filterKeys]; 
  //   }
  //   console.log("filterKeys:", filterKeys)
  // }

  const tableSearch = (
    <tr className="search-row" key={"search-row"}>
      {columns.map((column, index) => (
        <td key={column.field + index}>
          {/* <div className="d-inline-flex"> */} 
          <Input
            // className="search-input-field form-control"
            placeholder={"Search"}
            autoComplete="off"
            onKeyUp={(e: any) => filterDataOnSearch(e, column.field)}
          />
          {/* <MdClear size="20px" className="mt-2 filter-clear" onClick={() => clearColumnFilter(column.field)} />
          </div> */}
        </td>
      ))}
    </tr>
  );

  return (
    <div>
      <div className="emp-table">
        <Table compact='very'>
          <Table.Header style={{ backgroundColor: "#d8e3eb" }}>
            <Table.Row>
              {columns &&
                columns.length > 0 &&
                columns.map(column => (
                  <Table.HeaderCell key={column.field}>
                    <button
                      type="button"
                      onClick={() => requestSort(column.field)}
                      className={`d-inline-flex ${getClassNamesFor(column.field)}`}
                    >
                      <h6>{column.title}</h6>
                    </button>
                  </Table.HeaderCell>
                ))
              }
              <Table.HeaderCell colSpan={3} >
                <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>Actions</p>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              {columns.map((column, index) => (
                <Table.Cell key={column.field + index}>
                  {/* <div className="d-inline-flex"> */}
                  <Input
                    // className="search-input-field form-control"
                    placeholder={"Search"}
                    autoComplete="off"
                    onKeyUp={(e: any) => filterDataOnSearch(e, column.field)}
                  />
                  {/* <MdClear size="20px" className="mt-2 filter-clear" onClick={() => clearColumnFilter(column.field)} />
                </div> */}
                </Table.Cell>
              ))}
              <Table.Cell></Table.Cell>
            </Table.Row>
            {tableData.map((data: any) => (
              <tr key={data.empId}>
                <Table.Cell>{data.empId}</Table.Cell>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell>{data.email}</Table.Cell>
                <Table.Cell>{data.department}</Table.Cell>
                <Table.Cell>{data.designation}</Table.Cell>
                <Table.Cell><FiEdit size="20px" className='action-icon c-p' onClick={() => initModal(data)} /></Table.Cell>
                <Table.Cell><Status data={data} /></Table.Cell>
                <Table.Cell><DeleteEmployee empId={data.empId} empList={emp} setEmp={setEmp} /></Table.Cell>
              </tr>
            ))}
          </Table.Body>
        </Table>
      </div>

      {editData && (
        <EditEmp
          emp={emp}
          setEmp={setEmp}
          isShow={isShow}
          setIsShow={setIsShow}
          editData={editData}
        />
      )}

      {!(emp.length > 0) &&
        <p
          style={{
            // border: "1px solid red",
            textAlign: "center",
            fontSize: "14px",
            color: "grey",
            padding: 10,
          }}
        >
          No Employees are found please add a Employee
        </p>
      }
    </div>
  );
};

export default EmployeTable;
