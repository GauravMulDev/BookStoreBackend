import * as archiver from 'archiver';
import * as fs from 'fs';

export async function zipDirectory(source, out): Promise<void> {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive.directory(source, false).on('error', reject).pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
}
