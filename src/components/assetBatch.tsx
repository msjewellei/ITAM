import { Toaster } from "./ui/sonner";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const downloadTemplate = () => {
  const data = [
    {
      "Asset Name": "",
      Category: "",
      "Purchase Date": "",
      Amount: "",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "try.xlsx");
};

export default function AssetBatch() {
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
              </button>
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

          {/* Placeholder for file input */}
          <div className="mt-6">
            <input type="file" accept=".xlsx" className="text-sm" />
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}
