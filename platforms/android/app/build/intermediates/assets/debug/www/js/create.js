//this function can assume as class for create storage page
//this function will trigger when createStorage page is loaded
var createFunction = {
  //this can assume as a constructor
  init: function (obj) {

    //set minimum date
    $('#date').attr('min', moment(new Date().getTime() - 6.048e+8).format('YYYY-MM-DD'))
    //set maximum time
    $('#date').attr('max',moment(new Date().getFullYear() + 1, 'YYYY').format('YYYY-MM-DD'))

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
    // show the "other" input field when "other" checkbox is checked
    $('#other').change(function () {
      if ($('#other').prop('checked')) {
        $('#custom-other-container').removeClass('hide')
      } else {
        $('#custom-other-container').addClass('hide')
      }
    })
    // delete image
    $('#delete_img').click(function (e) {
      e.preventDefault()
      if ($('#imagepath').text()) {
        var r = confirm('Are you sure you want to delete this image?')
        if (r) {
          camera.delete($('#imagepath').text(), function () {
            // remove image
            $('#delete_img').addClass('hide')
            $('#openCam').removeClass('hide')
            $('#imagepath').text('')
            $('#timage').addClass('hide').removeAttr('src')
          })
        }
      }
    })
    // init form submission
    $('#storage-create-form').submit(createFunction.formSubmit)
  },
  //get the select storage feature and return as an array
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
  formSubmit: function (e) {
    e.preventDefault()
    try {
      //validation
      //createFunction.validation(e)
      obj = {}
      obj.type = e.target.storageType.value
      obj.demensions = parseFloat(e.target.demensisons.value)
      obj.date = moment(e.target.date.value,'YYYY-MM-DD').format('DD-MM-YYYY')
      obj.time = e.target.time.value
      obj.price = parseFloat(e.target.price.value)
      obj.note = e.target.note.value
      obj.reporter = e.target.reporter.value
      obj.features = createFunction.getFeatures($(e.target).find('input[name="storageFeature[]"]'))
      obj.images = createFunction.getImagePath()
      loading('Preparing confirm storage page')
        closeLoading()
        route.confirm({model: obj}, confrimFunction.init)
    } catch(e) {
      alert(e.message)
    }
  },
  validation: function (e) {
    var element = e.target
    var count = 0
    //check checkbox at least select one
    $(element).find('input[name="storageFeature[]"]').each(function (key, value) {
      if ($(value).prop('checked') === true) {
        count++
      }
    })
    if (count == 0) throw new Error('Please at least choose one storage feature')
    if ($('#other').prop('checked') && $('#custom-other').val() == '') throw new Error('Please enter other storage features')
  },
  //make sure the error message in specific
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
    //make sure the error message in specific
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
  //get the taken image path from the html element
  getImagePath: function () {
    if ($('#imagepath').text()) {
      return [$('#imagepath').text()]
    }
    return []
  }
}
