import { initializeApp } from "firebase/app";
import {
  deleteObject,
  ref,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { getStorage } from "firebase/storage";
import dotenv from "dotenv";
import multer from "multer";
import { AppError } from "./error";

dotenv.config();

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

interface FileBuffer extends Express.Multer.File {
  buffer: Buffer;
}

const uploadFile = multerConfig.single("file");
const uploadFiles = multerConfig.array("files");

class Upload {
  private firebaseStorage: any;
  private filePath: string;
  private upload: { url: string };
  private next: any;

  constructor(filePath: string, next: any) {
    const firebaseConfig = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    };
    const firebaseApp = initializeApp(firebaseConfig);
    this.firebaseStorage = getStorage(firebaseApp);
    this.filePath = filePath;
    this.upload = { url: "" };
    this.next = next;
  }

  private bufferToBase64(buffer: Buffer): string {
    return Buffer.from(buffer).toString("base64");
  }

  private path(filePath: string): string {
    const isProduction = process.env.NODE_ENV === "production";
    if (!filePath) {
      this.next(new AppError("No file path provided!", 500));
    }
    if (filePath.startsWith("/")) {
      this.next(new AppError("Invalid file path!", 500));
    }
    if (isProduction) return `prod/${filePath}`;
    return `dev/${filePath}`;
  }

  async add(file: FileBuffer): Promise<any> {
    try {
      const reference = ref(this.firebaseStorage, this.path(this.filePath));
      const fileBase64 = this.bufferToBase64(file.buffer);

      await uploadString(reference, fileBase64, "base64");
      this.upload.url = await getDownloadURL(reference);

      return this.upload;
    } catch (err) {
      console.log("err", err);
      if (err) {
        return this.next(
          new AppError("Sorry, error occurred while uploading!", 500)
        );
      }
    }
  }

  async update(file: FileBuffer, savedFilePath: string): Promise<any> {
    try {
      let reference = ref(this.firebaseStorage, this.path(this.filePath));
      const fileBase64 = this.bufferToBase64(file.buffer);
      await uploadString(reference, fileBase64, "base64");
      const URL = await getDownloadURL(reference);

      // delete the saved file
      reference = ref(this.firebaseStorage, this.path(savedFilePath));
      if (URL) {
        await deleteObject(reference);
      }
      this.upload.url = URL;

      return this.upload;
    } catch (err) {
      console.log("err", err);
      if (err) {
        return this.next(
          new AppError("Sorry, error occurred while uploading!", 500)
        );
      }
    }
  }

  async delete(): Promise<void> {
    try {
      const reference = ref(this.firebaseStorage, this.path(this.filePath));
      await deleteObject(reference);
    } catch (err) {
      console.log("err", err);
      this.next(new AppError("Sorry, error occurred while deleting!", 500));
    }
  }
}

export { Upload, uploadFile, uploadFiles };
