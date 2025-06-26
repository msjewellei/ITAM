import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
interface Repair {
  repair_request_id: number;
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: number;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  issue: string;
  remarks: string;
  date_reported: Date;
  repair_start_date: Date;
  repair_completion_date: Date;
  repair_cost: number;
  status_id: string;
  status_name: string;
  urgency_id: string;
  urgency_level: string;
  department_name: string;
  company_name: string;
  sub_category_name: string;
  category_name: string;
}
interface RepairContextType {
  repair: Repair[];
  insertRepair: (repair: Repair) => void;
  setRepairID: Dispatch<SetStateAction<number | null>>;
  repairID: number | null;
  updateRepair: (
    repair_request_id: number,
    user_id: number,
    updatedData: Partial<Repair>
  ) => Promise<any>;
  completedRepairs: Repair[];
}

const RepairContext = createContext<RepairContextType | undefined>(undefined);
export const RepairProvider = ({ children }: { children: ReactNode }) => {
  const [repair, setRepair] = useState<Repair[]>([]);
  const [repairID, setRepairID] = useState<number | null>(null);
  const [reload, setReload] = useState(0);
  const [completedRepairs, setCompletedRepairs] = useState<Repair[]>([]);

  let url =
    "http://localhost/itam_api/RepairRequest.php?resource=repair_request";
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
      // console.log(JSON.stringify(data));
      const response = await axios.post(url, formData);
      if (response.data) {
        setReload((count) => (count = +1));
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCompletedRepairs = async () => {
    try {
      const response = await axios.get(url);

      const rawData = response.data;

      if (Array.isArray(rawData)) {
        const completed = rawData.filter(
          (item: Repair) =>
            item.status_id === 5 &&
            item.repair_completion_date !== null &&
            String(item.repair_completion_date) !== "" &&
            String(item.repair_completion_date) !== "0000-00-00"
        );
        return completed;
      } else {
        console.warn("⚠️ response.data is not an array", rawData);
        return [];
      }
    } catch (error) {
      console.error("Error fetching completed repairs:", error);
      return [];
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
  }, [reload]);

  const updateRepair = async (
    repair_request_id: number,
    user_id: number,
    updatedData: Partial<Repair>
  ) => {
    try {
      const response = await axios.put(
        url,
        {
          repair_request_id,
          user_id,
          ...updatedData,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data) {
        // console.log("Repair updated successfully:", response.data);
        setReload((count) => (count = +1));
        return response.data;
      }
    } catch (error) {
      console.error("Error updating repair:", error);
    }
  };

  useEffect(() => {
    const fetchCompleted = async () => {
      const data = await getCompletedRepairs();
      setCompletedRepairs(data || []);
    };
    fetchCompleted();
  }, []);

  const value = {
    repair,
    insertRepair,
    setRepairID,
    repairID,
    updateRepair,
    completedRepairs,
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
