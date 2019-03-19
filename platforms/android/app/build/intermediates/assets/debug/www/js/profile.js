var profileFunction = {
  init: function (obj) {
    var user = loginFunction.getCurrenyUser()
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
        camera.openCamera((imagePath) => {
          camera.savePhoto(imagePath, (img) => {
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
  formSubmit: function (e) {
    var model = {email: $('#p_email').val(),password: $('#p_password').val(),path: $('#img_path_profile').text()}
    DBEntity.updateUser(model, () => {
      alert('user update')
    })
    e.preventDefault()
  }
}
