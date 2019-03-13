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
    var sql3 = 'insert into `storage_image` (`path`, `storage_id`)'
    DBEntity.db.transaction(function (tx) {
      var storage_id = null
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
        function (tx, rs) {
          console.log('storage insert successful')
          storage_id = rs.insertId
        },
        DBEntity.printDbError
      )
      if (
        (obj.features != null || obj.features != undefined) &&
        storage_id != null
      ) {
        for (var i = 0; i < obj.features.length; i++) {
          tx.executeSql(
            sql2,
            [obj.features[i].feature, storage_id],
            function (tx, rs) {
              console.log('storage feature insert successful')
            },
            DBEntity.printDbError
          )
        }
      }
      if (
        (obj.images != null || obj.images != undefined) &&
        storage_id != null
      ) {
        for (var i = 0; i < obj.images.length; i++) {
          tx.executeSql(
            sql3,
            [obj.images[i].path, storage_id],
            function (tx, rs) {
              console.log('Storage image insert successful')
            },
            DBEntity.printDbError
          )
        }
      }
    })
  },
  test2: function (callback) {
    if (DBEntity.db == null) {
      DBEntity.connect()
    }
    DBEntity.db.transaction(function (tx) {
      tx.executeSql(
        'select * from `storage`',
        [],
        function (tx, rs) {
          var model = []
          console.log('data is selecting')
          for (var i = 0; i < rs.rows.length; i++) {
            model[i] = rs.rows.item(i)
          }
          callback(model)
        },
        DBEntity.printDbError
      )
    })
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
