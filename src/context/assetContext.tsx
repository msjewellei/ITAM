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

interface Assets {
    asset_id: number;
    asset_name: string;
    category_id: number;
    sub_category_id: number;
    type_id: number;
    asset_condition_id: number;
    location: string;
    status_id: number;
    serial_number: string;
    specifications: string;
    asset_amount: number;
    warranty_duration: number;
    warranty_due_date: string;
    purchase_date: string;
    aging: number;
    notes: string;
}

interface AssetContextType {
    asset: Assets[];
    setAssetID: Dispatch<SetStateAction<number | null>>;
//   setCategoryID: Dispatch<SetStateAction<number | null>>;
//   setSubCategoryID: Dispatch<SetStateAction<number | null>>;
//   subCategoryID: number | null;
//   filteredSubcategories: Subcategory[] | [];
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);
export const AssetProvider = ({ children }: { children: ReactNode }) => {
    const [asset, setAsset] = useState<Assets[]>([]);
    const [assetID, setAssetID] = useState<number | null>(null);

//   const [repairUrgency, setRepairUrgency] = useState<RepairUrgency[]>([]);
//   const [categoryID, setCategoryID] = useState<number | null>(null);
//   const [subCategoryID, setSubCategoryID] = useState<number | null>(null);

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
      const assets = await getResource("asset");
      setAsset(assets);
    //   const subcategories = await getResource("subcategory");
    //   const types = await getResource("type");
    //   const conditions = await getResource("condition");
    //   const statuses = await getResource("status");
    //   const repairUrgencies = await getResource("repairUrgency");
    //   setCategory(categories);
    //   setSubcategory(subcategories);
    //   setType(types);
    //   setCondition(conditions);
    //   setStatus(statuses);
    //   setRepairUrgency(repairUrgencies);
    };
    setup();
  }, []);

  const value = {
    asset,
    setAssetID,
    
    // subcategory,
    // type,
    // condition,
    // status,
    // repairUrgency,
    // setCategoryID,
    // setSubCategoryID,
    // subCategoryID,
    // filteredSubcategories,
  };
  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
export const useAsset = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error("useAsset must be used within an AssetProvider");
  }
  return context;
};
