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
    DBEntity.db = window.sqlitePlugin.openDatabase(DBEntity.config, DBEntity.checkTables, DBEntity.printDbError)
  },
  checkTables: function () {
    if (DBEntity.db == null) { DBEntity.connect() }
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

    DBEntity.db.transaction(function (tx) {
      tx.executeSql(sql, [], function (tx, rs) {
        console.log('storage table created')
      }, DBEntity.printDbError)
      tx.executeSql(sql2, [], function (tx, rs) {
        console.log('storage feature table created')
      }, DBEntity.printDbError)
    })
  },
  createStorage: function (obj) {
    if (DBEntity.db == null) { DBEntity.connect() }
    var status = false
    DBEntity.db.transaction(function (tx) {
      var sql3 = 'insert into `storage` (`type`,`demensions`,`date`,`time`,`price`,`note`,`reporter`) values (?,?,?,?,?,?,?)'
      tx.executeSql(sql3, [obj.type, obj.demensions, obj.date, obj.time, obj.price, obj.note, obj.reporter], function (tx, rs) {
        console.log('insert successful')
        status = true
      }, DBEntity.printDbError)
    })
    return status
  },
  test2: function () {
    console.log("db test 2 call")
    if (DBEntity.db == null) { DBEntity.connect() }
    var model = []
    DBEntity.db.transaction(function (tx) {
      tx.executeSql('select * from `storage`', [], function (tx, rs) {
        console.log('data is selecting');
        for (var i = 0; i < rs.rows.length; i++) {
          model.push(rs.rows.item(i))
        }
      }, DBEntity.printDbError)
    })
    return model
  },
  printDbError: function (error) {
    console.log('ERROR')
    console.log(error.message)
    console.log('-------------------------------------------------------------------------')
    return error
  }
}
