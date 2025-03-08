import multer, { DiskStorageOptions, Multer, MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path'

// Extend the Request type to include the `generatedFileName` property
declare global {
    namespace Express {
        interface Request {
            imagePath?: string;
        }
    }
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const absolutePath = path.resolve(__dirname, '..', 'blob-images');
        cb(null, absolutePath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = 'image-' + Date.now() + ".png";
        req.params.imagePath = uniqueSuffix; // Attach the unique filename to the request object
        cb(null, uniqueSuffix);
    },
});

// Create the multer upload instance
const upload: Multer = multer({ storage });

// Middleware function
export function createImage(req: Request, res: Response, next: NextFunction): void {
    const uploadSingle = upload.single('image');

    uploadSingle(req, res, (err: any) => {
        if (err instanceof MulterError) {
            return res.status(500).json({ error: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ error: `Unknown error: ${err.message}` });
        }
        next();
    });
}
