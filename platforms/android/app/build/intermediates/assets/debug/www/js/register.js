//this function can assume as a class for register page
//this function triggered when the register page loaded
var registerFunction = {
  //this is a constructor
  init: function (obj) {
    $('#registerForm').submit(function (e) {
      if ($('#register_password').val() === $('#confrim_password').val()) {
        var model = {
          email: $('#register_email').val(),
          password: $('#register_password').val()
        }
        db.createUser(model, function (condition) {
          if (condition) {
            DBEntity.selectUser(model, function (m) {
              if (m === null) {
                alert('Something went wrong cannot auto login')
              } else {
                sessionStorage.setItem('user', JSON.stringify(m))
                route.home({}, homeFunction.init)
              }
            })
          } else {
            alert('User already exist in the database')
          }
        })
      } else {
        alert('Password not match')
      }
      e.preventDefault()
    })
  }
}
