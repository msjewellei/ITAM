export type Department = {
    department_id: number;
    department_name: string;
  };
  
  export type Unit = {
    unit_id: number;
    unit_name: string;
  };
  
  export type Company = {
    company_id: number;
    company_name: string;
    departments?: Department[];
    units?: Unit[];
  };
  
  export const companyData: Company[] = [
    {
      company_id: 1,
      company_name: "United Neon Advertising, Inc.",
      departments: [
        { department_id: 101, department_name: "Human Resources" },
        { department_id: 102, department_name: "Finance" },
        { department_id: 103, department_name: "ISTI" },
      ],
      units: [
        { unit_id: 201, unit_name: "Unit A" },
        { unit_id: 202, unit_name: "Unit B" },
      ],
    },
    {
      company_id: 2,
      company_name: "Media Display Solutions",
      departments: [], // No departments for this company
      units: [
        { unit_id: 301, unit_name: "Unit X" },
        { unit_id: 302, unit_name: "Unit Y" },
      ],
    },
    {
      company_id: 3,
      company_name: "InnovationOne Inc.",
      departments: [
        { department_id: 201, department_name: "Product Development" },
      ],
      units: [
        { unit_id: 401, unit_name: "Unit Z" },
      ],
    },
  ];

  export type Sample = {
    borrow_transaction_id: string;
    company_id: number;
    company_name: string;
    department_id?: number;
    department_name?: string;
    unit_id?: number;
    unit_name?: string;
    user_id: number;
    employee_name: string;
    asset_id: number;
    asset_name: string;
    date_borrowed: string;
    due_date: string;
    return_date: string;
    duration: string;
    asset_condition_id: string;
    asset_condition_name: string;
    remarks: string;
  };