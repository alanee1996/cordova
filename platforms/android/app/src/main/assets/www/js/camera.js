var camera = {
  getOptions: function () {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 20,
      destinationType: Camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true // Corrects Android orientation quirks
    }
    return options
  },
  openCamera: function (imageTaken) {
    navigator.camera.getPicture(imageTaken, camera.photoError, camera.options)
  },
  photoError: function (error) {
    console.log('CAMERA ERROR: ' + error)
  },
  savePhoto: function (imagePath, callback) {
    console.log(imagePath)
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, (dirEntry) => {
      var stamp = new Date().getTime()
      var filename = stamp + '.jpg'
      var directory = 'myStorage'
      window.resolveLocalFileSystemURL(imagePath, (imageEntry) => {
        dirEntry.getDirectory(directory, { create: true, exclusive: false }, function (dir) {
            imageEntry.moveTo(dir, filename, callback, camera.fileSavingError)
        }, camera.fileSavingError)
      }, camera.fileSavingError)
    }, camera.fileSavingError)
  },
  fileSavingError: function (error) {
    console.log('RESOLVE PATH ERROR: ' + error)
  }
}
