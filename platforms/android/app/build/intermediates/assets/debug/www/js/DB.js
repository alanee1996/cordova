var DBEntity = {
  db: null, //db instance
  config: {
    name: 'mystorage.db',
    location: 'default'
  },
  test: function () {
    window.sqlitePlugin.echoTest(function () {
      console.log('ECHO test OK')
    })
  },
  //init db instance
  connect: function () {
    DBEntity.db = window.sqlitePlugin.openDatabase(
      DBEntity.config,
      DBEntity.checkTables,
      DBEntity.printDbError
    )
  },
  //create database and tables
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
    sql2 += ' `isCustom` INTEGER NOT NULL, '
    sql2 += ' FOREIGN KEY (`storage_id`) REFERENCES `storage`(`id`))'

    var sql3 = 'CREATE TABLE IF NOT EXISTS `storage_image` ('
    sql3 += ' `id` INTEGER PRIMARY KEY AUTOINCREMENT,'
    sql3 += ' `path` TEXT NOT NULL,'
    sql3 += ' `storage_id` INTEGER NOT NULL,'
    sql3 += ' FOREIGN KEY (`storage_id`) REFERENCES `storage`(`id`))'

    // additional feature user table
    var sql4 = 'CREATE TABLE IF NOT EXISTS `user` ('
    sql4 += ' `id` INTEGER PRIMARY KEY AUTOINCREMENT,'
    sql4 += ' `email` TEXT NOT NULL UNIQUE,'
    sql4 += ' `password` TEXT NOT NULL,'
    sql4 += ' `path` TEXT )'

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
      //insert default user
      tx.executeSql(
        sql4,
        [],
        function (tx, rs) {
          tx.executeSql('select count(*) as rows from `user`', [], (tx, rs) => {
            if (rs.rows.length > 0) {
              console.log(rs.rows.item(0))
              if (rs.rows.item(0).rows === 0) {
                tx.executeSql('insert into `user` (`email`,`password`,`path`) values (?,?,?)', ['abc@example.com', '123123', 'img/alanee.jpg'], (tx, rs) => {
                  console.log('default user insert successful')
                }, DBEntity.printDbError)
              }
            }
          })
          console.log('user table created')
        },
        DBEntity.printDbError
      )
    })
  },
  //insert new storage item
  createStorage: function (obj, callback) {
    if (DBEntity == null) {
      DBEntity.connect()
    }
    //check duplicate storage item
    DBEntity.checkDuplicatie(obj, (condition) => {
      if (condition) {
        callback(false)
      } else {
        var sql =
        'insert into `storage` (`type`,`demensions`,`date`,`time`,`price`,`note`,`reporter`) values (?,?,?,?,?,?,?)'
        var sql2 =
        'insert into `storage_feature` (`feature` , `storage_id`, `isCustom`)  values(?,?,?)'
        var sql3 = 'insert into `storage_image` (`path`, `storage_id`) values(?,?)'
        //inser storage
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
                  //insert features
                  trx.executeSql(
                    sql2,
                    [obj.features[i].feature, storage_id, obj.features[i].isCustom],
                    function (tx2, rs2) {
                      console.log('storage feature insert successful')
                    },
                    DBEntity.printDbError
                  )
                }
              }
              if ((obj.images != null || obj.images != undefined) && storage_id != null) {
                for (var i = 0; i < obj.images.length; i++) {
                  //insert storage images
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
        callback(true) // trigger callback function
      }
    })
  },
  //get a complete bind model from database including storage,features and images
  getStorageList: function (callback) {
    if (DBEntity.db == null) {
      DBEntity.connect()
    }
    DBEntity.db.transaction(function (tx) {
      var model = []
      //select storage first
      tx.executeSql(
        'select * from `storage` order by `id` DESC',
        [],
        function (tx, rs) {
          console.log('data is selecting')
          for (var i = 0; i < rs.rows.length; i++) {
            var target = rs.rows.item(i)
            target.images = [] //init object
            target.features = [] //init object
            model.push(target)
          }
          DBEntity.getStorageImages(model, callback) //select storage image
        },
        DBEntity.printDbError
      )
    })
  },
  search: function (search, callback) {
    if (DBEntity.db == null) {
      DBEntity.connect()
    }
    var sql = "select * from `storage` where (`type` LIKE '%'|| ? ||'%' or `reporter` LIKE '%'|| ? ||'%') and `price` between 100 and ? order by `id` DESC"
    DBEntity.db.transaction(function (tx) {
      var model = []
      tx.executeSql(
        sql,
        [search.value, search.value, search.max],
        function (tx, rs) {
          console.log('searching........')
          for (var i = 0; i < rs.rows.length; i++) {
            var target = rs.rows.item(i)
            target.images = []
            target.features = []
            model.push(target)
          }
          DBEntity.getStorageImages(model, callback) //select storage image
        },
        DBEntity.printDbError
      )
    })
  },
  getStorageImages: function (model, callback) {
    if (model != null && model.length > 0) { //ignore when storage is equal to null
      //start and end variable is to make sure querying one time to get multiple result in between the id range reduce repeating calling database
      //because of the sorting of the storage is descending order, so the starting id is the last index from the array.
      var start = model[model.length - 1].id 
      var end = model[0].id
      var sql = start === end ? 'select * from `storage_image` where `storage_id` = ?' : 'select * from `storage_image` where `storage_id` between ? and ?'
      var params = start === end ? [start] : [start, end]
      DBEntity.db.transaction(function (tx) {
        tx.executeSql(sql, params, function (tx, rs) {
          for (var x = 0; x < rs.rows.length; x++) {
            var storageId = rs.rows.item(x).storage_id
            var modelIndex = whereIndex(model, (c) => c.id === storageId)
            if (modelIndex != null) {
              model[modelIndex].images.push(rs.rows.item(x))// add single image object to array list
            }
          }
          console.log(model)
          DBEntity.getStorageFeatures(model, callback) //binding storage features
        }, DBEntity.printDbError)
      })
    } else {
      DBEntity.getStorageFeatures(model, callback) //binding storage features
    }
  },
  getStorageFeatures: function (model, callback) {
    if (model != null && model.length > 0) {//ignore when storage is equal to null
      //start and end variable is to make sure querying one time to get multiple result in between the id range reduce repeating calling database
      //because of the sorting of the storage is descending order, so the starting id is the last index from the array.
      var start = model[model.length - 1].id
      var end = model[0].id
      var sql = start === end ? 'select * from `storage_feature` where `storage_id` = ?' : 'select * from `storage_feature` where `storage_id` between ? and ?'
      var params = start === end ? [start] : [start, end]
      DBEntity.db.transaction(function (tx) {
        tx.executeSql(sql, params, function (tx, rs) {
          for (var y = 0; y < rs.rows.length; y++) {
            var storageId = rs.rows.item(y).storage_id
            var modelIndex = whereIndex(model, (c) => c.id === storageId)
            if (modelIndex != null) {
              model[modelIndex].features.push(rs.rows.item(y))// add single feature object to array list
            }
          }
          callback(model)// trigger the final callback to return the object
        }, DBEntity.printDbError)
      })
    }else {
      callback(model)// trigger the final callback to return the object
    }
  },
  deleteImage: function (id, callback) {
    if (DBEntity.db == null) { DBEntity.connect }
    //delete image from database
    DBEntity.db.transaction(function (tx) {
      var sql = 'delete from `storage_image` where `id` = ?'
      tx.executeSql(sql, [id], function (trx, rs) {
        callback(rs)
      }, DBEntity.printDbError)
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
  },
  //reset database
  flash: function () {
    if (DBEntity == null) {
      DBEntity.connect()
    }
    DBEntity.db.transaction(function (tx) {
      tx.executeSql('drop table `storage_image` ', [], (t, rs) => console.log('storage image drop'), DBEntity.printDbError)
    })
    DBEntity.db.transaction(function (tx) {
      tx.executeSql('drop table `storage_feature` ', [], (t, rs) => console.log('storage feature drop'), DBEntity.printDbError)
    })
    DBEntity.db.transaction(function (tx) {
      tx.executeSql('drop table `storage` ', [], (t, rs) => console.log('storage drop'), DBEntity.printDbError)
    })
    DBEntity.db.transaction(function (tx) {
      tx.executeSql('drop table `user` ', [], (t, rs) => console.log('user drop'), DBEntity.printDbError)
    })
  },
  updateStorage: function (model, callback) {
    if (DBEntity.db === null) { DBEntity.connect() }
    DBEntity.db.transaction(function (tr) {
      var sql1 = 'update `storage` set `type` = ? ,`demensions` = ? ,`date` = ? ,`time` = ? ,`price` = ? ,`note` = ? ,`reporter` = ? where `id` = ? '
      // update storage and storage feature
      tr.executeSql(sql1, [model.type, model.demensions, model.date, model.time, model.price, model.note, model.reporter, model.id], function (trx, rs) {
        var sql2 = 'delete from  `storage_feature` where `storage_id` = ?'
        // delete all the previous storage_feature and insert again will be the better solution to update the storage feature
        trx.executeSql(sql2, [model.id], (trx2, rs2) => {
          if (model.features && model.features.length > 0) {
            for (var i = 0; i < model.features.length; i++) {
              trx.executeSql(
                'insert into `storage_feature` (`feature` , `storage_id`, `isCustom`)  values(?,?,?)',
                [model.features[i].feature, model.id, model.features[i].isCustom],
                function (tx2, rs2) {
                  console.log('storage feature update successful')
                },
                DBEntity.printDbError
              )
            }
          }
        }, DBEntity.printDbError)

        // update image
        if (model.images && model.images.length > 0) {
          for (var i = 0; i < model.images.length; i++) {
            trx.executeSql(
              'insert into `storage_image` (`path`, `storage_id`) values(?,?)',
              [model.images[i], model.id],
              function (tx2, rs2) {
                console.log('Storage image update successful')
              },
              DBEntity.printDbError
            )
          }
        }
      }, DBEntity.printDbError)
      callback()
    })
  },
  deleteStorage: function (model, callback) {
    if (DBEntity.db == null) { DBEntity.connect() }
    //delete sub table data storage images 
    DBEntity.db.transaction(function (tr) {
      if (model.images && model.images.length > 0) {
        $.each(model.images, (key, value) => {
          camera.delete(value.path, function (result) {
            DBEntity.deleteImage(value.id)//delete the actually image from the mobile storage
          })
        })
      }
      //delete sub table data storage features
      if (model.features && model.features.length > 0) {
        $.each(model.features, (key, value) => {
          tr.executeSql('delete from `storage_feature` where `storage_id` = ?', [model.id], (trx, rs) => {
            console.log('storage feature deleted')
          })
        })
      }
      //delete the storage item
      tr.executeSql('delete from `storage` where `id` = ?', [model.id], (trx, rs) => {
        console.log('storage delete successful')
        callback()
      })
    })
  },
  selectUser: function (loginModel, callback) {
    if (DBEntity.db === null) { DBEntity.connect() }
    DBEntity.db.transaction(function (tr) {
      var model = {}
      tr.executeSql('select * from `user` where `email` = ? and `password` = ?', [loginModel.email, loginModel.password], (trx, rs) => {
        if (rs.rows.length > 0) {
          model = rs.rows.item(0)
          callback(model)
        }else {
          callback(null)
        }
      })
    })
  },
  updateUser: function (model, callback) {
    if (DBEntity.db === null) { DBEntity.connect() }
    var user = JSON.parse(sessionStorage.getItem('user')) //covnert the obj to json string and keep in the session storage
    DBEntity.db.transaction(function (tr) {
      var sql = 'update user set `email` = ? '
      var params = [model.email]
      if (model.password) {
        sql += ', `password` = ?'
        params[params.length] = model.password
      }
      //if else statement to check the nullable child table in order to avoid error when no result
      if (model.path) {
        sql += ', `path` = ?'
        params[params.length] = model.path
        //if the image path equal to the img/no-image.jpg or img/alanee.jpg, delete database only because the actual file is storage in www folder
        if (user.path !== null && user.path !== 'img/no-image.jpg' && user.path !== 'img/alanee.jpg' && user.path !== model.path) {
          camera.delete(user.path, () => {
            console.log('previous profile image delete')
          })
        }
      }
      params[params.length] = user.id
      sql += ' where `id` = ?'
      tr.executeSql(sql , params, (trx, rs) => {
        trx.executeSql('select * from `user` where `id` = ?', [user.id], (trx2, rs2) => {
          sessionStorage.setItem('user', JSON.stringify(rs2.rows.item(0)))
          callback()
        })
      },DBEntity.printDbError)
    })
  },
  //checking duplicate storage item
  checkDuplicatie: function (model, callback) {
    if (DBEntity.db === null) { DBEntity.connect() }
    DBEntity.db.transaction(function (tr) {
      var sql = 'select count(*) as rows from `storage` where `type` = ? and `demensions` = ? and `date` = ? and `time` = ? and `price` = ? and `note` = ? and `reporter` = ?'
      tr.executeSql(sql, [model.type, model.demensions, model.date, model.time, model.price, model.note, model.reporter], (trx, rs) => {
        if (rs.rows.length > 0 && rs.rows.item(0).rows) {
          callback(true)
        }else {
          callback(false)
        }
      }, DBEntity.printDbError)
    })
  },
  //user registration
  createUser: function (model, callback) {
    if (DBEntity.db === null) { DBEntity.connect() }
    var sql = 'select count(*) as rows from `user` where `email` = ?'
    var sql2 = 'insert into `user` (`email`,`password`) values (?,?)'
    DBEntity.db.transaction(function (tr) {
      // check user exist or not if exist return error message
      tr.executeSql(sql, [model.email], (trx, rs) => {
        if (rs.rows.length > 0 && rs.rows.item(0).rows > 0) {
          callback(false)
        } else {
          trx.executeSql(sql2, [model.email, model.password], (trx2, rs2) => {
            callback(true)
          }, DBEntity.printDbError)
        }
      }, DBEntity.printDbError)
    })
  }
}
