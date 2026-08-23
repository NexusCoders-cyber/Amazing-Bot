import { Storage } from 'megajs';

let storagePromise = null;

function getStorage() {
    if (storagePromise) return storagePromise;

    const email = process.env.MEGA_EMAIL;
    const password = process.env.MEGA_PASSWORD;

    if (!email || !password) {
        return Promise.reject(new Error('MEGA_EMAIL and MEGA_PASSWORD must be set in .env to use Mega session backup.'));
    }

    storagePromise = new Promise((resolve, reject) => {
        const storage = new Storage({ email, password }, (err) => {
            if (err) {
                storagePromise = null;
                return reject(err);
            }
            resolve(storage);
        });
    });

    return storagePromise;
}

export async function upload(buffer, fileName) {
    const storage = await getStorage();

    return new Promise((resolve, reject) => {
        const uploadStream = storage.upload({ name: fileName, size: buffer.length }, buffer);

        uploadStream.on('error', (err) => reject(err));

        uploadStream.on('complete', (file) => {
            file.link((err, url) => {
                if (err) return reject(err);
                resolve(url);
            });
        });
    });
}

export default { upload };
