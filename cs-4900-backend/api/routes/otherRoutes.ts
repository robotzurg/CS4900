import pkg from 'express';
import multer from 'multer';
import sharp from 'sharp';
import b2 from '../config/b2Client.ts';
import fs from 'fs';

const router = pkg.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/api/upload', upload.single('image'), async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  try {
    await b2.authorize();

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the raw upload
    const fileBuffer = fs.readFileSync(file.path);

    const optimizedBuffer = await sharp(fileBuffer)
      .resize(512, 512, { fit: 'inside' })
      .jpeg({ progressive: false }) 
      .toBuffer();

    const fileName = `${Date.now()}_${file.originalname}`;
    const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID!,
    });

    await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      data: optimizedBuffer,
      mime: 'image/jpeg',
    });

    fs.unlinkSync(file.path);

    const fileUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME!}/${fileName}`;
    res.json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
