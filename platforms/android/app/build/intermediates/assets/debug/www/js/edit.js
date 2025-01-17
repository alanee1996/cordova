// this function can assumed as a class for editStorage page
// this function trigger when editStorage page loaded
var editFunction = {
  obj: null, // to cahce the object from the route
  // this is an constructor
  init: function (obj) {
    if (!obj.model) {
      $('#storage-update-form').addClass('hide')
      alert('The data missing during passing from previous page')
    } else {
      editFunction.obj = obj.model // cahce the obj for reuse purpose
      // data binding
      $('#storageId').text(obj.model.id)
      $('#storageType').val(obj.model.type)
      $('#demensions').val(obj.model.demensions)
      $('#time').val(obj.model.time)
      $('#date').val(moment(obj.model.date, 'DD-MM-YYYY').format('YYYY-MM-DD'))
      $('#price').val(obj.model.price)
      $.each(obj.model.features, function (key, value) {
        if ($('input[value="' + value.feature + '"][type="checkbox"]').length > 0) {
          $('input[value="' + value.feature + '"][type="checkbox"]').prop('checked', true)
        }else {
          $('#other').prop('checked', true)
          $('#custom-other').val(value.feature)
        }

        if ($('#other').prop('checked')) {
          $('#custom-other').removeClass('hide').val(value.feature)
        }
      })
      $('#reporter').val(obj.model.reporter)
      $('#note').val(obj.model.note)
      if (obj.model.images !== null && obj.model.images.length > 0) {
        $('#timage').attr('src', obj.model.images[0].path).removeClass('hide')
        $('#imagepath').text(obj.model.images[0].path)
        $('#openCam').addClass('hide')
        $('#delete_img').removeClass('hide')
      }
    }
    // show the "other" input field when "other" checkbox is checked
    if ($('#other').prop('checked')) {
      $('#custom-other-container').removeClass('hide')
    }
    $('#other').change(function () {
      if ($('#other').prop('checked')) {
        $('#custom-other-container').removeClass('hide')
      } else {
        $('#custom-other-container').addClass('hide')
      }
    })
    //set minimum date
    $('#date').attr('min', moment().subtract(7, 'days').format('YYYY-MM-DD'))
    //set maximum time
    $('#date').attr('max',moment().add(1, 'years').format('YYYY-MM-DD'))
    // btn trigger to open camera
    $('#openCam').click(function (e) {
      e.preventDefault()
      camera.openCamera(function (imagePath) {
        $('#openCam').addClass('hide')
        $('#delete_img').removeClass('hide')
        $('#timage').attr('src', imagePath).removeClass('hide')
        camera.savePhoto(imagePath, function (retrivedImage) {
          $('#imagepath').text(retrivedImage.nativeURL)
        })
      })
    })
    // delete image
    $('#delete_img').click(function (e) {
      e.preventDefault()
      if ($('#imagepath').text()) {
        var r = confirm('Are you sure you want to delete this image?')
        if (r) {
          db.deleteImage(obj.model.id, function (rs) {
            camera.delete($('#imagepath').text(), function () {
              // remove image
              $('#delete_img').addClass('hide')
              $('#openCam').removeClass('hide')
              $('#imagepath').text('')
              $('#timage').addClass('hide').removeAttr('src')
            })
          })
        }
      }
    })
    // init form submission
    $('#storage-update-form').submit(editFunction.formSubmit)
  },
  formSubmit: function (e) {
    e.preventDefault()
    try {
      obj = {}
      obj.id = $('#storageId').text()
      obj.type = e.target.storageType.value
      obj.demensions = parseFloat(e.target.demensisons.value)
      obj.date = moment(e.target.date.value,'YYYY-MM-DD').format('DD-MM-YYYY')
      obj.time = e.target.time.value
      obj.price = parseFloat(e.target.price.value)
      obj.note = e.target.note.value
      obj.reporter = e.target.reporter.value
      obj.features = editFunction.getFeatures($(e.target).find('input[name="storageFeature[]"]'))
      var imgPath = editFunction.getImagePath()
      if ( (editFunction.obj.images.length === 0 && imgPath.length !== 0)) {
        obj.images = imgPath
      }
      else if (imgPath.length > 0 && editFunction.obj.images.length > 0) {
        if (imgPath[0] !== editFunction.obj.images[0].path) {
          obj.images = imgPath
        }
      }
      loading('updating storage')
      db.updateStorage(obj, function () {
        if (document.getElementById('home.html')) {
          document.getElementById('home.html').remove()
        }
        console.log('Update successful')
        route.home({}, homeFunction.init)
      })
      closeLoading()
    } catch(e) {
      alert(e.message)
    }
  },
  // get the select storage feature and return as an array
  getFeatures: function (elements) {
    var features = []
    $.each(elements, function (key, element) {
      var value = element.value
      if ($(element).prop('checked') && $(element).attr('id') === 'other') {
        features.push({feature: $('#custom-other').val(),isCustom: 1})
      } else if ($(element).prop('checked')) {
        features.push({feature: value,isCustom: 0})
      }
    })
    return features
  },
  // make sure the error message in specific
  demensionKeyUp: function (e) {
    var validity = e.target.validity
    if (validity.rangeUnderflow === true) {
      e.target.setCustomValidity('Minimum dimensions is 1.3')
    }
    else if (validity.rangeOverflow === true) {
      e.target.setCustomValidity('Maximum dimensions is 20')
    }
    else if (validity.valueMissing === true) {
      e.target.setCustomValidity('Please enter dimensions')
    }else {
      e.target.setCustomValidity('')
    }
  },
  // make sure the error message in specific
  priceKeyUp: function (e) {
    var validity = e.target.validity
    if (validity.rangeUnderflow === true) {
      e.target.setCustomValidity('Minimum price is 800')
    }
    else if (validity.rangeOverflow === true) {
      e.target.setCustomValidity('Maximum price is 3000')
    }
    else if (validity.valueMissing === true) {
      e.target.setCustomValidity('Please enter price')
    }else {
      e.target.setCustomValidity('')
    }
  },
  // get the taken image path from the html element
  getImagePath: function () {
    if ($('#imagepath').text()) {
      return [$('#imagepath').text()]
    }
    return []
  }
}
