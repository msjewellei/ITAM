import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";

interface BorrowedByCompany {
  company_alias: string;
  borrowed_count: number;
}

interface IssuedByCompany {
  company_alias: string;
  issued_count: number;
}

interface OverdueAsset {
  asset_id: number;
  asset_name: string;
  user_id: number;
  full_name: string;
  due_date: string;
  days_overdue: number;
}

interface UrgentRepairRequest {
  repair_request_id: number;
  asset_id: string;
  asset_name: string;
  issue: string;
  reported_by: string;
  urgency_id: number;
  user_id: number;
  date_reported: string;
}

interface MonthlyRepair {
  month: string;
  repair_count: number;
}

interface AssetCondition {
  condition: string;
  count: number;
}

interface DashboardContextType {
  totalAssets: number;
  availableAssets: number;
  issuedAssets: number;
  borrowedAssets: number;
  underRepairAssets: number;
  borrowedByCompany: BorrowedByCompany[];
  issuedByCompany: IssuedByCompany[];
  overdueAssets: OverdueAsset[];
  urgentRepairs: UrgentRepairRequest[];
  monthlyRepairs: MonthlyRepair[];
  assetsByCondition: AssetCondition[];
  reloadDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [availableAssets, setAvailableAssets] = useState(0);
  const [issuedAssets, setIssuedAssets] = useState(0);
  const [borrowedAssets, setBorrowedAssets] = useState(0);
  const [underRepairAssets, setUnderRepairAssets] = useState(0);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [borrowedByCompany, setBorrowedByCompany] = useState<
    BorrowedByCompany[]
  >([]);
  const [issuedByCompany, setIssuedByCompany] = useState<IssuedByCompany[]>([]);
  const [overdueAssets, setOverdueAssets] = useState<OverdueAsset[]>([]);
  const [urgentRepairs, setUrgentRepairs] = useState<UrgentRepairRequest[]>([]);
  const [monthlyRepairs, setMonthlyRepairs] = useState<MonthlyRepair[]>([]);
  const [assetsByCondition, setAssetsByCondition] = useState<AssetCondition[]>(
    []
  );

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost/itam_api/dashboard.php?action=getAllDashboardStats"
      );
      const data = res.data;

      setTotalAssets(
        !isNaN(Number(data?.total_assets)) ? Number(data.total_assets) : 0
      );
      setAvailableAssets(
        !isNaN(Number(data?.available_assets))
          ? Number(data.available_assets)
          : 0
      );
      setIssuedAssets(
        !isNaN(Number(data?.issued_assets)) ? Number(data.issued_assets) : 0
      );
      setBorrowedAssets(
        !isNaN(Number(data?.borrowed_assets)) ? Number(data.borrowed_assets) : 0
      );
      setUnderRepairAssets(
        !isNaN(Number(data?.under_repair_assets))
          ? Number(data.under_repair_assets)
          : 0
      );

      const borrowedRes = await axios.get(
        "http://localhost/itam_api/dashboard.php?action=getBorrowedAssetsByCompany"
      );

      setBorrowedByCompany(
        Array.isArray(borrowedRes.data)
          ? borrowedRes.data.map((item) => ({
              ...item,
              borrowed_count: Number(item.borrowed_count ?? item.count ?? 0),
            }))
          : []
      );

      const issuedRes = await axios.get(
        "http://localhost/itam_api/dashboard.php?action=getIssuedAssetsByCompany"
      );

      setIssuedByCompany(
        Array.isArray(issuedRes.data)
          ? issuedRes.data.map((item) => ({
              ...item,
              issued_count: Number(item.issued_count ?? item.count ?? 0),
            }))
          : []
      );
      const overdueRes = await axios.get(
        "http://localhost/itam_api/dashboard.php?action=getOverdueBorrowedAssets"
      );

      setOverdueAssets(Array.isArray(overdueRes.data) ? overdueRes.data : []);
      const urgentRepairsRes = await axios.get(
        "http://localhost/itam_api/dashboard.php?action=getUrgentRepairRequests"
      );
      setUrgentRepairs(
        Array.isArray(urgentRepairsRes.data) ? urgentRepairsRes.data : []
      );

      const monthlyRepairsRes = await axios.get(
        "http://localhost/itam_api/dashboard.php?action=getMonthlyRepairsThisYear"
      );
      setMonthlyRepairs(
        Array.isArray(monthlyRepairsRes.data) ? monthlyRepairsRes.data : []
      );
      const conditionRes = await axios.get(
        "http://localhost/itam_api/dashboard.php?action=getAssetsByCondition"
      );
      setAssetsByCondition(
        Array.isArray(conditionRes.data) ? conditionRes.data : []
      );
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };
  useEffect(() => {
    // console.log(issuedByCompany);
  }, [borrowedByCompany, issuedByCompany]);
  useEffect(() => {
    fetchDashboardStats();
  }, [reloadFlag]);

  const reloadDashboard = () => setReloadFlag((prev) => !prev);

  const value: DashboardContextType = {
    totalAssets,
    availableAssets,
    issuedAssets,
    borrowedAssets,
    underRepairAssets,
    borrowedByCompany,
    issuedByCompany,
    overdueAssets,
    urgentRepairs,
    monthlyRepairs,
    assetsByCondition,
    reloadDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
