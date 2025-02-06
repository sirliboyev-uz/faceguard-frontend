// src/types.ts or src/types/index.ts

export interface Company {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
  }
  
  export interface Branch {
    id: string;
    name: string;
    description: string;
    location: string;
    longitude: string;
    latitude: string;
    companyId: string;
  }
  
  export interface Department {
    id: string;
    name: string;
    branchId: string;
  }
  