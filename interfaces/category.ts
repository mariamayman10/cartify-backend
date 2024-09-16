import {Document} from 'mongoose';
interface Category extends Document{
    name: string,
    image?: string,
}
export default Category;