/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/

var Class = require('../../../common/class'),
	sanitize = require('validator').sanitize,
	_ = require('underscore'),
	log = require('util').log,
	unidecode = require('unidecode');

// Now declare some objects and variables
var dictionaries = {};

var abuseList = [];
function abuseTemplate() { // Template for abuse unit
	var nowTime = (new Date()).getTime() / 1000;
	return {
		firstTime: nowTime,
		lastTime: nowTime,
		counter: 1,
		funnyActive: 0,
		hasBeenWarned: 0
	};
}

// The time in seconds for the badword actions
var funnyRandom = 10; // Replace unit message with random funny scentence 
var resetTime = 60; // Time te reset counter

// The number of badwords within resetTime before -> warn, seriuswarn, ban
var warnCount = 5;


// Load the badwords dictionary
dictionaries.badwords = require('./lib/badwords.js');

// Load the random message dictionary
dictionaries.funnyRandom = require('./lib/funnyRandoms.js');

function detectBadwords(message, dictionaries) {
	var wordHit = 0;
	_.each(dictionaries.badwords, function(rxp, key) {
		// Test each word for a match
		if(message.match(rxp)) {
			wordHit = 1;
		}
	});
	return wordHit;
}



function addUnitToList(unit) { // Adds the unit to the list.
	var nowTime = (new Date()).getTime() / 1000;
	if(abuseList[unit.name] === undefined) { // resetTime has expired or unit is not on the list
           abuseList[unit.name] = abuseTemplate();
	} else { // Unit is on the list
		if((nowTime - abuseList[unit.name].lastTime) > resetTime) { // reset time expired
			abuseList[unit.name] = abuseTemplate();
		} else { // unit is pushing it
			abuseList[unit.name].counter++;
			abuseList[unit.name].lastTime = nowTime;
			if((nowTime - abuseList[unit.name].firstTime) > funnyRandom) { // Funny random message is triggered
				abuseList[unit.name].funnyActive = 1;
			}
		}
	}

	console.log('Abuse list ' + unit.name + ' -> ' + abuseList[unit.name].firstTime);
	return abuseList[unit.name];
}

function filterBadwords(unit, message, dictionaries) {
	// unidecode the message to get ASCCI
	message = unidecode(message);

	var wordHits = [];

	_.each(dictionaries.badwords, function(rxp, key) {
		// Test each word for a match
		if(message.match(rxp)) {
			wordHits.push(key);
		}
	});

	if(wordHits.length === 0) { // No bad words are found
		return message;
	} else { // nasty things are being said
		// Need to add ifcase so the production server doesn't log that much
		console.log('Ironbot badwords (' + unit.name + '): ' + wordHits.join());
		var badUnit = addUnitToList(unit);
		if(badUnit.funnyActive) { // Return random funny message instead of real message
			var keys = Object.keys(dictionaries.funnyRandom);
			message = dictionaries.funnyRandom[keys[~~(Math.random()*(keys.length))]];
		}

		if(badUnit.counter >= warnCount) { // Warn unit
			switch(badUnit.counter){
				case 5:
					// Implement lightwarn
				break;

				case 5:
					// Implement serius warn
				break;

				case 5:
					// Implement kick or ban
				break;

				default:
					// Nothing
				break;
			}
		}
		return message;
	}
}

// Function to detect a bad word for use in charcter creation
exports.detectBadwords = function(message) {
	return detectBadwords(message, dictionaries);
}

exports.filterBadwords = function(unit, message) {
	return filterBadwords(unit, message, dictionaries);
}

