import pkg from 'express';
import multer from 'multer';
import b2 from '../config/b2Client.ts';
import fs from 'fs';

const router = pkg.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/api/upload', upload.single('image'), async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  try {
    await b2.authorize();

    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const fileData = fs.readFileSync(file.path);
    const fileName = `${Date.now()}_${file.originalname}`;

    const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID!,
    });

    await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      data: fileData,
      mime: file.mimetype,
    });

    fs.unlinkSync(file.path); // Clean up local file

    const fileUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME!}/${fileName}`;
    res.json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  } 
});

export default router;