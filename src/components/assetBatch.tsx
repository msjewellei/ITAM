import React, { useRef, useState } from "react";
import { Toaster } from "./ui/sonner";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useAsset } from "@/context/assetContext";

const downloadTemplate = () => {
  const link = document.createElement("a");
  link.href = "http://localhost/itam_api/template/newAsset.xlsx";
  link.setAttribute("download", "newAsset.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AssetBatch() {
  const [data, setData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { insertMultipleAssets } = useAsset();


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setData([]);
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      if (!evt.target) return;
      const arrayBuffer = evt.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
        defval: "",
      });

      if (rawData.length > 100) {
        toast.error(
          "Upload failed: File must contain no more than 100 data rows."
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        setData([]);
        return;
      }

      const formatExcelDate = (value: any): string => {
        if (typeof value === "number") {
          const jsDate = XLSX.SSF.parse_date_code(value);
          if (jsDate) {
            return `${String(jsDate.d).padStart(2, "0")}/${String(
              jsDate.m
            ).padStart(2, "0")}/${jsDate.y}`;
          }
        } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
          const d = new Date(value);
          return `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
          ).padStart(2, "0")}/${d.getFullYear()}`;
        }
        return value;
      };

      const dateFields = [
        "purchase_date",
        "warranty_due_date",
        "insurance_start_date",
        "insurance_end_date",
      ];

      const formattedData = rawData.map((row: any) => {
        const newRow = { ...row }; // Avoid direct mutation
        dateFields.forEach((field) => {
          if (newRow[field]) {
            newRow[field] = formatExcelDate(newRow[field]);
          }
        });
        return newRow;
      });

      setData(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setData([]);
  };

 const handleSubmit = async () => {
  try {
    
    const result = await insertMultipleAssets(data);
   
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    // Optionally show an error message
  }
};

  const formatHeader = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <>
      <div className="flex flex-col px-[2.5rem] pt-[calc(1.5rem+10px)] pl-[calc(7rem+10px)] w-full max-w-full">
        <div className="w-[calc(100vw-10rem)] rounded-xl bg-white min-h-[calc(100vh-13.10rem)] h-auto p-5 mb-5">
          <h1 className="text-xl font-semibold mb-6">Batch Upload</h1>

          <div className="border border-dashed rounded-md p-6 bg-gray-50 text-sm text-gray-700 space-y-2 w-full">
            <p>
              1. Download the{" "}
              <button
                onClick={downloadTemplate}
                className="text-blue-600 underline hover:text-blue-800"
              >
                template
              </button>{" "}
              (provided in .xlsx format, do not rename or alter column
              structure).
            </p>
            <p>
              2. Fill in all required fields by completing each row with correct
              data formats without removing or rearranging columns.
            </p>
            <p>3. Limit entries to 100 assets per file.</p>
            <p>
              4. Validate your data by checking for missing fields, incorrect
              formats, or duplicates before uploading.
            </p>
            <p>5. Upload the file below by selecting your completed file.</p>
          </div>

          <div className="mt-6 flex gap-4 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              className="text-sm"
              onChange={handleFileUpload}
            />
            {data.length > 0 && (
              <button
                onClick={handleClearFile}
                className="text-red-600 underline hover:text-red-800 text-sm"
              >
                Remove File
              </button>
            )}
          </div>

          {data.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm mb-2">Preview</h2>

              <div className="overflow-auto max-w-full rounded">
                <table className="min-w-full border-collapse table-auto">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((header, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-2 text-left max-w-[300px] text-sm font-semibold whitespace-nowrap"
                        >
                          {formatHeader(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.entries(row).map(([key, value], cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 w-300px overflow-hidden whitespace-nowrap text-ellipsis"
                          >
                            <input
                              type="text"
                              className="p-1 border rounded text-sm w-[150px]"
                              value={value}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[rowIndex] = {
                                  ...newData[rowIndex],
                                  [key]: e.target.value,
                                };
                                setData(newData);
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
