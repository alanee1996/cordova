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
    db = DBEntity
    db.test()
    db.checkTables()
    route.home({},homeFunction.init)
  }
}

app.initialize()
