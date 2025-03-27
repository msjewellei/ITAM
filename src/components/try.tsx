import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";

interface AccountProps {
  name?: string;
}
  interface User {
    eyeColor: any;
    firstName: string;
    lastName: string;
    company: {
      unit?: string;
      name: string;
      department?: string;
    };
  }
function Account({name}: AccountProps) {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);

  const [companies, setCompanies] = useState<string[]>([]);
  const [departments, setDepartments] = useState<{ department?: string; company: string }[]>([]);
  const [units, setUnits] = useState<{ unit: string; company: string }[]>([])
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [departmentID, setDepartmentID] = useState<string | null>(null);
  const [unitID, setUnitID] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await axios.get("https://dummyjson.com/users");
      setCompanies(response.data.users.map((user: User) => user.company.name));
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const setup = async () => {
      const response = await axios.get("https://dummyjson.com/users");
      setUsers(response.data.users);
    };
    setup();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get("https://dummyjson.com/users");
      setDepartments(
        response.data.users.map((user : User) => {
          return {
            department: user.company.department,
            company: user.company.name,
          };
        })
      );
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      const response = await axios.get("https://dummyjson.com/users");
      setUnits(
        response.data.users.map((user : User) => {
          return {
            unit: user.eyeColor,
            company: user.company.name,
          };
        })
      );
    };
    fetchUnits();
  }, []);

  
  
  const filteredUsers = useMemo(() => {
    let currentUsers = users;
    if (companyID) {
      currentUsers = currentUsers.filter(
        (user) => user.company.name === companyID
      );
    }    
    if (departmentID) {
      currentUsers = currentUsers.filter(
        (user) => user.company.department === departmentID
      );
    }
    if (unitID) {
      currentUsers = currentUsers.filter(
        (user) => user.eyeColor === unitID
      );
    }
    
    return currentUsers;
  }, [companyID, departmentID, unitID, users]);
  
  const companyDepartments = useMemo(() => {
    if (!companyID) return [];
    return departments.filter((dept) => dept.company === companyID);
  }, [companyID]);

  const companyUnits = useMemo(() => {
    if (!companyID) return [];
    return units.filter((unit) => unit.company === companyID);
  }, [companyID]);

  return (
    <div>
      <h1 className="text-xl underline">Account Page</h1>
      <Routes>
        <Route path="/" element={<h1>Account Home</h1>} />
      </Routes>
      <p>Hello {id}</p>
      <div>
        <div>
          <label htmlFor="company-select">Filter by Company:</label>
          <select
            id="company-select"
            onChange={(e) => setCompanyID(e.target.value)}
          >
            <option value="">Select a company</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
          {companyID && (
          <div>
            <label htmlFor="department-select">Filter by Department:</label>
            <select id="department-select" onChange={(e) => setDepartmentID(e.target.value)}>
              <option value="">Select a department</option>
              {companyDepartments.map((department, index) => (
                <option key={index} value={department.department}>
                  {department.department}
                </option>
              ))}
            </select>
          </div>
        )}
        {departmentID && (
          <div>
            <label htmlFor="unit-select">Filter by Units:</label>
            <select id="unit-select" onChange={(e) => setUnitID(e.target.value)}>
              <option value="">Select a Unit</option>
              {companyUnits.map((units, index) => (
                <option key={index} value={units.unit}>
                  {units.unit}
                </option>
              ))}
            </select>
          </div>
        )}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td className="p-2 px-4">
                  {user.firstName + " " + user.lastName}
                </td>
                <td className="p-2 px-4">{user.company.name}</td>
                <td className="p-2 px-4">{user.company.department}</td>
                <td className="p-2 px-4">{user.eyeColor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Account;