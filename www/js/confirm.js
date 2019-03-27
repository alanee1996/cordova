//this confrimFunction can assume as confirm class
//this method will trigger when confirm page is loaded
var confrimFunction = {
  //this is a constructor of the confirmFunction
  init: function (obj) {
    //data binding
    var container = $('#confirm_storage_item')
    $(container).find('.storageType').text('Storage Type: ' + obj.model.type)
    $(container).find('.demensions').text('Demensions: ' + obj.model.demensions)
    $(container).find('.price').text('Price ' + obj.model.price)
    $(container).find('.reporter').text('Reporter: ' + obj.model.reporter)
    $(container).find('.date').text('Date: ' + obj.model.date)
    $(container).find('.time').text('Time: ' + obj.model.time)
    $(container).find('.note').text(obj.model.note)
    if (obj.model.images !== null && obj.model.images.length > 0) {
      $(container).find('img').attr('src', obj.model.images[0])//always get first image
    }
    // binding storage features to the checkbox
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
      //insert storage data to db
      db.createStorage(obj.model, function (condition) {
        if (condition) {
          closeLoading()
          //remove home page from the cache of mobileui in order to make the page refresh when landed
          if (document.getElementById('home.html')) {
            document.getElementById('home.html').remove()
          }
          route.home({}, homeFunction.init)
        } else {
          closeLoading()
          alert('The storage item is duplicate in the database')
        }
      })
    })
  }
}
