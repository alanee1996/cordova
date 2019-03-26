//auto injet the header and drawer for the target page
function getDrawerAndNav(title) {
  if (title == null || title == undefined) {
    title = 'Mystorage'
  }
  var user = loginFunction.getCurrenyUser()
  $('.drawer').load('drawer.html', function () {
    if (user.path) {
      $('#d_profile_image').attr('src', user.path)
    }
    $('#email').text(user.email)
  })
  $('.nav').load('nav.html', function () {
    $('.page-title').append(title)
  })
}
//auto injet the header and with back page button
function getNavBack (title) {
  if (title == null || title == undefined) {
    title = 'Mystorage'
  }
  $('.nav-back').load('nav_back.html', function () {
    $('.page-title-back').append(title)
  })
}
//router for page redirection
var route = {
  login: function (data, callback) {
    if (data === null) {
      data = {}
    }
    openPage('login', data, function (obj) {
      if (callback !== null) {
        callback(obj)
      }
    })
  },

  home: function (data, callback) {
    if (data == null) {
      data = {}
    }
    openPage('home', data, function (obj) {
      getDrawerAndNav(obj.title)
      if (callback != null) {
        callback(obj)
      }
    })
  },
  create: function (data, callback) {
    if (data == null) {
      data = {}
    }
    openPage('createStorage', data, function (obj) {
      getNavBack(obj.title)
      if (callback != null) {
        callback(obj)
      }
    })
  },
  confirm: function (data, callback) {
    if (data == null) {
      data = {}
    }
    openPage('storageConfirmPage', data, function (obj) {
      getNavBack(obj.title)
      if (callback != null) {
        callback(obj)
      }
    })
  },
  edit: function (data, callback) {
    if (data == null) {
      data = {}
    }
    openPage('editStorage', data, function (obj) {
      getNavBack(obj.title)
      if (callback != null) {
        callback(obj)
      }
    })
  },
  viewImage: function (data, callback) {
    if (data == null) {
      data = {}
    }
    openPage('imageWindow', data, function (obj) {
      getNavBack(obj.title)
      callback(obj)
    })
  },
  profile: function (data, callback) {
    if (data == null) {
      data = {}
    }
    openPage('profile', data, function (obj) {
      getNavBack(obj.title)
      callback(obj)
    })
  },
  register: function (data, callback) {
    if (data == null) {
      data = {}
    }
    openPage('register', data, function (obj) {
      callback(obj)
    })
  }
}
