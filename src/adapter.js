export default class Adapter {
    constructor(loader, url, mapUrl) {
        this.loader = loader;
        this.url = url;
        this.mapUrl = mapUrl || (({ location }) => location);
    }

    upload() {
        this.loader.file
            .then(this.getCredentials.bind(this))
            .then(this.uploadImage.bind(this));
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    getCredentials(file) {
        return new Promise((resolve, reject) => {
            const filename = file.name;
            if (!filename) {
                return reject('No filename found');
            }

            let xhr = new XMLHttpRequest();

            xhr.withCredentials = true;
            xhr.open('GET', this.url + '?filename=' + filename, true);
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.addEventListener('error', err => reject('crederr'));
            xhr.addEventListener('abort', err => reject('credabort'));
            xhr.addEventListener('load', function () {
                const res = xhr.response;
                if (!res) {
                    return reject('No response from s3 creds url');
                }

                resolve(res, file);
            });

            xhr.send();
        })
    }

    uploadImage(s3creds, file) {
        return new Promise((resolve, reject) => {
            let data = new FormData();
            for (let param in s3creds.params) {
                if (!s3creds.params.hasOwnProperty(param)) continue;

                data.append(param, s3creds.params[param]);
            }

            data.append('Content-Type', file.type)

            data.append('file', file);

            let xhr = this.xhr = new XMLHttpRequest();

            xhr.withCredentials = false;
            xhr.responseType = 'document';

            xhr.addEventListener('error', err => reject('s3err'));
            xhr.addEventListener('abort', err => reject('s3abort'));
            xhr.addEventListener('load', () => {
                const res = xhr.response;

                if (!res) return reject('No Response');

                if (res.querySelector('Error')) {
                    return reject(res.querySelector('Code').textContent + ': ' + res.querySelector('Message').textContent);
                }

                const info = {
                    location: res.querySelector('Location').textContent,
                    bucket: res.querySelector('Bucket').textContent,
                    key: res.querySelector('Key').textContent,
                    etag: res.querySelector('ETag').textContent
                };

                if (!info.location) {
                    return reject('NoLocation: No location in s3 POST response');
                }

                resolve({default: this.mapUrl(info)});
            });

            if (xhr.upload) {
                xhr.upload.addEventListener('progress', e => {
                    if (!e.lengthComputable) {
                        return;
                    }

                    this.loader.uploadTotal = e.total;
                    this.loader.uploaded = e.loaded;
                });
            }

            xhr.open('POST', s3creds.endpoint_url, true);
            xhr.send(data);

        });
    }
}
