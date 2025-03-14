import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface Borrow {
  borrow_transaction_id: string;
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: string;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  date_borrowed: Date;
  due_date: Date;
  duration: number;
  asset_condition_id: string;
  remarks: string;
}
interface BorrowContextType {
  borrow: Borrow[];
  insertTransaction: (borrow: Borrow) => void;
}
const BorrowContext = createContext<BorrowContextType | undefined>(undefined);
export const BorrowProvider = ({ children }: { children: ReactNode }) => {
  const [borrow, setBorrow] = useState<Borrow[]>([]);
  

  let url = "http://localhost/itam_api/BorrowedAssets.php?resource=borrowed_assets";
  const getTransactions = async () => {
    try {
      const response = await axios.get(url);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const insertTransaction = async (data: Borrow) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      console.log(JSON.stringify(data))
      const response = await axios.post(url, formData);  
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const borrowData = await getTransactions();
      if (borrowData) {
        setBorrow(borrowData);
      }
    };
    fetchTransactions();
  }, []);

  const value = {
    borrow,
    insertTransaction,
  };
  return (
    <BorrowContext.Provider value={value}>{children}</BorrowContext.Provider>
  );
};
export const useBorrow = () => {
  const context = useContext(BorrowContext);
  if (context === undefined) {
    throw new Error("useBorrow must be used within an BorrowProvider");
  }
  return context;
};
