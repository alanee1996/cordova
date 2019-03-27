//this is function can assume as login class
//this method will trigger when login page is loaded
var loginFunction = {
  //this is the init function or can assume as constructor
  //this triggered by the routing callback function
  init: function (obj) {
    //remove the home page cache by the mobile ui to avoid back page
    if (document.getElementById('home.html')) {
      document.getElementById('home.html').remove()
    }
    $('#loginForm').submit(function (e) {
      var model = {
        email: $('#login_email').val(),
        password: $('#login_password').val()
      }
      //find user from db
      db.selectUser(model, function(m) {
        if (m === null) {
          alert('Bad credential')
        }else {
          sessionStorage.setItem('user', JSON.stringify(m)) //set the session
          window.location.reload()
        }
      })
      e.preventDefault()
    })
  },
  // get the current login user information
  getCurrenyUser: function () {
    if (loginFunction.isLogin()) {
      return JSON.parse(sessionStorage.getItem('user'))
    }else {
      route.login({}, loginFunction.init)
    }
  },
  //check whether user login or not
  isLogin: function () {
    if (sessionStorage.getItem('user')) {
      return true
    }
    return false
  },
  logout: function () {
    sessionStorage.clear()
    route.login({}, loginFunction.init)
  }
}
