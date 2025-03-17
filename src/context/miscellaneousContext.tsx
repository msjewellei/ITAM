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
import mockCompanies from "@/data/companies.json";
import mockDepartments from "@/data/departments.json";
import mockUnits from "@/data/units.json";
import mockUsers from "@/data/users.json";

interface User {
  user_id: number;
  company_id: number;
  department_id: number | null;
  unit_id: number | null;
  first_name: string;
  last_name: string;
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

interface Category {
  category_id: number;
  category_name: string;
}

interface Subcategory {
  sub_category_id: number;
  category_id: number;
  sub_category_name: string;
}

interface Type {
  type_id: number;
  type_name: string;
}

interface Condition {
  asset_condition_id: number;
  asset_condition_name: string;
}

interface Status {
  status_id: number;
  status_name: string;
}

interface RepairUrgency {
  urgency_id: number;
  urgency_level: string;
}

interface MiscContextType {
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
  category: Category[];
  subcategory: Subcategory[];
  type: Type[];
  condition: Condition[];
  status: Status[];
  repairUrgency: RepairUrgency[];
  setCategoryID: Dispatch<SetStateAction<number | null>>;
  setSubCategoryID: Dispatch<SetStateAction<number | null>>;
  setTypeID: Dispatch<SetStateAction<number | null>>;
  subCategoryID: number | null;
  categoryID: number | null;
  typeID: number | null;
  filteredSubcategories: Subcategory[] | [];
  filteredUsers: User[] | [];
  userID: number | null;
  setUserID: Dispatch<SetStateAction<number | null>>;
  unitID: number | null;
}

const MiscContext = createContext<MiscContextType | undefined>(undefined);
export const MiscProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory[]>([]);
  const [type, setType] = useState<Type[]>([]);
  const [condition, setCondition] = useState<Condition[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  const [repairUrgency, setRepairUrgency] = useState<RepairUrgency[]>([]);
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [subCategoryID, setSubCategoryID] = useState<number | null>(null);
  const [typeID, setTypeID] = useState<number | null>(null);
  const [companyID, setCompanyID] = useState<number | null>(null);
  const [departmentID, setDepartmentID] = useState<number | null>(null);
  const [unitID, setUnitID] = useState<number | null>(null);
  const [userID, setUserID] = useState<number | null>(null);

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
      const categories = await getResource("category");
      const subcategories = await getResource("subcategory");
      const types = await getResource("type");
      const conditions = await getResource("condition");
      const statuses = await getResource("status");
      const repairUrgencies = await getResource("repairUrgency");
      setCategory(categories);
      setSubcategory(subcategories);
      setType(types);
      setCondition(conditions);
      setStatus(statuses);
      setRepairUrgency(repairUrgencies);
      setCompany(mockCompanies);
      setDepartment(mockDepartments);
      setUnit(mockUnits);
      setUser(mockUsers);
    };
    setup();
  }, []);

  const filteredSubcategories: Subcategory[] | [] = useMemo(() => {
    if (!categoryID) return [];

    return subcategory.filter((sub) => sub.category_id === categoryID);
  }, [categoryID, subCategoryID]);

  const filteredDepartments: Department[] | [] = useMemo(() => {
    if (!companyID) return [];

    return department.filter((dept) => dept.company_id === companyID);
  }, [companyID, departmentID]);

  const filteredUnits: Unit[] | [] = useMemo(() => {
    if (!company) return [];

    return unit.filter((un) => un.company_id === companyID && un.department_id === departmentID);
  }, [companyID, departmentID]);

  const filteredUsers: User[] | [] = useMemo(() => {
      let newUsers = user;
    
      if (companyID) {
        newUsers = newUsers.filter((asset) => Number(asset.company_id) === companyID);
      }
    
      if (departmentID) {
        newUsers = newUsers.filter((asset) => Number(asset.department_id) === departmentID);
      }
    
      if (unitID) {
        newUsers = newUsers.filter((asset) => Number(asset.unit_id) === unitID);
      }
    
      return newUsers;
    }, [companyID, departmentID, unitID, user]);

  const value = {
    user,
    company,
    department,
    unit,
    category,
    subcategory,
    type,
    condition,
    status,
    repairUrgency,
    setCategoryID,
    setSubCategoryID,
    subCategoryID,
    filteredSubcategories,
    categoryID,
    setCompanyID,
    setDepartmentID,
    companyID,
    departmentID,
    filteredDepartments,
    filteredUnits,
    setUnitID,
    typeID,
    setTypeID,
    filteredUsers,
    userID,
    setUserID,
    unitID
  };
  return <MiscContext.Provider value={value}>{children}</MiscContext.Provider>;
};
export const useMisc = () => {
  const context = useContext(MiscContext);
  if (context === undefined) {
    throw new Error("useMisc must be used within an AssetProvider");
  }
  return context;
};
