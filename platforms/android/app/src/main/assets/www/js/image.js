//this function is for browsing the any image to a new page
var imageFunction = {
  init: function (obj) {
    console.log(obj)
    $('#img-container').attr('src',obj.image)
  }
}
//view image in new page
function browseImage (path) {
  route.viewImage({image:path,title:"Image Preview"},imageFunction.init)
}
