export default class Adapter {
    constructor(loader, getCredentials, upload, abort) {
        this.loader = loader;
        this.uploadResource = upload;
        this.abortUploading = abort || (() => {});
    }

    upload() {
        this.loader.file.then(file => this.uploadResource(file));
    }

    abort () {
        this.abortUploading()
    }
}
