var editFunction = {
  obj: null,
  init: function (obj) {
    if (!obj.model) {
      editFunction.obj = obj
      $('#storage-update-form').addClass('hide')
      alert('The data missing during passing from previous page')
    } else {
      $('#storageId').text(obj.model.id)
      $('#storageType').val(obj.model.type)
      $('#demensions').val(obj.model.demensions)
      $('#time').val(obj.model.time)
      $('#date').val(obj.model.date)
      $('#price').val(obj.model.price)
      $.each(obj.model.features, (key, value) => {
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
    $('#time_container').click(function () {
      $('#time').blur()
      var options = {
        date: new Date(),
        mode: 'time',
        is24Hour: true
      }
      datePicker.show(options, (d) => {
        // $('#time').blur()
        $('#time').val(moment(d, 'HH:mm:ss').format('HH:mm:ss'))
      }, (e) => alert(e))
    })
    $('#date_container').click(function () {
      // $('#date').blur()
      var options = {
        date: new Date(),
        mode: 'date',
        minDate: new Date()
      }
      datePicker.show(options, (d) => {
        // $('#date').blur()
        $('#date').val(moment(d, 'd-m-yyyy').format('DD-MM-YYYY'))
      }, (e) => alert(e))
    })
    $('#openCam').click(function (e) {
      e.preventDefault()
      camera.openCamera((imagePath) => {
        $('#openCam').addClass('hide')
        $('#delete_img').removeClass('hide')
        $('#timage').attr('src', imagePath).removeClass('hide')
        camera.savePhoto(imagePath, (retrivedImage) => {
          $('#imagepath').text(retrivedImage.nativeURL)
        })
      })
    })
    $('#delete_img').click(function (e) {
      e.preventDefault()
      if ($('#imagepath').text()) {
        var r = confirm('Are you sure you want to delete this image?')
        if (r) {
          db.deleteImage(obj.model.id, (rs) => {
            camera.delete($('#imagepath').text(), () => {
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
    $('#storage-update-form').submit(editFunction.formSubmit)
  },
  formSubmit: function (e) {
    e.preventDefault()
    try {
      editFunction.validation(e)
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
      obj.images = editFunction.getImagePath()
      loading('updating storage')
      db.updateStorage(obj, () => {
        console.log('Update successful')
        setTimeout(() => {
          closeLoading()
          if (document.getElementById('home.html')) {
            document.getElementById('home.html').remove()
          }
          route.home({}, homeFunction.init)
        }, 3000)
      })
    } catch(e) {
      alert(e.message)
    }
  },
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
  demensionKeyUp: function (e) {
    var validity = e.target.validity
    if (validity.rangeUnderflow === true) {
      e.target.setCustomValidity('Minimum demensions is 500')
    }
    else if (validity.rangeOverflow === true) {
      e.target.setCustomValidity('Maximum demensions is 8000')
    }
    else if (validity.valueMissing === true) {
      e.target.setCustomValidity('Please enter demensions')
    }else {
      e.target.setCustomValidity('')
    }
  },
  priceKeyUp: function (e) {
    var validity = e.target.validity
    if (validity.rangeUnderflow === true) {
      e.target.setCustomValidity('Minimum price is 100')
    }
    else if (validity.rangeOverflow === true) {
      e.target.setCustomValidity('Maximum price is 900')
    }
    else if (validity.valueMissing === true) {
      e.target.setCustomValidity('Please enter price')
    }else {
      e.target.setCustomValidity('')
    }
  },
  getImagePath: function () {
    if ($('#imagepath').text()) {
      return [$('#imagepath').text()]
    }
    return []
  }
}
