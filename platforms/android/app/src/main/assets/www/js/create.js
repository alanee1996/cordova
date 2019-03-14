var createFunction = {
    init: function (obj) {
        $("#back").click(function () { 
            backPage()
        })    
        $("#create-btn").click(function () {
            obj = {}
            obj.type = 'type'
            obj.demensions = 12.5
            obj.date = 'date'
            obj.time = 'time'
            obj.price = 12.4
            obj.note = 'note'
            obj.reporter = 'asdasd'
            obj.features = ['feature 1','feature 2','feature 3']
            obj.images = ['https://mobileui.github.io/img/maringa.jpg']
            db.createStorage(obj)
            })
    }
}
