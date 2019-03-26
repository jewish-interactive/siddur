var v = 1;

if (window['isIE']) {
	alert('This is an HTML5 app and requires a modern browser like Chrome, Firefox, or Internet Explorer 10');
	throw "stop execution";
}

function resizeApp() {
	var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
	//d.getElementById('app').style.height = y + 'px';
	var appWidth = document.getElementById('contentArea').offsetWidth;
	document.getElementById('contentArea').style.height = (0.68 * appWidth) + 'px';
}

resizeApp();

window.onresize = resizeApp;

/*
 * main glossary module
 */

var app = angular.module('app', ['ngRoute']).config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
	$routeProvider.when('/:env/', {
		controller : "appCtrl"
	}).when('/:env/word/:word', {
		controller : "appCtrl"
	}).otherwise({
		redirectTo : '/'
	});
	$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('!');
}]).filter('newlines', function() {
	return function(text) {
		return text.split(/\n/g);
	};
}).controller("appCtrl", ['$scope', '$timeout', '$route', '$routeParams', '$timeout',
function($scope, $timeout, $route, $routeParams, $timeout) {
	/*
	 * Blessings controller logic here
	 */
	$scope.isApp = false;
	$scope.previousPrayers = false;
	$scope.data = window.appData;
	$scope.prayer =  {
            "titlehebrew": "",
            "titleenglish": "",
            "texthebrew": "",
            "soundfile": ""
       };
	$scope.grades = [];
	_.each($scope.data, function(d, i) {
		_.each(d, function(p) {
			p.soundfileVar = 'resources/sounds/' + p.soundfile;
			p.songfileVar = 'resources/sounds/' + p.songfile;
		});
		$scope.grades.push(i);
	});

	$scope.previousGrades = function() {
		var a = [];
		var i = parseInt($scope.activeGrade);
		for (i; i > 0; i--) {
			a.push(i);
		}
		return a;
	};
	$scope.off = false;
	$scope.lan = 's';
	$scope.env = 'web';
	$scope.backUrl = {
		web : '/blessings',
		app : 'http://close-me-now'
	};

	$scope.setGrade = function(g) {
		$scope.activeGrade = g;
		$scope.previousPrayers = false;
		$scope.openMenu = false;
	};

	$scope.setPrayer = function(p) {
		$scope.prayer = p;
	};
	
	$scope.stopAudios = function() {
		_.each($scope.data, function(d, i) {
			_.each(d, function(p) {
				p.playing = false;
				p.playingSong = false;
				if (document.getElementById('audio' + p.soundfile)) {
					document.getElementById('audio' + p.soundfile).pause();
					if (document.getElementById('audio' + p.soundfile).currentTime != 0) {
						document.getElementById('audio' + p.soundfile).currentTime = 0;
					}
				}
				if (document.getElementById('audio' + p.songfile)) {
					document.getElementById('audio' + p.songfile).pause();
					if (document.getElementById('audio' + p.songfile).currentTime != 0) {
						document.getElementById('audio' + p.songfile).currentTime = 0;
					}
				}
			});
		});

	};
	$scope.pause = function(s) {
		$scope.stopAudios();
	};
	
	$scope.pauseSong = function(s) {
		$scope.stopAudios();
	};
	
	$scope.togglePlay = function(s){
		if(s.playing){
			$scope.pause(s);
		}else{
			$scope.play(s);
		}
	};
	
	$scope.togglePlaySong = function(s){
		if(s.playing){
			$scope.pauseSong(s);
		}else{
			$scope.playSong(s);
		}
	};
	
	$scope.play = function(s) {
		$scope.stopAudios();
		s.playing = true;
		document.getElementById('audio' + s.soundfile).play();
	};
	
	$scope.playSong = function(s) {
		$scope.stopAudios();
		s.playingSong = true;
		document.getElementById('audio' + s.songfile).play();
	};
}]);
