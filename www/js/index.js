var db
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
    route.create({},createFunction.init)
    // route.home({},homeFunction.init)
  }
}

app.initialize()
