// this function can assumed as a class for editStorage page
//this function trigger when editStorage page loaded
var editFunction = {
  obj: null, //to cahce the object from the route
  //this is an constructor
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
      $('#date').val(obj.model.date)
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
    // init time picker
    $('#time_container').click(function () {
      $('#time').blur()
      var options = {
        date: new Date(),
        mode: 'time',
        is24Hour: true,
        minDate: Date.parse(new Date())
      }
      datePicker.show(options, function (d) {
        $('#time').val(moment(d, 'HH:mm:ss').format('HH:mm:ss'))
      }, function (e) {
      })
    })
    // init date picker
    $('#date_container').click(function () {
      $('#date').blur()
      var options = {
        date: new Date(),
        mode: 'date',
        minDate: Date.parse(new Date()),
        maxDate: Date.parse(moment(new Date().getFullYear() + 1, 'YYYY').format('DD-MM-YYYY'))
      }
      datePicker.show(options, function (d) {
        $('#date').val(moment(d, 'd-m-yyyy').format('DD-MM-YYYY'))
      }, function (e) {
      })
    })
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
      //editFunction.validation(e)
      obj = {}
      obj.id = $('#storageId').text()
      obj.type = e.target.storageType.value
      obj.demensions = parseFloat(e.target.demensisons.value)
      obj.date = e.target.date.value
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
        closeLoading()
        route.home({}, homeFunction.init)
      })
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
  validation: function (e) {
    // check checkbox at least select one
    var element = e.target
    var count = 0
    $(element).find('input[name="storageFeature[]"]').each(function (key, value) {
      if ($(value).prop('checked') === true) {
        count++
      }
    })
    if (count == 0) throw new Error('Please at least choose one storage feature')
    if ($('#other').prop('checked') && $('#custom-other').val() == '') throw new Error('Please enter other storage features')
  },
  // make sure the error message in specific
  demensionKeyUp: function (e) {
    var validity = e.target.validity
    if (validity.rangeUnderflow === true) {
      e.target.setCustomValidity('Minimum demensions is 1.3')
    }
    else if (validity.rangeOverflow === true) {
      e.target.setCustomValidity('Maximum demensions is 20')
    }
    else if (validity.valueMissing === true) {
      e.target.setCustomValidity('Please enter demensions')
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
