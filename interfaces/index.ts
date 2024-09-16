import FilterData from "./filterData"
import { User } from "./user";

declare module 'express'{
    interface Request{
        filterData?: FilterData;
        files?: any;
        user?: User;
    }
}