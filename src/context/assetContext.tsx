import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

interface Asset {
  asset_name: string;
  category_id: string;
  sub_category_id: string | null;
  type_id: string | null;
  location: string | null;
  availability_status_id: string;
  serial_number: string;
  specifications: string;
  asset_amount: number;
  warranty_duration: string;
  warranty_due_date: Date;
  purchase_date: Date;
  notes: string;
}
interface AssetContextType {
  assets: Asset[];
  insertAsset: (asset: Asset) => void;
  categoryID: number | null;
  externalAssets: Asset[];
  filteredAssets: Asset[];
  setCategoryID: Dispatch<SetStateAction<number | null>>; 
  setSubCategoryID: Dispatch<SetStateAction<number | null>>; 
  setTypeID: Dispatch<SetStateAction<number | null>>; 
  subCategoryID: number | null;
  typeID: number | null;
  assetID: number | null;
  setAssetID: Dispatch<SetStateAction<number | null>>; 
}
const AssetContext = createContext<AssetContextType | undefined>(undefined);
export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [typeID, setTypeID] = useState<number | null>(null);
  const [subCategoryID, setSubCategoryID] = useState<number | null>(null);
  const [externalAssets, setExternalAssets] = useState<Asset[]>([]);
  const [assetID, setAssetID] = useState<number | null>(null);

  let url = "http://localhost/itam_api/asset.php?resource=asset";
  const getAssets = async () => {
    try {
      const response = await axios.get(url);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const insertAsset = async (data: Asset) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      const response = await axios.post(url, formData);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      const assetData = await getAssets();
      if (assetData) {
        setAssets(assetData);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    const external = assets.filter((asset) => Number(asset.category_id) === 1);
    setExternalAssets(external);
  }, [assets]);
  const filteredAssets: Asset[] | [] = useMemo(() => {
    let newAssets = assets;
  
    if (categoryID) {
      newAssets = newAssets.filter((asset) => Number(asset.category_id) === categoryID);
    }
  
    if (subCategoryID) {
      newAssets = newAssets.filter((asset) => Number(asset.sub_category_id) === subCategoryID);
    }
  
    if (typeID) {
      newAssets = newAssets.filter((asset) => Number(asset.type_id) === typeID);
    }
  
    return newAssets;
  }, [categoryID, subCategoryID, typeID, assets]);
  
  const value = {
    assets,
    insertAsset,
    categoryID,
    subCategoryID,
    typeID,
    setCategoryID,
    setSubCategoryID,
    setTypeID,
    externalAssets,
    filteredAssets,
    assetID,
    setAssetID
  };
  return (
    <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
  );
};
export const useAsset = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error("useAsset must be used within an AssetProvider");
  }
  return context;
};
