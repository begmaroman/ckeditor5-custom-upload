export default class Adapter {
    constructor(loader, upload, abort) {
        this.loader = loader;
        this.uploadResource = upload;
        this.abortUploading = abort || (() => {});
    }

    upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            this.uploadResource(file, (url) => {
                if (!url || url.length === 0) {
                    reject("Failed to upload resource")
                }

                resolve({default: url})
            })
        }))
    }

    abort () {
        this.abortUploading()
    }
}
