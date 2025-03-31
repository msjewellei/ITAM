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

interface Borrow {
  borrow_transaction_id: number;
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: number;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  date_borrowed: Date;
  due_date: Date;
  duration: number;
  asset_condition_id: string;
  remarks: string;
  category_name: string;
  sub_category_name: string;
  asset_condition_name: string;
  department_name: string;
  company_name: string;
  return_date: Date;
  type_name: string;
}
interface BorrowContextType {
  borrow: Borrow[];
  insertTransaction: (borrow: Borrow) => void;
  setBorrowID: Dispatch<SetStateAction<number | null>>;
  borrowID: number | null;
  dateBorrowed: Date | null;
  setDateBorrowed: Dispatch<SetStateAction<Date | null>>;
  updateBorrow: (
    borrow_transaction_id: number,
    date_borrowed: Date,
    updatedData: Partial<Borrow>
  ) => Promise<any>;
}
const BorrowContext = createContext<BorrowContextType | undefined>(undefined);
export const BorrowProvider = ({ children }: { children: ReactNode }) => {
  const [borrow, setBorrow] = useState<Borrow[]>([]);
  const [borrowID, setBorrowID] = useState<number | null>(null);
  const [dateBorrowed, setDateBorrowed] = useState<Date | null>(null);
  const [reload ,setReload] = useState(0);

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
        setReload(count => count=+1)
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
  }, [reload]);

  const updateBorrow = async (
    borrow_transaction_id: number,
    date_borrowed: Date,
    updatedData: Partial<Borrow>
  ) => {
    try {
      const response = await axios.put(
        url,
        {
          borrow_transaction_id,
          date_borrowed,
          ...updatedData,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data) {
        console.log("Borrow Transaction updated successfully:", response.data);
        setReload(count => count=+1)
        return response.data;
      }
    } catch (error) {
      console.error("Error updating borrow transaction:", error);
    }
  };
  const value = {
    borrow,
    insertTransaction,
    setBorrowID,
    borrowID,
    dateBorrowed,
    setDateBorrowed,
    updateBorrow,
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
