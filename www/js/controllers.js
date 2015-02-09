angular.module('memorize.controllers', ['memorize.services', 'angularMoment'])
.controller('MemorizeCtrl',function($scope, text, Texts, Utils, setBackState, $ionicHistory){
	setBackState('home');
	$scope.text = text;
	var words = $scope.text.content.split(" ");
	$scope.disp = {
		objs:Utils.zipListsToObject({
			word:words, 
			show:Utils.shuffle(Utils.straightArray(words.length))}),
		max:words.length,
		curr:words.length,
		text:"",
		updated:function(){
			var disp = this;
			console.log(disp);
			this.text = this.objs.map(function(obj){
				return (obj.show < disp.curr) ? obj.word : obj.word[0];
			}).join(" ");
		}
	}
	$scope.memorized = function(){
		Texts.memorized($scope.text);
		$ionicHistory.goBack();
	}
	$scope.disp.updated();
})
.controller('AddCtrl',function($scope, text, saveText, $state, $ionicHistory){
	$scope.text = text;

	function attemptAdd(){
		if (!$scope.text.title){
			alert("Please put in a title");
			return false;
		} else if (!$scope.text.content) {
			alert("Please put in some text");
			return false;
		} else {
			console.log($scope.text);
			saveText($scope.text);
			return true;
		}
	};
	$scope.addText = function(){
		if (attemptAdd()){
			$ionicHistory.goBack();
		}
	}
	$scope.addAndGo = function(){
		if (attemptAdd()){
			$ionicHistory.goBack();
			$state.go('memorize',{textID:$scope.text.id})
		}
	}
})

.controller('HomeCtrl',function($scope, $state, texts, removeText){
	$scope.texts = texts();
	$scope.removeText = function(index){
		removeText(index);
		$scope.texts.splice(index,1);
	}
	$scope.memorize = function(text){
		$state.go("memorize",{textID:text.id});
	}
	$scope.history = function(text){
		$state.go("history",{textID:text.id});
	}
})

.controller('HistoryCtrl',function($scope, text){
	$scope.text = {
		created: text.created,
		history: text.history.map(function(o){return o}).reverse()
	};
})


.controller('DebugCtrl',function($scope, $state, texts, removeText){
	$scope.texts = texts();
	console.log("here");
	$scope.content = JSON.stringify($scope.texts);
})