var confrimFunction = {
  init: function (obj) {
    console.log(obj.model)
    var container = $('#confirm_storage_item')
    $(container).find('.storageType').text('Storage Type: ' + obj.model.type)
    $(container).find('.demensions').text('Demensions: ' + obj.model.demensions)
    $(container).find('.price').text('Price ' + obj.model.price)
    $(container).find('.reporter').text('Reporter: ' + obj.model.reporter)
    $(container).find('.date').text('Date: ' + obj.model.date)
    $(container).find('.time').text('Time: ' + obj.model.time)
    $(container).find('.note').text(obj.model.note)
    if (obj.model.features !== null && obj.model.features.length > 0) {
      var featuresElement = []
      $.each(obj.model.features, function (key, v) {
        var feature = $('#confirm_feature_container').clone()
        feature.removeClass('hide')
        feature.removeAttr('id')
        feature.text(v.feature)
        featuresElement.push(feature)
      })
      $(container).find('.storage-features').append(featuresElement)
    }

    $('#confirm_btn').click(function () {
      loading('Creating storage')
      db.createStorage(obj.model)
      setTimeout(() => {
        closeLoading()
        route.confirm({model: obj}, homeFunction.init)
      }, 3000)
    })
  }
}
