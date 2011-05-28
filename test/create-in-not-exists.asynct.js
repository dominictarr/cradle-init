var init = require('../')
  , it = require('it-is').style('colour')
  , request = require('request')
  , dbname = 'cradle-init-test'
exports.__setup = function (test){
  request({
    uri:'http://localhost:5984/cradle-init-test', 
    method:'DELETE'
  }, 
  function (err){
    if(err)
      throw err //test.error(err)
    test.done()  
  })
}
/*
exports ['will callback error if there is no couchdb running'] = function (test){

  init('test',{host:'localhost', port:2352}).ready(function (err,db){
    console.log("ASDFASFASFAS",arguments)
    it(err).ok()
    it(db).equal(null)
    test.done()
  })
}
*/
exports ['database exists'] = function (test){

  init(dbname,{host:'localhost', port:5984}).ready(function (err,db){
    it(err).equal(null)
    it(db).ok()
    db.exists(function (err,exists){
      it(err).equal(null)
      it(exists).equal(exists)
        test.done()
    })
  })
}

exports ['database returned'] = function (test){

  var returned = 
  init(dbname,{host:'localhost', port:5984}).ready(function (err,db){
    it(err).equal(null)
    it(db).ok()
    it(returned).equal(db)
    test.done()
  })
}

exports ['intialize views'] = function (test){
  var map, reduce
  init(dbname,{host:'localhost', port:5984})
  .view('group/item', map = function (doc){
    emit(1,"HELLO")
  }, reduce = function (keys,values){
  
  })  
  .ready(function (err,db){
    it(err).equal(null)
    it(db).ok()
    //test.done()
    db.get('_design/group', function (err,data){
      it(err).equal(null)
      console.log(data)
      it(data).has({
        views: {
          item: {
            map: it.equal(map.toString()),
            reduce: it.equal(reduce.toString())
          }
        }
      })
      test.done()
    })
  })
}