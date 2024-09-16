import multer from "multer";
import ApiErrors from "../utils/apiErrors";
import { Request } from "express";
import { ImageField } from "../interfaces/imageField";


const upload = (): multer.Multer => {
    const multerStorage: multer.StorageEngine = multer.memoryStorage();
    const filter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback):void => {
        if(file.mimetype.startsWith('image')){
            cb(null, true);
        }else{
            cb(new ApiErrors('File is not an image', 400));
        }
    }
    const upload = multer({storage: multerStorage, fileFilter: filter});
    return upload;
}

export const uploadSingleImage = (fileName: string) => upload().single(fileName);
export const uploadMultipleImage = (fields: ImageField[]) => upload().fields(fields);