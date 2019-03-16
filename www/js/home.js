var homeFunction = {
  init: function (obj) {
    if (document.getElementById('createStorage.html')) {
      document.getElementById('createStorage.html').remove()
    }
    if (document.getElementById('storageConfirmPage.html')) {
      document.getElementById('storageConfirmPage.html').remove()
    }
    var search = document.getElementById('search')
    search.addEventListener('keyup', function (e) {
      if (e.keyCode === 13) {
        alert(search.value)
        // perform search function
        search.blur()
        e.preventDefault()
      }
    })
    homeFunction.getStorageData()
  },
  getStorageData: function () {
    db.getStorageList(homeFunction.buildStorageList)
  },
  // this function is to select the data from database and inject to list view
  buildStorageList: function (model) {
    console.log(model)
    if (model != null && model.length > 0) {
      $('#no-result').addClass('hide')
      $.each(model, function (key, value) {
        var storageItem = $('#storage-item').clone()
        storageItem.attr('id', 'storage-item_' + value.id).removeClass('hide')
        // bind image
        if (value !== null && value.images.length > 0) {
          storageItem.find('img').attr('src', value.images[0].path)
        }
        storageItem.find('.storage-type').text('Storage type: ' + value.type)
        storageItem.find('.demensions').text('Demensions: ' + value.demensions)
        storageItem.find('.price').text('Price ' + value.price)
        storageItem.find('.reporter').text('Reporter: ' + value.reporter)
        storageItem.find('.note').text(value.note)
        storageItem.find('.edit').attr('onclick', 'homeFunction.edit(' + JSON.stringify(value) + ')')
        if (value.features !== null && value.features.length > 0) {
          var featuresElement = []
          $.each(value.features, function (key, v) {
            var feature = $('#feature-container').clone()
            feature.removeClass('hide')
            feature.removeAttr('id')
            feature.text(v.feature)
            featuresElement.push(feature)
          })
          storageItem.find('.storage-features').append(featuresElement)
        }
        storageItem.find('.datetime').text('Created at ' + value.date + ' ' + value.time)
        $('#storagelist').append(storageItem)
      })
    }else {
      $('#no-result').removeClass('hide')
    }
  },
  edit: function (model) {
    route.edit({model: model,title: 'Edit Storage'}, editFunction.init)
  },
  delete: function (model) {
    console.log(model)
  }
}
