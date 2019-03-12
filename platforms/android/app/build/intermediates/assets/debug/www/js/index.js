var app = {
  initialize: function () {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false
    )
    route.home()
  },

  onDeviceReady: function () {
    DBEntity.test()
    DBEntity.checkTables();
  }
}

app.initialize()
