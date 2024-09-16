import {Document, Schema} from 'mongoose';
import Category from './category';
interface Subcategory extends Document{
    name: string,
    image?: string,
    category:Category,
}
export default Subcategory;