import { Schema , model} from 'mongoose';
import Subcategory from '../interfaces/subcategory';

const SubcategorySchema: Schema = new Schema<Subcategory>(
    {
        name: {type:String, required:true, trim:true},
        image: {type:String},
        category: {type: Schema.Types.ObjectId, required: true, ref: 'Category'}
    },{timestamps:true}
);

SubcategorySchema.pre<Subcategory>(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name' })
    next()
})

const SubcategoryModel = model<Subcategory>('Subcategory', SubcategorySchema);

export default SubcategoryModel;