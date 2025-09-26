export type Category = {
    id: number;
    code: string;
    description?: string; 
    createdAt: Date;
    updatedAt: Date;
}

export type PaginationMeta = {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number; 
}

export type PaginationRequestParam = {
    page: {
        number: number;
        size: number;
    },
    filter : {
        [key:string] : string | boolean | number
    },
    sort: string
    latest?: boolean
}

export type getParams = {
  latest?: boolean;
  date_from?: string; // "YYYY-MM-DD"
  date_to?: string;   // "YYYY-MM-DD"
};