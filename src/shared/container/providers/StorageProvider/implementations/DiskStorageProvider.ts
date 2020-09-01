import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';
import upload from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  // método para fazer upload de um arquivo
  public async saveFile(file: string): Promise<string> {
    // rename pega um arquivo e move para outro lugar
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath); // stat procura o arquivo
    } catch {
      return;
    }

    await fs.promises.unlink(filePath); // unlink é a forma de DELETAR o arquivo
  }
}
export default DiskStorageProvider;
