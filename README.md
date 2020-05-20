## Custom Image Upload Plugin for Ckeditor5

This is an adapter, that allows you to handle image uploading by yourselves.

### Build Integration

https://docs.ckeditor.com/ckeditor5/latest/builds/guides/development/custom-builds.html

`npm install begmaroman/ckeditor5-custom-upload`

Add this plugin and remove the ckfinder and easyimage plugins

```javascript
// build-config.js

module.exports = {
  // ...

  plugins: [
    "@ckeditor/ckeditor5-essentials/src/essentials",
    // ...

    //'@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter',
    //'@ckeditor/ckeditor5-easy-image/src/easyimage',

    "ckeditor5-custom-upload"

    // ...
  ],

  // ...

  config: {
    toolbar: {
      items: [
        "headings",
        "bold",
        "italic",
        "imageUpload",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "undo",
        "redo"
      ]
    }
    // ...
  }
};
```

### Configuration

```javascript
ClassicEditor.create(document.querySelector("#editor"), {
  customUpload: {
    upload: (file, cb) => {
      // Some logic with file uploading here.
      // const fileURL = <uploaded file url>
      return fileURL;
    }
  }
});
```
