function getDrawerAndNav (title) {
  if (title == null || title == undefined) {
    title = 'Mystorage'
  }
  $('.drawer').load('drawer.html')
  $('.nav').load('nav.html', function () {
    $('.page-title').append(title)
  })
}

function getNavBack (title) {
  if (title == null || title == undefined) {
    title = 'Mystorage'
  }
  $('.nav-back').load('nav_back.html', function () {
    $('.page-title-back').append(title)
  })
}

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
  }
}
