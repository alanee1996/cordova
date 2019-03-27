//this is the function list for camera event
var camera = {
  //reference https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html
  getOptions: function () {
    var options = {
      quality: 20,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true
    }
    return options
  },
  openCamera: function (imageTaken) {
    //imageTaken is the callback function to allow customization to other js file when calling this method
    navigator.camera.getPicture(imageTaken, camera.photoError, camera.options)
  },
  photoError: function (error) {
    console.log('CAMERA ERROR: ' + error)
  },
  //saving photo
  savePhoto: function (imagePath, callback) {
    //get the public directory
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
      var stamp = new Date().getTime()
      var filename = stamp + '.jpg'
      var directory = 'myStorage'
      //open the image file
      window.resolveLocalFileSystemURL(imagePath, function (imageEntry) {
        //move image file to target directory
        dirEntry.getDirectory(directory, { create: true, exclusive: false }, function (dir) {
            imageEntry.moveTo(dir, filename, callback, camera.fileSavingError)
        }, camera.fileSavingError)
      }, camera.fileSavingError)
    }, camera.fileSavingError)
  },
  fileSavingError: function (error) {
    console.log('RESOLVE PATH ERROR: ' + error)
  },
  //remove image from user mobile storage
  delete: function (imagePath,callback) { 
    console.log(imagePath)
    window.resolveLocalFileSystemURL(imagePath, function (imageEntry) { 
      imageEntry.remove(callback,camera.fileSavingError)
    })
  }
}
