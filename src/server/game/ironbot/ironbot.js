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

// Include underscore so we can use all of its nifty functions
var _  = require('underscore');

// Include unidecode lib so we can translate all charcters to ascii
var unidecode = require('unidecode');

// Now declare some objects and variables
var dictionaries = {};

// Load the badwords dictionary
dictionaries.badwords = require('./lib/badwords.js');

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

