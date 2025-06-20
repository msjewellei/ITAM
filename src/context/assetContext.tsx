import axios from "axios";
import { count } from "console";
import { useLocation } from "react-router-dom";
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
import qs from "qs";
import { formatDate } from "date-fns";
interface Asset {
  asset_id: number;
  asset_name: string;
  category_id: string;
  sub_category_id: string | null;
  type_id: string | null;
  location: string | null;
  availability_status_id: string;
  serial_number: string;
  specifications: string;
  asset_amount: number;
  warranty_duration: number;
  warranty_due_date: Date;
  purchase_date: Date;
  notes: string;
  file: File[];
  brand: string;
  insurance_coverage: string;
  insurance_date_from: Date;
  insurance_date_to: Date;
  status_id: string;
  asset_condition_id: string;
}
interface AssetContextType {
  assets: Asset[];
  insertAsset: (asset: Asset) => void;
  categoryID: number | null;
  externalAssets: Asset[];
  internalAssets: Asset[];
  filteredAssets: Asset[];
  filteredInternalAssets: Asset[];
  setCategoryID: Dispatch<SetStateAction<number | null>>;
  setSubCategoryID: Dispatch<SetStateAction<number | null>>;
  setTypeID: Dispatch<SetStateAction<number | null>>;
  subCategoryID: number | null;
  typeID: number | null;
  assetID: number | null;
  setAssetID: Dispatch<SetStateAction<number | null>>;
  currentAsset: Asset | null;
  updateAsset: (asset_id: number, updatedData: Partial<Asset>) => Promise<any>;
  setInsurance: Dispatch<SetStateAction<any>>;
  insurance: any;
  setInsuranceDialogOpen: Dispatch<SetStateAction<boolean>>;
  isInsuranceDialogOpen: boolean;
  handleInsuranceSave: (insuranceData: any) => void;
  insertMultipleAssets: (assets: Asset[]) => Promise<any>;
}
const AssetContext = createContext<AssetContextType | undefined>(undefined);
export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [typeID, setTypeID] = useState<number | null>(null);
  const [subCategoryID, setSubCategoryID] = useState<number | null>(null);
  const [externalAssets, setExternalAssets] = useState<Asset[]>([]);
  const [internalAssets, setInternalAssets] = useState<Asset[]>([]);
  const [assetID, setAssetID] = useState<number | null>(null);
  const [reload, setReload] = useState(0);
  const location = useLocation();
  const [insurance, setInsurance] = useState(null);
  const [isInsuranceDialogOpen, setInsuranceDialogOpen] = useState(false);

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

  const insertMultipleAssets = async (
    assets: Asset[],
    onSuccess?: () => void
  ) => {
    try {
      const cleanedAssets = assets
        .filter((asset) => asset.serial_number?.trim()) // Remove assets without serial_number
        .map((asset) => {
          const {
            amount,
            insurance_start_date,
            insurance_end_date,
            category,
            subcategory,
            type,
            purchase_date,
            warranty_due_date,
            ...rest
          } = asset;

          const safeFormat = (date: any, fieldName?: string) => {
            if (date && isNaN(new Date(date).getTime())) {
              console.warn(`Invalid date value for ${fieldName}:`, date);
            }
            return date && !isNaN(new Date(date).getTime())
              ? formatDate(new Date(date), "yyyy-MM-dd")
              : null;
          };

          return {
            ...rest,
            category_id: category,
            sub_category_id: subcategory,
            type_id: type || null,
            asset_amount: amount,
            insurance_date_from: safeFormat(insurance_start_date),
            insurance_date_to: safeFormat(insurance_end_date),
            purchase_date: safeFormat(purchase_date, "purchase_date"),
            warranty_due_date: safeFormat(
              warranty_due_date,
              "warranty_due_date"
            ),
          };
        });

      if (cleanedAssets.length === 0) {
        throw new Error(
          "No valid assets to upload. Please check that all rows include a serial number."
        );
      }

      await axios.post(
        "http://localhost/itam_api/asset.php?resource=asset&action=batchInsert",
        qs.stringify({ data: JSON.stringify(cleanedAssets) }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response.data) {
        if (onSuccess) onSuccess();
        return response.data;
      }
    } catch (error) {
      console.error("API error:", error);
      return []; // Fail-safe return
      console.error("Error inserting multiple assets:", error);
    }
  };

  const insertAsset = async (data: Asset) => {
    try {
      const formData = new FormData();

      // Flatten category object
      const flatData = {
        ...data,
        category_id: data.category?.category_id || "",
        sub_category_id: data.category?.sub_category_id || "",
        type_id: data.category?.type_id || "",
      };

      // Delete nested category
      delete (flatData as any).category;

      Object.entries(flatData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof Date) {
            formData.append(key, value.toISOString().split("T")[0]); // format: YYYY-MM-DD
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Attach files
      data.file?.forEach((file) => {
        if (file && file.name) {
          formData.append("file[]", file);
        }
      });

      const response = await axios.post(
        "http://localhost/itam_api/asset.php?resource=asset",
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

  useEffect(() => {
    const fetchAssets = async () => {
      const assetData = await getAssets();
      if (assetData) {
        setAssets(assetData);
      }
    };
    fetchAssets();
  }, [reload]);

  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (location.state?.assetId) {
      const fetchAsset = async () => {
        const assetData = await getAssets();
        const singleAsset = assetData.find(
          (asset: { asset_id: any }) =>
            asset.asset_id === location.state.assetId
        );
        // console.log(singleAsset);
        if (singleAsset) {
          setAssetID(singleAsset.asset_id);
          setCurrentAsset(singleAsset);
        }
      };
      fetchAsset();
    }
  }, [location.state?.assetId]);

  useEffect(() => {
    const external = assets.filter((asset) => Number(asset.category_id) === 1);
    setExternalAssets(external);
  }, [assets]);

  const filteredAssets: Asset[] | [] = useMemo(() => {
    let newAssets = assets;

    if (categoryID) {
      newAssets = newAssets.filter(
        (asset) => Number(asset.category_id) === categoryID
      );
    }

    if (subCategoryID) {
      newAssets = newAssets.filter(
        (asset) => Number(asset.sub_category_id) === subCategoryID
      );
    }

    if (typeID) {
      newAssets = newAssets.filter((asset) => Number(asset.type_id) === typeID);
    }

    return newAssets;
  }, [categoryID, subCategoryID, typeID, assets]);

  useEffect(() => {
    const internal = assets.filter(
      (asset) =>
        Number(asset.category_id) === 2 && Number(asset.status_id) === 1
    );
    setInternalAssets(internal);
  }, [assets]);

  const filteredInternalAssets: Asset[] | [] = useMemo(() => {
    let intAssets = internalAssets;

    if (categoryID) {
      intAssets = intAssets.filter(
        (asset) => Number(asset.category_id) === categoryID
      );
    }

    if (subCategoryID) {
      intAssets = intAssets.filter(
        (asset) => Number(asset.sub_category_id) === subCategoryID
      );
    }

    if (typeID) {
      intAssets = intAssets.filter((asset) => Number(asset.type_id) === typeID);
    }

    return intAssets;
  }, [categoryID, subCategoryID, typeID, internalAssets]);

  const updateAsset = async (asset_id: number, updatedData: Partial<Asset>) => {
    try {
      const formData = new FormData();

      // Convert file array to FormData format
      if (updatedData.file && Array.isArray(updatedData.file)) {
        updatedData.file.forEach((file) => {
          if (file instanceof File) {
            formData.append("file[]", file);
          }
        });
      }

      // Remove `file` from updatedData to avoid duplication
      const { file, ...dataWithoutFile } = updatedData;

      // Append the rest of the data as JSON
      formData.append("data", JSON.stringify(dataWithoutFile));

      const response = await axios.post(
        `http://localhost/itam_api/asset.php?resource=asset&action=update&id=${asset_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setReload((count) => count + 1);
        return response.data;
      }
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  const handleInsuranceSave = (insuranceData: SetStateAction<null>) => {
    setInsurance(insuranceData);
    setInsuranceDialogOpen(false);
  };

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
    setAssetID,
    currentAsset,
    updateAsset,
    internalAssets,
    filteredInternalAssets,
    setInsurance,
    insurance,
    setInsuranceDialogOpen,
    isInsuranceDialogOpen,
    handleInsuranceSave,
    insertMultipleAssets,
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
