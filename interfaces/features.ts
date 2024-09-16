export interface QueryString{
    readonly sort?: string,// for sort
    readonly fields?: string, // for limit fields
    readonly page?: number, // for pagination
    readonly limit?: number, // for pagination
    readonly search?: string, // for search
    [key: string]: any; // for filter
}

export interface SearchQuery{
    $or?: Array<{[key:string] :RegExp}>;
    [key:string]: any;
}

export interface PaginationQuery{
    totalPages?: number;
    currentPage?: number;
    limit?: number;
    prev?: number;
    next?: number;
}
