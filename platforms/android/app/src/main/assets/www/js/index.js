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
    // obj = {}
    // obj.type = 'type'
    // obj.demensions = 12.5
    // obj.date = 'date'
    // obj.time = 'time'
    // obj.price = 12.4
    // obj.note = 'note'
    // obj.reporter = 'asdasd'
    // db.createStorage(obj)
    route.home({},homeFunction.init)
  }
}

app.initialize()
