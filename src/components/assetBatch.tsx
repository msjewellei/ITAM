import React, { useRef, useState } from "react";
import { Toaster } from "./ui/sonner";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useAsset } from "@/context/assetContext";
import { useMisc } from "@/context/miscellaneousContext";

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
  const { category, subcategory, type, insurance } = useMisc();

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
            const year = jsDate.y;
            const month = String(jsDate.m).padStart(2, "0");
            const day = String(jsDate.d).padStart(2, "0");
            return `${year}-${month}-${day}`;
          }
        } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
          const d = new Date(value);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return "";
      };

      const dateFields = [
        "purchase_date",
        "warranty_due_date",
        "insurance_start_date",
        "insurance_end_date",
      ];

      const formattedData = rawData.map((row: any) => {
        const newRow = { ...row };

        dateFields.forEach((field) => {
          if (newRow[field]) {
            newRow[field] = formatExcelDate(newRow[field]);
          }
        });

        const matchedCategory = category.find(
          (c) =>
            c.category_name.toLowerCase() ===
            String(newRow.category).toLowerCase()
        );
        if (matchedCategory) {
          newRow.category = matchedCategory.category_id;
        }

        const matchedSubcategory = subcategory.find(
          (s) =>
            s.sub_category_name.toLowerCase() ===
            String(newRow.subcategory).toLowerCase()
        );
        if (matchedSubcategory) {
          newRow.subcategory = matchedSubcategory.sub_category_id;
        }

        const matchedType = type.find(
          (t) => t.type_name.toLowerCase() === String(newRow.type).toLowerCase()
        );
        if (matchedType) {
          newRow.type = matchedType.type_id;
        }

        const matchedInsurance = insurance.find(
          (i) =>
            i.insurance_name.toLowerCase() ===
            String(newRow.insurance_name).toLowerCase()
        );
        if (matchedInsurance) {
          newRow.insurance_id = matchedInsurance.insurance_id;
          delete newRow.insurance_name; // optional: clean up if needed
        }

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
  const toISODate = (value: any): string => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return ""; // Invalid date
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const handleSubmit = async () => {
    try {
      const dateFields = [
        "purchase_date",
        "warranty_due_date",
        "insurance_start_date",
        "insurance_end_date",
      ];

      const cleanedAssets = data.map((asset) => {
        const cleaned = { ...asset };
        dateFields.forEach((field) => {
          if (cleaned[field]) {
            cleaned[field] = toISODate(cleaned[field]);
          }
        });
        return cleaned;
      });

      console.log("Cleaned Assets:", cleanedAssets);
      const result = await insertMultipleAssets(cleanedAssets);

      if (!Array.isArray(result)) {
        console.error("Expected result to be an array but got:", result);
        return;
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
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
                        {Object.entries(row).map(([key, value], cellIndex) => {
                          const isDropdown =
                            key === "category" ||
                            key === "subcategory" ||
                            key === "type" ||
                            key === "insurance_id";

                          const getOptions = () => {
                            if (key === "category") return category;
                            if (key === "subcategory") return subcategory;
                            if (key === "type") return type;
                            if (key === "insurance_id") return insurance;
                            return [];
                          };

                          const getLabel = (id: any, key: string) => {
                            if (!id) return "";
                            if (key === "category") {
                              const match = category.find(
                                (c) => c.category_id === id
                              );
                              return match?.category_name ?? "";
                            }
                            if (key === "subcategory") {
                              const match = subcategory.find(
                                (s) => s.sub_category_id === id
                              );
                              return match?.sub_category_name ?? "";
                            }
                            if (key === "type") {
                              const match = type.find((t) => t.type_id === id);
                              return match?.type_name ?? "";
                            }
                            if (key === "insurance_id") {
                              const match = insurance.find(
                                (i) => i.insurance_id === id
                              );
                              return match?.insurance_name ?? "";
                            }
                            return "";
                          };

                          const handleDropdownChange = (
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {                            const selectedId = parseInt(e.target.value);
                            const list = getOptions();

                            const selectedItem =
                              key === "category"
                                ? list.find((c) => c.category_id === selectedId)
                                : key === "subcategory"
                                ? list.find(
                                    (s) => s.sub_category_id === selectedId
                                  )
                                : key === "type"
                                ? list.find((t) => t.type_id === selectedId)
                                : key === "insurance_id"
                                ? list.find(
                                    (i) => i.insurance_id === selectedId
                                  )
                                : null;

                            const newData = [...data];
                            newData[rowIndex] = {
                              ...newData[rowIndex],
                              [key]: selectedId, // Store the ID
                            };
                            setData(newData);
                          };

                          return (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 w-300px overflow-hidden whitespace-nowrap text-ellipsis"
                            >
                              {isDropdown ? (
                                <select
                                  className="p-1 border rounded text-sm w-[150px]"
                                  value={value || ""}
                                  onChange={handleDropdownChange}
                                >
                                  <option value="">Select</option>
                                  {getOptions().map((item: any) => {
                                    const optionValue =
                                      key === "category"
                                        ? item.category_id
                                        : key === "subcategory"
                                        ? item.sub_category_id
                                        : key === "type"
                                        ? item.type_id
                                        : key === "insurance_id"
                                        ? item.insurance_id
                                        : "";

                                    const optionLabel =
                                      key === "category"
                                        ? item.category_name
                                        : key === "subcategory"
                                        ? item.sub_category_name
                                        : key === "type"
                                        ? item.type_name
                                        : key === "insurance_id"
                                        ? item.insurance_name
                                        : "";

                                    return (
                                      <option
                                        key={optionValue}
                                        value={optionValue}
                                      >
                                        {optionLabel}
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : (
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
                              )}
                            </td>
                          );
                        })}
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
