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

interface NewSubcategory {
  category_id: number;
  sub_category_name: string;
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
  find(arg0: (typ: { type_name: string }) => boolean): unknown;
  type_id: number;
  type_name: string;
}

interface MappedType {
  map_id: number;
  sub_category_id: number;
  type_id: number;
}

interface Condition {
  asset_condition_id: number;
  asset_condition_name: string;
}

interface Status {
  status_id: number;
  status_name: string;
  function_id: number;
}

interface RepairUrgency {
  urgency_id: number;
  urgency_level: string;
}

interface Insurance {
  insurance_id: number;
  insurance_name: string;
  insurance_coverage: string;
  insurance_date_from: Date;
  insurance_date_to: Date;
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
  mappedtype: MappedType[];
  insertSubCategory: (sub: Subcategory) => void;
  insertMappedType: (type: MappedType) => void;
  insurancee: Insurance[];
  insuranceID: number | null;
  setInsuranceID: Dispatch<SetStateAction<number | null>>;
  insertCategory: (data: { category_name: string }) => Promise<any>;
}

const MiscContext = createContext<MiscContextType | undefined>(undefined);
export const MiscProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [insurancee, setInsurance] = useState<Insurance[]>([]);
  const [insuranceID, setInsuranceID] = useState<number | null>(null);
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
  const [mappedtype, setMappedType] = useState<MappedType[]>([]);
  const [reload, setReload] = useState(0);

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

  const insertCategory = async (data: { category_name: string }) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      const response = await axios.post(
        "http://localhost/itam_api/asset.php?resource=category",
        formData
      );

      if (response.data) {
        setReload((count) => count + 1); // Refresh data
        return response.data;
      }
    } catch (error) {
      console.error("Failed to insert category:", error);
      return { error: "Insert failed" };
    }
  };

  const getInsurance = async () => {
    try {
      const res = await axios.get(
        "http://localhost/itam_api/insurance.php?action=getAll"
      );
      return res.data;
    } catch (err) {
      console.error("Failed to fetch insurancee", err);
      return [];
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
      const mappedtypes = await getResource("mappedtype");
      const insurances = await getInsurance();
      setInsurance(insurances);

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
      setMappedType(mappedtypes);
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

    return unit.filter(
      (un) => un.company_id === companyID && un.department_id === departmentID
    );
  }, [companyID, departmentID]);

  const filteredUsers: User[] | [] = useMemo(() => {
    let newUsers = user;

    if (companyID) {
      newUsers = newUsers.filter(
        (asset) => Number(asset.company_id) === companyID
      );
    }

    if (departmentID) {
      newUsers = newUsers.filter(
        (asset) => Number(asset.department_id) === departmentID
      );
    }

    if (unitID) {
      newUsers = newUsers.filter((asset) => Number(asset.unit_id) === unitID);
    }

    return newUsers;
  }, [companyID, departmentID, unitID, user]);

  const insertSubCategory = async (data: Subcategory) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      const response = await axios.post(
        "http://localhost/itam_api/asset.php?resource=subcategory",
        formData
      );
      if (response.data) {
        setReload((count) => count + 1); // increment reload count properly
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const insertMappedType = async (data: MappedType) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      const response = await axios.post(
        "http://localhost/itam_api/asset.php?resource=mappedtype",
        formData
      );
      if (response.data) {
        setReload((count) => count + 1);
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    unitID,
    mappedtype,
    insertSubCategory,
    insertMappedType,
    insurancee,
    insuranceID,
    setInsuranceID,
    insertCategory,
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
