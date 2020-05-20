import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

import Adapter from './adapter';

export default class CustomUpload extends Plugin {
    static get requires() {
        return [FileRepository];
    }

    static get pluginName() {
        return 'CustomUpload';
    }

    init() {
        const upload = this.editor.config.get('customUpload.upload');
        if (!upload || typeof upload !== "function") {
            console.warn('customUpload.upload is not configured')
            return;
        }

        const abort = this.editor.config.get('customUpload.abort');

        this.editor.plugins.get('FileRepository').createUploadAdapter = loader => new Adapter(loader, upload, abort);
    }
}