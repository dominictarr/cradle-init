
var cradle = require('cradle')

function Setup (name, config){
  if(!(this instanceof Setup)) return new Setup(name,config)

  config = config || {cache:true, raw: true}
  config.host = config.host || 'http://localhost'
  config.port = config.port || 5984
  
  var db = new(cradle.Connection)(config.host,config.port,config).database(name)
    , self = this
  this.views = {}

  this.view = function (name,map,reduce){
    name = name.split('/')
    var id = '_design/' + name[0]
      , view = this.views[id] || {_id: id, views: {}}
    view.views[name[1]] = {
      map: map,
      reduce: reduce
    }
    this.views[id] = view
    return this
  } 
  function updateViews (exists,callback){
    var ids = Object.keys(self.views)

    db.get(ids,function (err,data){
      data.__proto__ = Array.prototype
      data.forEach(function (e){
        if(self.views[e._id])
          self.views[e._id]._rev = e._rev
      })
      db.save(ids.map(function (e){
        return self.views[e]
      }),function (err){ callback(err,db) })
    })

  }
  this.ready = function(callback){
    db.exists(function (err,exists){
    console.log('does couchdb "' + name + '" exist?', exists)
      if(err)
        callback(err)//probably that there is no couchdb running at host:port
      if(exists){
        //check to update views.
        updateViews(exists,callback)
      } else {
        db.create(function(err,ok){
          console.log('couchdb "' + name + '" created')
          //create views
          if(err)
            return callback(err)
          updateViews(exists,callback)
        })
      }
    })
    return db
  }
}

module.exports = Setup

if(!module.parent){
  Setup('test').ready(console.log)
}