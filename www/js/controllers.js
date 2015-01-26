angular.module('memorize.controllers', ['memorize.services'])
.controller('MemorizeCtrl',function($scope, text, Utils, setBackState){
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
		console.log("here");
		removeText(index);
		console.log($scope.texts);
	}
	$scope.memorize = function(text){
		console.log("I'm a here!");
		console.log(text.id);
		$state.go("memorize",{textID:text.id});
		console.log("Wheee!!!");
	}
	$scope.toggleDelete = function(){
		$scope.shouldShowDelete = !$scope.shouldShowDelete;
		$scope.deleteButtonText = $scope.shouldShowDelete ? "Done Removing" : 'Remove Text';
	}
	$scope.shouldShowDelete = true;
	$scope.toggleDelete();
})