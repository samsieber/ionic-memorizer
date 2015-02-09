angular.module("memorize.services",[])
.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])
.service('setBackState', function($ionicHistory){
  return function(stateName){
    var historyId = $ionicHistory.currentHistoryId();
    var history = $ionicHistory.viewHistory().histories[historyId];
    var view
    for (var i = history.stack.length - 1; i >= 0; i--){
      if (history.stack[i].stateName == stateName){
        $ionicHistory.backView(history.stack[i]);
        return;
      }
    }
  }
})
.service("Utils", function(){
	// shuffle taken from http://bost.ocks.org/mike/shuffle/
	function shuffle(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle…
	  while (m) {

	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	}
	function straightArray(value){
		var arr = [];
		for (var i=0; i < value; i++){
			arr.push(i);
		}
		return arr;
	}
	function randBoolean(rand,total){
		var i = 0;
		var arr = [];
		for (; i<rand; i++){
			arr.push(true);
			console.log(i,rand)
		}
		for (; i<total; i++){
			console.log(i,total)
			arr.push(false);
		}
		return shuffle(arr);
	}
	function zipListsToObject(objConfig){
		var arr = [];
		var types = [];
		var configs = [];
		for (var property in objConfig) {
		    if (objConfig.hasOwnProperty(property)) {
		        configs.push({key:property,values:objConfig[property]});
		    }
		}
		configs[0].values.forEach(function(config){
			arr.push({});
		});
		configs.forEach(function(config){
			config.values.forEach(function(value, i){
				arr[i][config.key] = value;
			})
		});
		return arr;
	}
	function project(attr){
		return function(obj){
			return obj[attr];
		}
	}
	function projection(attrList, source, includeUndefined){
		var obj = {};
		attrList.forEach(function(value){
			if (source[value]!==undefined || includeUndefined)
				obj[value] = source[value];
		})
		console.log(obj,"asdfasdasdf");	
		return obj;
	}
	return {
		shuffle:shuffle,
		randBoolean:randBoolean,
		zipListsToObject:zipListsToObject,
		straightArray:straightArray,
		projection:projection
	}

})
.filter("plural",function(){
	return function(number, singular, plural, none, verb){
		var str;
		if (number == 0)
			str = none + " " + verb
		else if (number == 1)
			str = verb + " " + 1 + " " + singular
		else 
			str = verb + " " + number + " " + plural
		return str;
	}
})
.filter("capitalize_first",function(){
	return function(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
})
.service("Texts",function($q, $localStorage, Utils){
	var storageKey = 'textData';
	
	function Texts(){
		this.nextID=0;
		this.texts=[];
		this.history = [];
		this.created = new Date();
	};

	Texts.prototype.updated = function(){
    	$localStorage.setObject(storageKey, Utils.projection(['nextID', 'texts'], this));
    };
    Texts.prototype.restore = function(){
    	console.log($localStorage.getObject(storageKey));
    	angular.extend(this, $localStorage.getObject(storageKey));
    	this.texts.forEach(function(text){
    		if (!text.history){
    			text.history = []
    		}
    		if (!text.created){
    			text.created = new Date();
    		}
    		text.history = text.history.map(function(dateString){
    			return new Date(dateString);
    		})
    	})
    	return this;
    };
    Texts.prototype.memorized = function(text){
    	text.history.push(new Date());
    	this.updated();
    }

    Texts.prototype.addText = function(text){
		this.nextID+=1;
		this.texts.push(text);
		this.updated();
	};
	Texts.prototype.removeText = function(index){
      this.texts.splice(index,1);
      this.updated();
      console.log("DONE!")
	}
	Texts.prototype.newText = function(){
		return {
			id:this.nextID,
			history:[],
			created:new Date()
		}
	};
	Texts.prototype.all = function(){
		return angular.extend([],this.texts);
	};
	Texts.prototype.getText = function(id){
      var dfd = $q.defer();
      this.texts.forEach(function(text) {
        if (text.id == id) dfd.resolve(text);
      })
      return dfd.promise;
	}
	return new Texts().restore();
});
