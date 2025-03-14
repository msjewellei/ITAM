import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface Repair {
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: string;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  issue: string;
  remarks: string;
  date_reported: Date;
  urgency_id: string;
  repair_start_date: Date;
  repair_completion_date: Date;
  status_id: string;
  repair_cost: number;
}
interface RepairContextType {
  repair: Repair[];
  insertRepair: (repair: Repair) => void;
}
const RepairContext = createContext<RepairContextType | undefined>(undefined);
export const RepairProvider = ({ children }: { children: ReactNode }) => {
  const [repair, setRepair] = useState<Repair[]>([]);

  let url = "http://localhost/itam_api/RepairRequest.php?resource=repair_request";
  const getRepair = async () => {
    try {
      const response = await axios.get(url);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const insertRepair = async (data: Repair) => {
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
    const fetchRepair = async () => {
      const repairData = await getRepair();
      if (repairData) {
        setRepair(repairData);
      }
    };
    fetchRepair();
  }, []);

  const value = {
    repair,
    insertRepair,
  };
  return (
    <RepairContext.Provider value={value}>{children}</RepairContext.Provider>
  );
};
export const useRepair = () => {
  const context = useContext(RepairContext);
  if (context === undefined) {
    throw new Error("useRepair must be used within an RepairProvider");
  }
  return context;
};
