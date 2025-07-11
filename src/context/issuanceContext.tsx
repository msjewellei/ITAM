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
import { useMisc } from "./miscellaneousContext";
import { useAsset } from "./assetContext";

interface Issuance {
  issuance_id: number;
  status_name: string;
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: number;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: number;
  issuance_date: Date;
  status_id: string;
  company_name: string;
  department_name: string;
  category_name: string;
  sub_category_name: string;
  pullout_date: Date;
  type_name: string;
}
interface IssuanceContextType {
  issuance: Issuance[];
  insertIssuance: (issuance: Issuance) => void;
  filteredIssuance: Issuance[] | [];
  updateIssuance: (
    issuance_id: number,
    user_id: number,
    asset_id: number,
    updatedData: Partial<Issuance>
  ) => Promise<any>;
  setIssuanceID: Dispatch<SetStateAction<number | null>>;
  issuanceID: number | null;
}
const IssuanceContext = createContext<IssuanceContextType | undefined>(
  undefined
);
export const IssuanceProvider = ({ children }: { children: ReactNode }) => {
  const { userID } = useMisc();
  const [issuance, setIssuance] = useState<Issuance[]>([]);
  const [issuanceID, setIssuanceID] = useState<number | null>(null);
  const [reload ,setReload] = useState(0);

  let url =
    "http://localhost/itam_api/AssetIssuance.php?resource=asset_issuance";
  const getIssuance = async () => {
    try {
      const response = await axios.get(url);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const insertIssuance = async (data: Issuance) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      console.log(JSON.stringify(data));
      const response = await axios.post(url, formData);
      if (response.data) {
        setReload((count) => count + 1);
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { assets } = useAsset();
  useEffect(() => {
    const fetchIssuance = async () => {
      const issuanceData = await getIssuance();
      if (issuanceData) {
        setIssuance(issuanceData);
      }
    };
    fetchIssuance();
  }, [reload]);

  const filteredIssuance: Issuance[] = useMemo(() => {
    if (!userID || !assets.length) return [];
  
    const excludedStatusIds = [4, 7, 9];
  
    return issuance.filter((i) => {
      const asset = assets.find((a) => a.asset_id === i.asset_id);
      return (
        String(i.user_id) === String(userID) &&
        asset &&
        !excludedStatusIds.includes(Number(asset.status_id))
      );
    });
  }, [userID, issuance, assets]);
  

  const updateIssuance = async (
    issuance_id: number,
    user_id: number,
    asset_id: number,
    updatedData: Partial<Issuance>
  ) => {
    try {
      const response = await axios.put(
        url,
        {
          issuance_id,
          user_id,
          asset_id,
          ...updatedData,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data) {
        console.log("Issuance updated successfully:", response.data);
        setReload((count) => count + 1);

        return response.data;
      }
    } catch (error) {
      console.error("Error updating issuance:", error);
    }
  };

  const value = {
    issuance,
    insertIssuance,
    filteredIssuance,
    updateIssuance,
    setIssuanceID,
    issuanceID,
  };
  return (
    <IssuanceContext.Provider value={value}>
      {children}
    </IssuanceContext.Provider>
  );
};
export const useIssuance = () => {
  const context = useContext(IssuanceContext);
  if (context === undefined) {
    throw new Error("useIssuance must be used within an IssuanceProvider");
  }
  return context;
};
