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
    sql += " `type` TEXT NOT NULL,"
    sql += " `demensions` REAL NOT NULL,"
    sql += " `date` TEXT NOT NULL ,"
    sql += " `time` TEXT NOT NULL ,"
    sql += " `price REAL NOT NULL` ,"
    sql += " `note` TEXT NULL ,"
    sql += " `reporter` TEXT NOT NULL)"

    var sql2 = 'CREATE TABLE IF NOT EXISTS `storage_feature` ('
    sql2 += ' `id`  INTEGER PRIMARY KEY AUTOINCREMENT,'
    sql2 += ' `storage_id` INTEGER NOT NULL ,'
    sql2 += ' `feature` TEXT NOT NULL ,'
    sql2 += ' FOREIGN KEY (`storage_id`) REFERENCES `storage`(`id`))'

    DBEntity.db.transaction(function (tx) {
      tx.executeSql(sql, [], function (tx, rs) {
        console.log(tx)
        console.log(rs)
      }, DBEntity.printDbError)
      tx.executeSql(sql2, [], function (tx, rs) {
        console.log(tx)
        console.log(rs)
      }, DBEntity.printDbError)
    })
  },
  printDbError: function (error) {
    console.log(error)
    return error
  }
}
