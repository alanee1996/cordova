var db//this is the global db instance
var app = {
  initialize: function () {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false
    )
  },

  onDeviceReady: function () {
    window.disabledBackButton = true
    window.screen.orientation.lock('portrait')
    db = DBEntity
    db.test()
    db.checkTables()
    //decide what page to go
    if (sessionStorage.getItem('user')) {
      route.home({}, homeFunction.init)
    } else {
      route.login({}, loginFunction.init)
    }
  }
}

app.initialize()
