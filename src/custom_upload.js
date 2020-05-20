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
        const customUpload = this.editor.config.get('customUpload');
        if (!customUpload || !customUpload.upload) {
            console.warn('customUpload.upload is not configured')
            return;
        }

        this.editor.plugins.get('FileRepository').createUploadAdapter = loader => new Adapter(loader, customUpload.upload, customUpload.abort);
    }
}