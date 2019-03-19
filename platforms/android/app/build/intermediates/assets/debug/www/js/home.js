var homeFunction = {
  init: function (obj) {
    if (document.getElementById('login.html')) {
      document.getElementById('login.html').remove()
    }
    if (document.getElementById('storageConfirmPage.html')) {
      document.getElementById('storageConfirmPage.html').remove()
    }
    if (document.getElementById('createStorage.html')) {
      document.getElementById('createStorage.html').remove()
    }
    if (document.getElementById('editStorage.html')) {
      document.getElementById('editStorage.html').remove()
    }
    if (document.getElementById('profile.html')) {
      document.getElementById('profile.html').remove()
    }

    var search = document.getElementById('search')
    search.addEventListener('keyup', function (e) {
      if (e.keyCode === 13) {
        // perform search function
        var searchValue = {
          value: search.value,
          max: $('#amount').val()
        }
        db.search(searchValue, (m) => {
          loading('Searching')
          setTimeout(() => {
            closeLoading()
            $('#storagelist').children('.storage').remove()
            if (m) {
              homeFunction.buildStorageList(m)
            }else {
              $('#no-result').removeClass('hide')
            }
          }, 3000)
          search.blur()
        })
        e.preventDefault()
      }
    })
    $('#amount').change(function () {
      var amount = $(this).val()
      $('#max-amount').text(amount)
      var searchValue = {
        value: $('#search').val(),
        max: $('#amount').val()
      }
      db.search(searchValue, (m) => {
        loading('Filtering')
        setTimeout(() => {
          closeLoading()
          $('#storagelist').children('.storage').remove()
          if (m) {
            homeFunction.buildStorageList(m)
          }else {
            $('#no-result').removeClass('hide')
          }
        }, 2000)
        search.blur()
      })
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
        storageItem.attr('id', 'storage-item_' + value.id).removeClass('hide').addClass('storage')
        // bind image
        if (value !== null && value.images.length > 0) {
          storageItem.find('img').attr('src', value.images[0].path).attr('onclick', 'browseImage(' + '"' + value.images[0].path + '"' + ')')
        }
        storageItem.find('.storage-type').text('Storage type: ' + value.type)
        storageItem.find('.demensions').text('Demensions: ' + value.demensions)
        storageItem.find('.price').text('Price ' + value.price)
        storageItem.find('.reporter').text('Reporter: ' + value.reporter)
        storageItem.find('.note').text(value.note)
        storageItem.find('.edit').attr('onclick', 'homeFunction.edit(' + JSON.stringify(value) + ')')
        storageItem.find('.delete').attr('onclick', 'homeFunction.delete(' + JSON.stringify(value) + ')')
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
    var r = confirm('Are you sure want to delete this storage item ?')
    if (r) {
      loading('Deleting the storage item')
      db.deleteStorage(model, () => {
        setTimeout(() => {
          closeLoading()
          $('#storagelist').children('.storage').remove()
          homeFunction.getStorageData()
        }, 3000)
      })
    }
  }
}
