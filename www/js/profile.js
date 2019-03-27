// this function can assume as a class for the profile page
// this function triggered when the profile page is loaded
var profileFunction = {
  init: function (obj) {
    var user = loginFunction.getCurrenyUser()
    // data binding
    if (user) {
      if (user.path) {
        $('#p_profile_image').attr('src', user.path)
        $('#img_path_profile').text(user.path)
      }
      $('#p_email').val(user.email)
      $('#p_profile_image').click(function () {
        openPopover('popoverImg')
      })
      $('#changeImage').click(function () {
        camera.openCamera(function (imagePath) {
          camera.savePhoto(imagePath, function (img) {
            $('#img_path_profile').text(img.nativeURL)
            $('#p_profile_image').attr('src', img.nativeURL)
          })
        })
      })
      $('#profileForm').submit(profileFunction.formSubmit)
    } else {
      route.login({}, loginFunction.init)
    }
  },
  // update user detail
  formSubmit: function (e) {
    var model = {email: $('#p_email').val(),password: $('#p_password').val(),path: $('#img_path_profile').text()}
    DBEntity.updateUser(model, function () {
      alert('User profile updated')
      if (document.getElementById('home.html')) {
        document.getElementById('home.html').remove()
      }
      route.home({}, homeFunction.init)
    })
    e.preventDefault()
  }
}
