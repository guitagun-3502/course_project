function(){	
	'use strict';
	window.LocalStorage = function LocalStorage(appKey){
		appKey = appKey || '';
		var localStorage = window.localStorage;

		this.set = function(key, value){
			var uniqKey = buildKey(key);

			Object.defineProperty(this, key, 
				{	
					configurable: true, 
					enumerable: true, 
					get: function(){
						return JSON.parse(localStorage.getItem(uniqKey));
					},
					set: function(newValue){
						localStorage.setItem(uniqKey, JSON.stringify(newValue))
					}
				});

			this[key] = value;
		}

		this.get = function(key){
			return localStorage.getItem(buildKey(key));
		}

		function buildKey(key){
			key = appKey + key;
			return key;
		}
	}
})();

