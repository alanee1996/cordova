var loginFunction = {
  init: function (obj) {
    if (document.getElementById('home.html')) {
      document.getElementById('home.html').remove()
    }
    $('#loginForm').submit(function (e) {
      var model = {
        email: $('#login_email').val(),
        password: $('#login_password').val()
      }
      db.selectUser(model, (m) => {
        if (m === null) {
          alert('Bad credential')
        }else {
          sessionStorage.setItem('user', JSON.stringify(m))
          window.location.reload()
        }
      })
      e.preventDefault()
    })
  },
  getCurrenyUser: function () {
    if (loginFunction.isLogin()) {
      return JSON.parse(sessionStorage.getItem('user'))
    }else {
      route.login({}, loginFunction.init)
    }
  },
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
