import axios from "axios";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

interface User {
  user_id: number;
  company_id: number;
  department_id?: number;
  unit_id?: number;
  name: string;
}

interface Company {
  company_id: number;
  name: string;
}

interface Department {
  department_id: number;
  company_id: number;
  name: string;
}

interface Unit {
  unit_id: number;
  company_id: number;
  department_id?: number;
  name: string;
}

interface UserContextType {
  user: User[];
  company: Company[];
  department: Department[];
  unit: Unit[];
  filteredDepartments: Department[] | [];
  filteredUnits: Unit[] | [];
  setCompanyID: Dispatch<SetStateAction<number | null>>;
  setDepartmentID: Dispatch<SetStateAction<number | null>>;
  setUnitID: Dispatch<SetStateAction<number | null>>;
  companyID: number | null;
  departmentID: number | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [companyID, setCompanyID] = useState<number | null>(null);
  const [departmentID, setDepartmentID] = useState<number | null>(null);
  const [unitID, setUnitID] = useState<number | null>(null);

  let url = "http://localhost/itam_api/asset.php?resource=";
  const getResource = async (resource: string) => {
    try {
      const response = await axios.get(url + resource);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const setup = async () => {
      const users = await getResource("user");
      const companies = await getResource("company");
      const departments = await getResource("department");
      const units = await getResource("unit");
      setUser(users);
      setCompany(companies);
      setDepartment(departments);
      setUnit(units);
    };
    setup();
  }, []);

  const filteredDepartments: Department[] | [] = useMemo(() => {
    if (!companyID) return [];

    return department.filter((dept) => dept.company_id === companyID);
  }, [companyID, departmentID]);

  const filteredUnits: Unit[] | [] = useMemo(() => {
    if (!company) return [];

    return unit.filter((un) => un.company_id === companyID);
  }, [companyID, unitID]);

  const value = {
    user,
    company,
    department,
    unit,
    setCompanyID,
    setDepartmentID,
    companyID,
    departmentID,
    filteredDepartments,
    filteredUnits,
    setUnitID,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AssetProvider");
  }
  return context;
};
