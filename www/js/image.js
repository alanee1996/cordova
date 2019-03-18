var imageFunction = {
  init: function (obj) {
    console.log(obj)
    $('#img-container').attr('src',obj.image)
  }
}

function browseImage (path) {
  route.viewImage({image:path,title:"Image Preview"},imageFunction.init)
}
