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

interface Category {
  category_id: number;
  category_name: String;
}

interface Subcategory {
  sub_category_id: number;
  category_id: number;
  sub_category_name: String;
}

interface Type {
  type_id: number;
  type_name: String;
}

interface Condition {
  asset_condition_id: number;
  asset_condition_name: String;
}

interface Status {
  status_id: number;
  status_name: String;
}

interface RepairUrgency {
  urgency_id: number;
  urgency_level: String;
}

interface MiscContextType {
  category: Category[];
  subcategory: Subcategory[];
  type: Type[];
  condition: Condition[];
  status: Status[];
  repairUrgency: RepairUrgency[];
  setCategoryID: Dispatch<SetStateAction<number | null>>;
  setSubCategoryID: Dispatch<SetStateAction<number | null>>;
  subCategoryID: number | null;
  filteredSubcategories: Subcategory[] | [];
}

const MiscContext = createContext<MiscContextType | undefined>(undefined);
export const MiscProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<Category[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory[]>([]);
  const [type, setType] = useState<Type[]>([]);
  const [condition, setCondition] = useState<Condition[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  const [repairUrgency, setRepairUrgency] = useState<RepairUrgency[]>([]);
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [subCategoryID, setSubCategoryID] = useState<number | null>(null);

  let url = "localhost/asset.php?resource=";
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
    };
    setup();
  }, []);

  const filteredSubcategories: Subcategory[] | [] = useMemo(() => {
    if (!categoryID) return [];

    return subcategory.filter((sub) => sub.category_id === categoryID);
  }, [subCategoryID]);

  const value = {
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
