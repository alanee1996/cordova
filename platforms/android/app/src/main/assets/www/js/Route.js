function getDrawerAndNav (title) {
  if (title == null || title == undefined) {
    title = 'Mystorage'
  }
  $('#drawer').load('drawer.html')
  $('#nav').load('nav.html', function () {
    $('#page-title').append(title)
  })
}

var route = {
  login: function () {},

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
      window.disabledBackButton = true
  }
}
