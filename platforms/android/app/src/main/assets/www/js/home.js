var abc
var homeFunction = {
  init: function (obj) {
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
    db.test2(homeFunction.buildStorageList)
  },
  // this function is to select the data from database and inject to list view
  buildStorageList: function (model) {
    if (model != null && model.length > 0) {
      $('#no-result').addClass('hide')
      $.each(model, function (key, value) {
        var storageItem = $('#storage-item').clone()
        var storageFeature = storageItem.find('#feature-container').removeClass('hide')
        storageItem.attr('id', 'storage-item_' + value.id).removeClass('hide')
        // bind image later
        storageItem.find('.storage-type').text('Storage type: ' + value.type)
        storageItem.find('.demensions').text('Demensions: ' + value.demensions)
        storageItem.find('.price').text('Price ' + value.price)
        storageItem.find('.reporter').text('Reporter: ' + value.reporter)
        storageItem.find('.note').text('Note: ' + value.note)
        storageItem.find('.storage-features').append(storageFeature.text('test'))
        storageItem.find('.datetime').text('Created at ' + value.date + ' ' + value.time)
        $('#storagelist').append(storageItem)
      })
    }else {
      $('#no-result').removeClass('hide')
    }
  }
}
