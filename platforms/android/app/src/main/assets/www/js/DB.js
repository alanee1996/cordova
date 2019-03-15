var DBEntity = {
  db: null,
  config: {
    name: 'mystorage.db',
    location: 'default'
  },
  test: function () {
    window.sqlitePlugin.echoTest(function () {
      console.log('ECHO test OK')
    })
  },
  connect: function () {
    DBEntity.db = window.sqlitePlugin.openDatabase(
      DBEntity.config,
      DBEntity.checkTables,
      DBEntity.printDbError
    )
  },
  checkTables: function () {
    if (DBEntity.db == null) {
      DBEntity.connect()
    }
    var sql = 'CREATE TABLE IF NOT EXISTS `storage` ('
    sql += ' `id` INTEGER PRIMARY KEY AUTOINCREMENT, '
    sql += ' `type` TEXT NOT NULL,'
    sql += ' `demensions` REAL NOT NULL,'
    sql += ' `date` TEXT NOT NULL ,'
    sql += ' `time` TEXT NOT NULL ,'
    sql += ' `price` REAL NOT NULL ,'
    sql += ' `note` TEXT NULL ,'
    sql += ' `reporter` TEXT NOT NULL)'

    var sql2 = 'CREATE TABLE IF NOT EXISTS `storage_feature` ('
    sql2 += ' `id`  INTEGER PRIMARY KEY AUTOINCREMENT,'
    sql2 += ' `storage_id` INTEGER NOT NULL ,'
    sql2 += ' `feature` TEXT NOT NULL ,'
    sql2 += ' FOREIGN KEY (`storage_id`) REFERENCES `storage`(`id`))'

    var sql3 = 'CREATE TABLE IF NOT EXISTS `storage_image` ('
    sql3 += ' `id` INTEGER PRIMARY KEY AUTOINCREMENT,'
    sql3 += ' `path` TEXT NOT NULL,'
    sql3 += ' `storage_id` INTEGER NOT NULL,'
    sql3 += ' FOREIGN KEY (`storage_id`) REFERENCES `storage`(`id`))'

    DBEntity.db.transaction(function (tx) {
      tx.executeSql(
        sql,
        [],
        function (tx, rs) {
          console.log('storage table created')
        },
        DBEntity.printDbError
      )
      tx.executeSql(
        sql2,
        [],
        function (tx, rs) {
          console.log('storage feature table created')
        },
        DBEntity.printDbError
      )
      tx.executeSql(
        sql3,
        [],
        function (tx, rs) {
          console.log('storage image table created')
        },
        DBEntity.printDbError
      )
    })
  },
  createStorage: function (obj) {
    if (DBEntity == null) {
      DBEntity.connect()
    }
    var sql =
    'insert into `storage` (`type`,`demensions`,`date`,`time`,`price`,`note`,`reporter`) values (?,?,?,?,?,?,?)'
    var sql2 =
    'insert into `storage_feature` (`feature` , `storage_id`)  values(?,?)'
    var sql3 = 'insert into `storage_image` (`path`, `storage_id`) values(?,?)'
    DBEntity.db.transaction(function (tx) {
      tx.executeSql(
        sql,
        [
          obj.type,
          obj.demensions,
          obj.date,
          obj.time,
          obj.price,
          obj.note,
          obj.reporter
        ],
        function (trx, rs) {
          console.log('storage insert successful')
          var storage_id = rs.insertId
          if ((obj.features != null || obj.features != undefined) && storage_id != null) {
            for (var i = 0; i < obj.features.length; i++) {
              trx.executeSql(
                sql2,
                [obj.features[i], storage_id],
                function (tx2, rs2) {
                  console.log('storage feature insert successful')
                },
                DBEntity.printDbError
              )
            }
          }
          if ((obj.images != null || obj.images != undefined) && storage_id != null) {
            for (var i = 0; i < obj.images.length; i++) {
              trx.executeSql(
                sql3,
                [obj.images[i], storage_id],
                function (tx2, rs2) {
                  console.log('Storage image insert successful')
                },
                DBEntity.printDbError
              )
            }
          }
        },
        DBEntity.printDbError
      )
    })
  },
  getStorageList: function (callback) {
    if (DBEntity.db == null) {
      DBEntity.connect()
    }
    DBEntity.db.transaction(function (tx) {
      var model = []
      tx.executeSql(
        'select * from `storage`',
        [],
        function (tx, rs) {
          console.log('data is selecting')
          for (var i = 0; i < rs.rows.length; i++) {
            var target = rs.rows.item(i)
            target.images = []
            target.features = []
            model.push(target)
          }
          DBEntity.getStorageImages(model, callback)
        },
        DBEntity.printDbError
      )
    })
  },
  getStorageImages: function (model, callback) {
    if (model != null && model.length > 0) {
      var start = model[0].id
      var end = model[model.length - 1].id
      var sql = start === end ? 'select * from `storage_image` where `storage_id` = ?' : 'select * from `storage_image` where `storage_id` between ? and ?'
      var params = start === end ? [start] : [start, end]
      DBEntity.db.transaction(function (tx) {
        tx.executeSql(sql, params, function (tx, rs) {
          for (var x = 0; x < rs.rows.length; x++) {
            var storageId = rs.rows.item(x).storage_id
            var modelIndex = whereIndex(model, (c) => c.id === storageId)
            if (modelIndex != null) {
              model[modelIndex].images.push(rs.rows.item(x))
            }
          }
          console.log(model)
          DBEntity.getStorageFeatures(model, callback)
        }, DBEntity.printDbError)
      })
    } else {
      DBEntity.getStorageFeatures(model, callback)
    }
  },
  getStorageFeatures: function (model, callback) {
    if (model != null && model.length > 0) {
      var start = model[0].id
      var end = model[model.length - 1].id
      var sql = start === end ? 'select * from `storage_feature` where `storage_id` = ?' : 'select * from `storage_feature` where `storage_id` between ? and ?'
      var params = start === end ? [start] : [start, end]
      DBEntity.db.transaction(function (tx) {
        tx.executeSql(sql, params, function (tx, rs) {
          for (var y = 0; y < rs.rows.length; y++) {
            var storageId = rs.rows.item(y).storage_id
            var modelIndex = whereIndex(model, (c) => c.id === storageId)
            if (modelIndex != null) {
              model[modelIndex].features.push(rs.rows.item(y))
            }
          }
          callback(model)
        }, DBEntity.printDbError)
      })
    }else {
      callback(model)
    }
  },
  printDbError: function (error) {
    alert(error.message ? error.message : 'Database error')
    console.log('ERROR')
    console.log(error.message)
    console.log(
      '-------------------------------------------------------------------------'
    )
    return error
  }
}
