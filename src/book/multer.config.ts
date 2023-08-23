import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .join(Math.random().toString(36) + '00000000000000000')
        .slice(2, 10);
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
