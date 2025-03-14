import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface Issuance {
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: string;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  issuance_date: Date;
  status_id: string;
}
interface IssuanceContextType {
  issuance: Issuance[];
  insertIssuance: (issuance: Issuance) => void;
}
const IssuanceContext = createContext<IssuanceContextType | undefined>(undefined);
export const IssuanceProvider = ({ children }: { children: ReactNode }) => {
  const [issuance, setIssuance] = useState<Issuance[]>([]);

  let url = "http://localhost/itam_api/AssetIssuance.php?resource=asset_issuance";
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
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchIssuance = async () => {
      const issuanceData = await getIssuance();
      if (issuanceData) {
        setIssuance(issuanceData);
      }
    };
    fetchIssuance();
  }, []);

  const value = {
    issuance,
    insertIssuance,
  };
  return (
    <IssuanceContext.Provider value={value}>{children}</IssuanceContext.Provider>
  );
};
export const useIssuance = () => {
  const context = useContext(IssuanceContext);
  if (context === undefined) {
    throw new Error("useIssuance must be used within an IssuanceProvider");
  }
  return context;
};
