
// Remove newlines and tabs

String.prototype.smoosh = function(){
	return this.replace(/(\r\n+|\n+|\r+|\t+)/gm,'');
}


// Turn a string into what I commonly use as hash/object keys

String.prototype.keyMe = function(){
	return this.toLowerCase().replace(' ','_');
}


// Retrieve the last integer in a string

String.prototype.lastInt = function(){
	return parseInt(this.replace(/.*?(\d+)[^\d]*$/,'$1'));
}


// Ultra simple templating system

String.prototype.template = function( _map ){
	return this.replace(/{([^{}]*)}/g,
		function ( a, b ){
			var key = b.alphaOnly();
			var r = undefined;
			if ( _map != undefined && key in _map ){
				r = _map[ key ];
			}
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
}


// Ultra simple templating system

String.prototype.escapeHtml = function(){
	var map ={ '&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;' };
	return this.replace( /[&<>]/g, function(c){
		return map[c];
	});
}


// Breakup string at spaces respecting quotes
// and save the substrings in an array, 
// so they can be interpreted shell style.

// @return{ array }

String.prototype.shellArgs = function(){
	if  ( this == '' ){
		return [];
	}
	var matches = this.match( /('.*?'|".*?"|[^"\s]+)/g );
	for ( var i=0; i<matches.length; i++ ){
		matches[i] = matches[i].replace( /^"|"$|^'|'$/g, "")
	}
	return matches;
}


// Splice in a string at a specified index

// @param{ string } _string
// @param{ int } _index The position in the string

String.prototype.splice = function( _string, _index ){
	return ( this.slice( 0, Math.abs( _index ) ) + _string + this.slice( Math.abs( _index )));
}


// Remove white-space between HTML elements

String.prototype.noSpaceHtml = function(){
	var r = this.replace(/\n/g, '');
	r = r.replace(/[\t ]+\</g, '<');
	r = r.replace(/\>[\t ]+\</g, '><');
	r = r.replace(/\>[\t ]+$/g, '>');
	return r;
}


// Strip html tags

String.prototype.stripTags = function(){
	return this.replace(/<\/?[^>]+(>|$)/g, '' );
}


// Turn a CITE URN to / delimited path

String.prototype.urnToPath = function(){
	var len = this.length;
	var s = this;
	if ( s.substring( 0, 1 ) == '<' ){
		s = s.substring( 1, len-1 );
	}
	if ( s.substring( len-1, 1 ) == '>' ){
		s = s.substring( 0, len-2 );
	}
	s = s.replace( /:/g, '/' );
	s = s.replace( /\./g, '/' );
	return s;
}


// Turn a delimited path to a CITE URN

String.prototype.pathToUrn = function( last_dot ){
	var len = this.length;
	var s = this;
	s = s.replace( /\//g, ':' );
	if ( last_dot == true ){
		var p = s.lastIndexOf(':');
		s = s.substring(0,p) + '.' + s.substring(p+1);
	}
	return s;
}


// Remove extra spaces

String.prototype.oneSpace = function(){
	return this.replace(/\s{2,}/g, ' ');
}


// Alpha-numeric and spaces only

String.prototype.alphaSpaceOnly = function(){
	return this.replace(/[^\w\s]/gi, '');
}


// Alpha-numeric characters only

String.prototype.alphaOnly = function(){
	return this.replace(/[^\w]/gi, '');
}


// Capitalize the first letter of a string

String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
}


// Repeat a string n times

// @param{string} _n How many times you want to repeat a string

String.prototype.repeat = function( _n ){
	return new Array( _n + 1 ).join( this );
}


// Count the occurences of a string in a larger string

// @parm{string} _sub : The search string
// @param{boolean} _overlap : Optional. Default: false
// @return{int} : The count

String.prototype.occurs = function( _search, _overlap ){
	var string = this;
	
	//  If _search is null just return a char count
	
	if ( _search == undefined ){
		return string.length;
	}
	
	//  Make sure _search is a string
	
	_search+="";
	
	//  If no search term is past just return a character count
	
	if ( _search.length <= 0 ){
		return string.length;
	}
	
	//  Otherwise start counting.
	
	var n=0;
	var pos=0;
	var step = ( _overlap ) ? 1 : _search.length;
	while ( true ){
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ){
			n++;
			pos += step;
		}
		else{
			break;
		}
	}
	return n;
}


// Find the positions of occurences of a substring

// @parm{string} _sub : The search string
// @param{boolean} _overlap : Optional. Default--false.
// @param{boolean} _ignoreXML : Optional. Check to see if string is inside XML/HTML element.
// @param{boolean} _onlyWords : Optional. Make sure string is a discrete word.
// @return{Array} : An array of integers.

String.prototype.positions = function( _search, _overlap, _ignoreXML, _onlyWords ){

	var string = this;

	//  Make sure _search is a string

	_search+="";

	//  Otherwise start counting.

	var pos=0;

	//  String overlapping allowed?

	var step = ( _overlap ) ? 1 : _search.length;
	var p = [];
	while ( true ){
		var ok = true;
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ){

			//  Ignore if search string was found within an XML/HTML tag
			
			if ( _ignoreXML == true ){
				for ( var i=pos; i<string.length; i++ ){
					if ( string[i] == '<' ){
						break;
					}
					if ( string[i] == '>' ){
						ok = false;
					}
				}
			}

			//  Check to see if search string is an isolated word
			
			if ( _onlyWords == true ){
				if ( string.substr((pos-1),(pos+_search.length+1)).isAlphaNum() == true ){
					ok = false;
				}
			}

			//  If everything is good
			
			if ( ok == true ){
				p.push( pos );
			}
			pos += step;
		}
		else{
			break;
		}
	}
	return p;
}


// Insert a substring at a particular index

// @return{ string } The modified string

String.prototype.insertAt = function( _index, _string ){
	return this.substr( 0, _index) + _string + this.substr( _index );
}


// Turn a string with HTTP GET style parameters to an object

// @return{ obj } A collection of keys and values

String.prototype.params = function(){
	var arr = this.split('?');
	var get = arr[1];
	arr = get.split('&');
	var out ={};
	for ( var i=0, ii=arr.length; i<ii; i++ ){
		if ( arr[i] != undefined ){
			var pair = arr[i].split('=');
			out[ pair[0] ] = pair[1];
		}
	}
	return out;
}


// Turn underscores to camel case
// @return{ string }

String.prototype.toCamel = function(){
	return this.replace( /(\_[a-z])/g, function( $1 ){
		return $1.toUpperCase().replace('_','');
	});
}


// Check for the existence of an upper-case letter

// @return{ boolean }

String.prototype.hasUpper = function(){
	return /[A-Z]/.test( this );
}


// Create a word frequency report object

// @return{ obj } Report object

String.prototype.report = function(){
	var words = this.toLowerCase().split(' ');
	var stats ={};
	for ( var i=0, ii=words.length; i<ii; i++ ){
		var word = words[i];
		if ( ! ( word in stats ) ){
			stats[word] = 1;
		}
		else{
			stats[word] += 1;
		}
	}
	return stats;
}


// Position of the last slash in a string

String.prototype.lastslash = function(){
	return this.lastIndexOf('/')
}


// Get a directory name from a string

String.prototype.dirname = function(){
	return this.substring( 0, this.lastslash()+1 )
}


// Retrieve the "basename" the filename basically

String.prototype.basename = function(){
	return this.substring( this.lastslash()+1, this.length )
}


// Divide text into an array of lines by splitting on linebreaks

// @return{ array } An array of lines

String.prototype.lines = function(){
	return this.split("\n");
}


// Check to see if string is composed of only alphanumeric characters

// @return{ boolean }

String.prototype.isAlphaNum = function(){
	if ( /[^a-zA-Z0-9]/.test( this ) ){
		return false;
	}
	return true;
}


// Return a string in preferred

// @return{ boolean }

String.prototype.file_name = function(){
	return this.toLowerCase().replace( /[^a-z0-9]/g, '_' );
}

   
// Divide text into an array of individual sentences
// This is English-centric.  Forgive me.
   
// @return{ array } An array of sentences

String.prototype.sentences = function(){
	var check = this.match( /[^\.!\?]+[\.!\?]+/g );
	
	//  Make sure characters aren't used for purposes other than
	//  sentences.

	var vowels = [ 'a','e','i','o','u','y' ];
	var out = [];
	var carry = '';
	for ( var i=0; i<check.length; i++ ){
		
		//  Clean up.

		var strCheck = carry + check[i];
		carry = '';
		
		//  Check for the existence of a vowel, so we aren't
		//  accidentally thinking part of an abbreviation is its
		//  own sentence.

		var merge = true;
		for ( var j=0; j<vowels.length; j++ ){
			if ( strCheck.indexOf( vowels[j] ) != -1 ){
				merge = false;
				break;
			}
		}
		
		//  Also check for a capital letter on the first word.  
		//  Most sentences have those too.
		
		var capTest = strCheck.trim();
		if ( ! capTest[0].hasUpper() ){
			merge = true;
		}
		
		//  If no vowel exists in the sentence you're probably
		//  dealing with an abbreviation.  Merge with last sentence.  
		
		if ( merge ){
			if ( out.length > 0 ){
				out[ out.length-1 ] += strCheck;
			}
			else{
				carry = strCheck;
			}
			continue;
		}
		
		//  Prepare output.

		out.push( strCheck.smoosh().trim() );
	}
	return out;
}



// Get a quality timestamp
// @requires datejs ../third_party/datejs.date.js [ http://www.datejs.com/ ]
// @requires StringExt.js

function TimeStamp(){}

TimeStamp.prototype.xsd = function(){
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = ('0' + (d.getMonth()+1)).slice(-2);
	var dd = ('0' + d.getDate()).slice(-2);
	var hh = d.getHours();
	var min = ('0' + d.getMinutes()).slice(-2);
	var sec = ('0' + d.getSeconds()).slice(-2);
	var diff = d.getTimezoneOffset();
	
	var time = yyyy+'-'+mm+'-'+dd+' '+hh+":"+min+":"+sec+' ';
	if ( diff > 0 ) {
		time = time+"+"+this.pad( 4, diff );
	}
	else {
		time = time+"-"+this.pad( 4, diff );
	}
	return time;
}

// Pad a number

TimeStamp.prototype.pad = function( n, num ){
	if ( num <= parseInt('9'.repeat(n) )){ 
		num = ('0'.repeat(n-1)+num).slice(-n); 
	}
	  return num;
}


// Return a timestamp with a UTC offset

// @param { boolean } _milli include milliseconds
// @return { string } timestamp with UTC offset

TimeStamp.prototype.withUtc = function( _milli ){
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = ('0' + (d.getMonth()+1)).slice(-2);
	var dd = ('0' + d.getDate()).slice(-2);
	var hh = d.getHours();
	var min = ('0' + d.getMinutes()).slice(-2);
	var sec = ('0' + d.getSeconds()).slice(-2);
	var mil = ('0' + d.getMilliseconds()).slice(-3);
	var diff = d.getTimezoneOffset();
	
	//  Include milliseconds?

	var time = '';
	if ( _milli ) {
		time = yyyy+'-'+mm+'-'+dd+'T'+hh+":"+min+":"+sec+":"+mil+"UTC";
	}
	else {
		time = yyyy+'-'+mm+'-'+dd+'T'+hh+":"+min+":"+sec+"UTC";		
	}
	
	//  Get the timezone offset
	
	if ( diff > 0 ) {
		time = time+"+"+diff;
	}
	else {
		time = time+"-"+diff;
	}
	return time;
}


// Return the time of day
   
// @return { String } Easily understood time of day

TimeStamp.prototype.timeOfDay = function(){
	var d = new Date();
	var hh = d.getHours();
	var min = ('0' + d.getMinutes()).slice(-2);
	var dd = "AM";
	if ( hh > 12 ) {
		hh = hh-12;
		dd = "PM";
	}
	hh = ( hh == 0 ) ? 12 : hh;
	return hh+":"+min+" "+dd;
}


// Return unix time

// @return { int } unix time

TimeStamp.prototype.unix = function(){
	return new Date().getTime();
}


// Return millisecond unix time from UTC string
   
// @param { string } _string timestamp with UTC offset
// @return { int } unix time

TimeStamp.prototype.toUnix = function( _string ){
	
	// Kill the UTC offset

	var cleanTime = _string.replace( /UTC.*/, '' );
	var milli = 0;

	// Grab the milliseconds if they exist

	if ( cleanTime.match( /:\d{3}/ ) ) {
		milli = cleanTime.slice( -4 );
		cleanTime = cleanTime.replace( /:\d+$/, '' );
		milli = parseInt( milli.replace(':','') );
	}
	return Date.parse( cleanTime ).getTime() + milli;
}


/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){console.log('isDST');return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};



var app = angular.module('app',[
'ngRoute',
'appControllers',
'appDirectives',
'angularFileUpload',
'minicolors'
]);


app.service( 'config', [ 'host', function( host ){
return({
    
    serv: {
      
      user: {
        
        // URL to Perseids user data object
        
        ping: 'dev/ping.js'
        //ping: 'http://sosol.perseids.org/sosol/dmm_api/ping'
      },
      
      urn_serv: {
        
        // CITE URN and namespace
        
        base: 'urn:cite:perseus:'
      },
      
      prefix: {}
      
    },
    xhr: {
      sparql: {
        
        // URL to SPARQL query endpoint
				
				url: 'http://localhost:4321/ds/query'
        //url: 'http://services.perseids.org/fuseki/ds/query'
				
      },
      
      json: {
        
        // URL to JackSON server
				
				url: 'http://localhost:4567'
        //url: 'http://www.perseids.org/jackson',
        
      },
			
			tmpl: {
				url: 'http://localhost:4567/apps/imgcollect/json_ld'
			}
			
    },
    imgup: {
			
			url: 'http://localhost:1234'
      //url: 'http://www.perseids.org/imgup/upload'
			
    },
		ontology: {
		  imgViewer: {
		    term: "imageViewer",
		    ns: "http://data.perseus.org/rdfvocab/cite/",
		    prefix: "citex"
		  },
		  imgServer: {
		    term: "imageServer",
		    ns: "http://data.perseus.org/rdfvocab/cite/",
		    prefix: "citex"
		  },
		  label:  {
		     term: "label",
		     ns: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		     prefix: "rdf"
		  },
		  description: {
		     term: "description",
		     ns: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		     prefix: "rdf"
		  }, 
		  type: {
		     term: "type",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  src: {
		     term: "references",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  orig:  {
		     term: "orig",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  owner: {
		     term: "publisher",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  creator: {
		     term: "creator",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
			identifier: {
				term: "dct:identifier",
	     ns: "http://purl.org/dc/terms/",
	     prefix: "dct"
			},
		  contributor: {
		     term: "contributor",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  created: {
		     term: "created",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  modified: {
		     term: "modified",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  width: {
		     term: "width",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  height: {
		     term: "height",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  x: {
		     term: "x",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  y: {
		     term: "y",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  subject: {
		     term: "subject",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  memberOf: {
		     term: "belongsTo",
		     ns: "http://www.homermultitext.org/cite/rdf/",
		     prefix: "cite"
		  },
		  represents: {
		     term: "P138_represents",
		     ns: "http://www.cidoc-crm.org/cidoc-crm/",
		     prefix: "crm"
		  },
		  rights: {
		     term: "license",
		     ns: "http://www.homermultitext.org/cite/rdf/",
		     prefix: "cite",
		     default_value: "http://creativecommons.org/licenses/by-nc-sa/4.0/"
		  }
		},
		
		// Config user access
		
		access: {
			public_views: [ '/view' ],
			logged_in: '/upload',
			logged_out: '/login'
		}
  })
}])



app.service( 'host', [ 
function() {
  
  return({
    url: location.protocol+'//'+location.hostname+( location.port ? ':' + location.port : '' )
  });
  
}]);


app.config([
'$routeProvider',
function( $routeProvider ) {
  
  // uploads
  
  $routeProvider.
  when('/uploads', {
    templateUrl: 'html/upload/list.html',
    controller: 'UploadListCtrl'
  }).
  when('/uploads/:page', {
    templateUrl: 'html/upload/list.html',
    controller: 'UploadListCtrl'
  }).
  when('/upload/:urn', {
    templateUrl: 'html/upload/edit.html',
    controller: 'UploadCtrl'
  }).
  when('/new/upload', {
    templateUrl: 'html/upload/new.html',
    controller: 'UploadNew'
  }).
  when('/new_2/upload', {
    templateUrl: 'html/upload/new_2.html',
    controller: 'UploadNew2'
  }).
  otherwise({
    redirectTo: '/uploads'
  });
  
  
  // items
  
  $routeProvider.
  when('/items', {
    templateUrl: 'html/item/list.html',
    controller: 'ItemListCtrl'
  }).
  when('/items/:page', {
    templateUrl: 'html/item/list.html',
    controller: 'ItemListCtrl'
  }).
  when('/item/:urn', {
    templateUrl: 'html/item/edit.html',
    controller: 'ItemCtrl'
  }).
  when('/new/item/:urn', {
    templateUrl: 'html/item/new.html',
    controller: 'ItemNew'
  });
  
  
  // collections
  
  $routeProvider.
  when('/collections', {
    templateUrl: 'html/collection/list.html',
    controller: 'CollectionListCtrl'
  }).
  when('/collections/:page', {
    templateUrl: 'html/collection/list.html',
    controller: 'CollectionListCtrl'
  }).
  when('/collection/:urn', {
    templateUrl: 'html/collection/edit.html',
    controller: 'CollectionCtrl'
  }).
  when('/new/collection', {
    templateUrl: 'html/collection/new.html',
    controller: 'CollectionNew'
  });
  
  
  // roi search
  
  $routeProvider.
  when('/roi/search', {
    templateUrl: 'html/roi/search.html',
    controller: 'RoiSearch'
  });
  
  
  // resize
  
  $routeProvider.
  when('/resize/:urn', {
    templateUrl: 'html/resize.html',
    controller: 'ResizeCtrl'
  });
  
  
  // login
  
  $routeProvider.
  when('/login', {
    templateUrl: 'html/login.html',
    controller: 'LoginCtrl'
  });
  
  
  // view
  
  $routeProvider.
  when('/view/:urn', {
    templateUrl: 'html/view.html',
    controller: 'ViewCtrl'
  });
  
  
  // deleter
  
  $routeProvider.
  when('/delete/:urn', {
    templateUrl: 'html/delete.html',
    controller: 'DeleteCtrl'
  }).
  when('/delete', {
    templateUrl: 'html/pre_delete.html',
    controller: 'PreDeleteCtrl'
  });
  
  
  // imgspect
  
  $routeProvider.
  when('/imgspect/:urn', {
    templateUrl: 'html/imgspect.html',
    controller: 'imgspect'
  });
  
}])
.run([
'$rootScope',
'$location',
'user',
'config',
function( $rootScope, $location, user, config ){
  
  // Some views are public
  
  function public_view(){
    var path = $location.path();
    var pub = config.access.public_views;
    for( var i=0; i<pub.length; i++ ){
      if ( path.indexOf( pub[i] ) == 0 ){
        return true
      }
    }
  }
  
  // If a user is logged-in they don't need to see the login view
  
  function logged_in(){
    var path = $location.path();
    if ( path.indexOf( config.access.logged_out ) == 0 ){
      $location.path( config.access.logged_in )
    }
  }
  
  // Run everytime scope changes
  
  $rootScope.$on( '$routeChangeSuccess', function(){
    
    // Check for user data.
    
    user.check().then(

      // All is well
      
      function(){
        logged_in();
        $rootScope.$emit( user.events.ok );
      },
      
      // User is not logged in
      
      function(){
        if ( public_view() == true ){
          return;
        }
        $rootScope.$emit( user.events.error );
        $location.path( config.access.logged_out );
      }
    
  );
})
}]);  // close app.config



var appControllers = angular.module('appControllers',[]);


// annotations

appControllers.controller( 'AnnotationListCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
'onto',
function( $scope, $injector, user, $rootScope, onto ){
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    $scope.type = "annotation";
    $scope.title = "Annotation List";
    $scope.keys = [ 'urn','label','desc','user','time' ];
	  
	  var label = onto.with_prefix('label');  
	  var desc = onto.with_prefix('description');
				  
    $injector.invoke( ListCtrl, this, { $scope: $scope } );
    $scope.init([label,desc]);
    
    // The fields you allow users to filter
    // are set with object keys in $scope.filter
    //
    // See lib/list_ctr.js: filter()
    
    $scope.filter = {};
    $scope.filter[label] = null;
    $scope.filter[desc] = null;
    
    // Applying the filter is the same as initializing..
    
    $scope.apply_filter = function(){
      $injector.invoke( ListCtrl, this, { $scope: $scope } );
      $scope.init([label,desc]);
    }
  }
  
}]);


// collection/:urn

appControllers.controller( 'CollectionCtrl', [ 
'$scope',
'$injector',
'user',
'$rootScope',
'onto',
'collection',
function( $scope, $injector, user, $rootScope, onto, collection ){
  
  $scope.title = "Collection";
	$scope.keys = [ 'urn','label','desc','user','time' ];

  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var keyword = onto.with_prefix('subject');
  var imgViewer = onto.with_prefix('imgViewer');
  var imgServer = onto.with_prefix('imgServer');

  $scope.form = {};
  $scope.form[label] = '';
  $scope.form[desc] = '';
  $scope.form[keyword] = [];
  $scope.form[imgServer] = '';
  $scope.form[imgViewer] = '';
  
  // Run after user has been authorized
  
  $rootScope.$on( user.events.ok, function(){ go() });
  function go(){
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    $scope.init([ label, desc, imgServer,imgViewer ]);
    
    // Retrieve Collection Items
  
    collection.items( $scope.urn ).then(
    function( data ){ 
			$scope.items = data;
		});
  }
	
}]);


// collections

appControllers.controller( 'CollectionListCtrl', [
'$scope',
'$injector',
'$rootScope',
'$routeParams',
'user',
'onto',
'query',
function( $scope, $injector, $rootScope, $routeParams, user, onto, query ){
  $scope.type = "collection";
  $scope.keys = [ 'urn','label','desc','user','time' ];
	$scope.limit = 10;
  $scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );

  // The fields you allow users to filter
  // are set with object keys in $scope.filter

  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.filter = {};
  $scope.filter[label] = null;
  $scope.filter[desc] = null;

	$scope.query = function(){
		return {
			where: [
				[ '?urn', 'type', '"collection"' ],
				user_check(),
				[ '?urn', 'label', '?label', build_filter( '?label', label ) ],
				[ '?urn', 'description', '?desc', build_filter( '?desc', desc ) ],
				[ '?urn', 'created', '?time', { optional:true } ],
				[ '?urn', 'represents', '?rep', { optional:true } ],
				[ '?urn', 'creator', '?user', { optional:true } ],
			],
			order_by: 'desc( ?time )',
			limit: $scope.limit,
			offset: $scope.limit * ( $scope.page-1 )
		}
	}

	function user_check(){
		if ( user.only ) {
			return [ '?urn', 'creator', "<"+user.url()+">" ];
		}
		return null;
	}

	// Build a filter clause

	function build_filter( key, handle ){
		var filter = $scope.filter[ handle ]
		if ( filter == null ){
			return angular.copy( { optional:true } );
		}
		return angular.copy({ filter:'regex( '+key+', "'+ filter +'", "i" )' });
	}

  // Start once user event fires 

  $rootScope.$on( user.events.ok, 
    function(){ $scope.apply_filter() }
	);

  // Clear the filter

  $scope.clear_filter = function(){
    for ( var key in $scope.filter ){
      $scope.filter[key] = null;
    }
    $scope.apply_filter();
  }


  // Filtering changes if user.only changes

  $scope.$watch( function(){ return user.only },
    function( newVal, oldVal ){
      if ( newVal != oldVal ){
        $scope.apply_filter();
      }
    }
  );

  // Applying the filter is the same as initializing..

  $scope.apply_filter = function(){
	
		// Get count
	
		query.count( $scope.query() ).then(
		function( data ){
			$scope.count = data;
      $scope.pages = Math.ceil( $scope.count / $scope.limit );
      $scope.prev = ( $scope.page > 1 ) ? true : false;
      $scope.next = ( $scope.page < $scope.pages ) ? true : false;
		});
	
		// Get the data
	
    query.get( $scope.query() ).then( 
		function( data ){
			$scope.json = data;
		});
  }
	
}]);


// new/collection

appControllers.controller( 'CollectionNew', [
'$scope',
'$injector', 
'urnServ', 
'$rootScope',
'user', 
'onto',
function( $scope, $injector, urnServ, $rootScope, user, onto ){
  
  $scope.title = "Collection New";
  $scope.type = "collection";
  $scope.show_uniq = true;
	$scope.error = false;
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.form = {};
  $scope.form[label] = onto.default_value('label');
  $scope.form[desc] = onto.default_value('description');
  
  // Run after user has been authorized
  
  $rootScope.$on( user.events.ok, function(){ go() });
  function go(){
    
    // Inherit from parent
	
    $injector.invoke( NewCtrl, this, { $scope: $scope } );
    $scope.init([ label, desc ]);
  }


  // Check CITE URN for uniqueness
  
  $scope.urn_uniq = function(){
    urnServ.uniq( $scope.urn, uniq_callback );
  }
  

  // $scope.urn_uniq callback function
  
  var uniq_callback = function( bool, urn ){
    $scope.show_uniq = !bool;
		$scope.show_error = !bool;
    if ( bool == true ){
      
      // This next line claims a CITE URN and JackSON /data URL
      // AND it retrieves default JSON-LD template
      
      // See lib/new_ctrl.js: $scope.claim
      
      $scope.claim( urn );
      return;
    }
    else {
      $scope.stdout += 'That URN is taken. Choose another.'
    }
  }
}]);


// Delete things
// delete/:urn

appControllers.controller( 'DeleteCtrl', [
'$scope',
'$injector',
'json',
'$routeParams',
'deleter',
function( $scope, $injector, json, $routeParams, deleter, urn_serv ){
  
  // URNs
  
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  $scope.refs = []
  
  // UI messaging switches
  
  $scope.urn_invalid = false;
  $scope.deleted = false;
  $scope.ref_checked = false;
  
  
  // UI messaging checks
  // Keep template display logic simple.
  
  $scope.ui_no_record = function(){
    return $scope.urn_invalid;
  }
  
  $scope.ui_success = function(){
    return $scope.deleted;
  }
  
  $scope.ui_delete_safe = function(){
    if ( $scope.ref_checked && 
         $scope.deleted == false &&
         $scope.refs.length == 0 ){
      return true;
    }
  }
  
  $scope.ui_ref_found = function(){
    if ( $scope.ref_checked &&
         $scope.deleted == false &&
         $scope.refs.length > 0 ){
      return true;
    }
  }
    
  $scope.ui_ref_check = function(){
    if ( $scope.ref_checked == false &&
         $scope.deleted == false &&
         $scope.urn_invalid == false ){
      return true;
    }
  }
  
  $scope.ui_ref_table = function(){
    if ( $scope.refs.length > 0 &&
         $scope.deleted == false ){
      return true;
    }
  }
  
  $scope.ui_del_button = function(){
    if ( $scope.urn_invalid == false &&
         $scope.deleted == false &&
         $scope.ref_checked ){
      return true;
    }
  }
  
  
  // Check if URN is valid
  
  urn_valid();
  function urn_valid(){
    json.urn( $scope.urn ).then( 
    function( data ){
      if ( 'error' in data ){
        $scope.urn_invalid = true;
      }
    });
  }
  
  
  // Find all references to the URN
  
  $scope.get_refs = function(){
    deleter.refs( $scope.urn ).then( 
    function( data ){
      $scope.refs = data;
      $scope.ref_checked = true;
    });
  }
  
  
  // Delete
  
  $scope.delete = function(){
    deleter.urn( $scope.urn ).then( 
    function( data ){
      $scope.deleted = true;
    });
  }
}]);


// imgspect/:urn

appControllers.controller( 'imgspect', [
'$scope',
'$injector',
'$routeParams',
'json',
'item',
'onto',
'tmpl',
function( $scope, $injector, $routeParams, json, item, onto, tmpl ){
  
  // SELECTORS
  
  var img = $('.imgspect img')
  
  // Canvas
  
  var frame = $( '.imgspect.frame' );
  var canvas = $( '.imgspect.frame .canvas' );
  
  // Nav
  
  var nav = $( '.imgspect.nav' );
  var drag = $( '.imgspect.nav .drag' );
  
  // Hi-Lite

  var resize = $( '.imgspect.frame .canvas .lite.temp .resize' );
  var add = $( '.imgspect.frame .canvas .lite.temp .add' );
  var cancel = $( '.imgspect.frame .canvas .lite.temp .cancel' );
  var nudge = $( '.imgspect.frame .canvas .lite.temp .nudge' );
	var popup = $( '.imgspect.frame .canvas .annot' );

  
  // CONFIGURATION
  
  // Current URN
  
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  
  // Stores all the JSON data
  
  $scope.json = {};
  
  // Annotation popout
  
  var popout = false;
  $scope.popout = function( bool ){
    popout = ( bool == undefined ) ? popout : bool;
    return popout
  }
  
  // Application state

  $scope.config = {
		zoom: {
			max: 5
		},
    lite: {
      color:'#FF0',
      opa:0.75
    },
    nav: {
      opa:0.5,
			pos:'right'
    },
    annot: {
      color: '#F2F2F2',
      opa:0.9,
      input: {
        color: '#FDFDFD'
      }
    },
		color_picker: {
  		show: null,
  		showSpeed: 100
		}
  };  
  var orig = {};
	
	$scope.lite_opa_chg = function(n){
		$scope.config.lite.opa = n;
		$scope.$apply();
	}

  // Frame Size
  
  $scope.frame_w = function(){
    return frame.width();
  };
  $scope.frame_h = 600;
  
  // Canvas size and position

  $scope.canvas_w = 0;
  $scope.canvas_h = 0;
  $scope.canvas_x = 0;
  $scope.canvas_y = 0;
  $scope.zoom = 1;
	
	// Change zoom
	
	$scope.zoom_chg = function(n){
		var max = $scope.config.zoom.max;
		var zoom = n * max;
		$scope.zoom = zoom.toPrecision(2);
		dragging()
	}
	
	// Calculate popup offset
	
	$scope.calc_offset = function( dim ){
		var x = $scope.frame_x_rel( parseFloat( $scope.temp_lite.x ) + parseFloat( $scope.temp_lite.w * 0.5 ) );
		var y = $scope.frame_y_rel( parseFloat( $scope.temp_lite.y ) + parseFloat( $scope.temp_lite.h ) );
		switch( dim ){
			case 'x':
				if ( x > 0.75 ){
					return popup.outerWidth()*-1;
				}
				return 0;
				break;
			case 'y':
				if ( x > 0.75 ){
					return 0;
				}
				if ( y < 0.75 ){
					return $scope.to_canvas_y( $scope.temp_lite.h )
				}
				return popup.outerHeight()*-1;
				break;
		}
	}
  
  
  // Ratios
  
  $scope.wr = function(){
    var wr = $scope.frame_w() / $scope.canvas_w;
    wr = ( wr > 1 ) ? 1 : wr;
    return wr;
  }
  
  $scope.hr = function(){
    var hr = $scope.frame_h / $scope.canvas_h;
    hr = ( hr > 1 ) ? 1 : hr;
    return hr;
  }
  
  // Dragger Position
  
  $scope.drag_x = 0;
  $scope.drag_y = 0;
  $scope.drag_w = function(){
    return $scope.nav_w() * $scope.wr();
  }
  $scope.drag_h = function(){
    return $scope.nav_h * $scope.hr();
  }
  
  // Navigation Size
  
  $scope.nav_h = 300;
  $scope.nav_w = function(){
    return $scope.nav_scale() * orig.width
  }
  $scope.nav_scale = function(){
    return $scope.nav_h / orig.height
  }
	$scope.nav_right = true;
  
  
  // Get default annotation data
  
  $scope.default = null;
  tmpl.get( 'roi' ).then(
    function( data ){
      $scope.default = data;
    },
    function( err ){
      console.log( 'error' );
    }
  )
  
  
  
  // SERVER COMMUNICATION
  
  // Add the current temp-lite to annotations
  
  $scope.add = function(){
    var fresh = {
      'label': $scope.temp_label,
      'description': $scope.temp_desc,
      'height': $scope.temp_lite.h,
      'width': $scope.temp_lite.w,
      'x': $scope.temp_lite.x,
      'y': $scope.temp_lite.y
    };
    var annots = annotations();
    annots.push( fresh );
		$scope.popout( false );
		$scope.lite_reset();
  }
  
  // Save new annotations to database
  
  $scope.save = function(){
    var annots = annotations();
    for ( var i=0; i<annots.length; i++ ){
      
      // any annotation without a URN gets its data POSTED
      
      if ( ! ( 'urn' in annots[i] ) ){
        save_annotation( annots[i] );
      }
    }
  }
  
  function annotation_urn( annot ){
    return $scope.urn+"@"+[  
      annot['x'], 
      annot['y'],
      annot['width'],
			annot['height']
    ].join(',')
  }
  
  function save_annotation( annot ){
    
    // save into default template
    
    var def = angular.copy( $scope.default );
    annot = angular.extend( def, annot );
    annot['@id'] = annotation_urn( annot );
    annot['cite:belongsTo'] = { "@id": $scope.urn };
		annot['rdf:label'] = annot['label'];
		annot['rdf:description'] = annot['description'];
    
    // save on the server
    
    json.post( 'roi/'+annot['@id'], annot ).then( 
      function( data ){
        console.log( data );
      },
      function( err ){
        console.log( err );
      }
    )
  }
  
  function annotations(){
    return $scope.json.annotations;
  }
  
  // Get the item JSON
  
  json.urn( $scope.urn ).then( function( data ){
    var src = data.src[0];
    var srckey = onto.with_prefix('src');
    json.get( src ).then( function( data ){
      $scope.json.item = data;
      upload_json( data[srckey]['@id'] );
    });
  });
  
  
  // get the upload JSON
  
  function upload_json( urn ){
    json.urn( urn ).then( function( data ){
      var src = data.src[0];
      json.get( src ).then( function( data ){
        $scope.json.upload = data;
        get_annotations( $scope.urn );
      });
    });
  }
  
  
  // get the annotations
  
  function get_annotations( urn ){
    item.rois( urn ).then( function( data ){
      $scope.json.annotations = data;
    });
    ready();
  }
  
  
  // Start the party once everything is loaded
  
  function ready(){
    $scope.src = $scope.json.upload['dct:references']['@id'];
    start();
  }
  
  
  
  // USER INTERACTION
    
  // Once the image loads get started
    
  function start(){
    img.load( function(){
      
      // Stash image dimensions
      
      orig.width = this.width;
      orig.height = this.height;
      
      // Start event listeners
      
      event_start();
      
      // Image you are no longer needed!
      
      img.detach();
      
      // Initial display
      
      dragging();
    });
  }
  
  // Convert relative coordinates
  
  $scope.to_canvas_x = function( n ){ return n*$scope.canvas_w }
  $scope.to_canvas_y = function( n ){ return n*$scope.canvas_h }
  
  $scope.to_nav_x = function( n ){ return n*$scope.nav_w() }
  $scope.to_nav_y = function( n ){ return n*$scope.nav_h }
  
	$scope.frame_x_rel = function( n ){ 
		var cx = $scope.to_canvas_x( n );
		return ( cx - $scope.canvas_x ) / $scope.frame_w();
	}
	
	$scope.frame_y_rel = function( n ){
		var cy = $scope.to_canvas_y( n );
		return ( cy + $scope.canvas_y ) / $scope.frame_h;
		
	}
  
  
  // LITE
  
  // Start the hi-liter
  
  var pressed = false;
  $( document )
  .on( 'touchstart mousedown', function(){
    pressed = true;
  })
  .on( 'touchend mouseup', function(){
    pressed = false;
  });
  
  function event_match( e ){
    return ( e.originalEvent.srcElement == canvas[0] ) ? true : false
  }
  
  // The temp_lite object
  
  function clear_pos(){ return { x:null, y:null, w:null, h:null } };
  $scope.temp_lite = clear_pos();
  
  $scope.lite_reset = function(){
    $scope.temp_lite = clear_pos();
  }
  
  $scope.lite_cancel = function(){ 
    $scope.lite_reset();
    $scope.refresh();
  }
  
  $scope.lite_clear_text = function(){
    $scope.temp_label = '';
    $scope.temp_desc = '';
  }
  $scope.lite_clear_text();
  
  // Stash the lite
  
  $scope.lites = [];
  $scope.lite_stash = function(){
    $scope.lites.push( angular.copy( $scope.temp_lite ) );
  }
  
  // The temp_lite points
  
  var _p1 = { x:null, y:null };
  var p1 = function( pos ){
    if ( ! angular.isDefined( pos ) ){
      return _p1
    }
    _p1.x = pos.x;
    _p1.y = pos.y;
  }
  
  var _p2 = { x:null, y:null };
  var p2 = function( pos ){
    if ( ! angular.isDefined( pos ) ){
      return _p2
    }
    _p2.x = pos.x;
    _p2.y = pos.y;
  }
  
  // Set p1 to upper-left and p2 to lower-right
  
  function point_clean(){
    p1({ x:min_x(), y:min_y() });
    p2({ x:max_x(), y:max_y() });
  }
  
  function min_x(){ return Math.min( p1().x, p2().x ) }
  function min_y(){ return Math.min( p1().y, p2().y ) }
  function max_x(){ return Math.max( p1().x, p2().x ) }
  function max_y(){ return Math.max( p1().y, p2().y ) }
  
  function ctrl_start(){
    add.on('touchstart click', function(e){
      $scope.lite_stash();
    });
    cancel.on('touchstart click', function(e){
      $scope.lite_cancel();
    });
  }
  
  function point_diff( p1, p2 ){
    return { x:p1.x-p2.x, y:p1.y-p2.y }
  }
  
  function point_add( p1, p2 ){
    return { x:p1.x+p2.x, y:p1.y+p2.y }
  }
  
  var nudge_clear = function(){ return { x:null, y:null } }
  var nudge_diff = nudge_clear();
  function nudge_start(){
    nudge
    .on('touchstart mousedown', function(e){
      nudge_diff = point_diff( mouse_rel( e ), p1() );
    })
    .on('touchend mouseup', function(e){
      nudge_diff = nudge_clear();
    });
    
    // See lite_move()
  }
  
  function nudge_check(){
    if ( nudge_diff.x == null && nudge_diff.y == null ){
      return false;
    }
    return true;
  }
  
  function resize_start(){
    resize
    .on('touchstart mousedown', function(e){
      console.log( 'resize down' );
    })
    .on('touchmove mousemove', function(e){
      console.log( 'resize move' );
    })
    .on('touchend mouseup', function(e){
      console.log( 'resize up' );
    });
  }
  
  function lite_start(){
    canvas
    .on('touchstart mousedown', function(e){
      ( event_match(e) ) ? lite_down( e ) : null;
    })
    .on('touchmove mousemove', function(e){
      lite_move( e );
    })
    .on('touchend mouseup', function(e){
      lite_up( e );
    });
  }
  
  function event_start(){
    drag_start();
    lite_start();
    nudge_start();
    // resize_start();
    ctrl_start();
  }
  
  function lite_pos( e ){
    p2( mouse_rel( e ) );
    lite_size();
  }
  
  function lite_size(){
    $scope.temp_lite.x = min_x().toFixed(4);
    $scope.temp_lite.y = min_y().toFixed(4);
    $scope.temp_lite.w = (max_x()-$scope.temp_lite.x).toFixed(4);
    $scope.temp_lite.h = (max_y()-$scope.temp_lite.y).toFixed(4);
  }
  
  function nudge_pos( e ){
    var pos = mouse_rel( e )
    var size = point_diff( p2(), p1() );
    p1( point_diff( pos, nudge_diff ) );
    p2( point_add( p1(), size ) );
    lite_size();
  }
  
  function lite_down( e ){
    p1( mouse_rel( e ) );
  }
  
  function lite_move( e ){
    if ( pressed ) {
      
      // Are you nudging the temp-lite?
      
      if ( nudge_check() ) {
        nudge_pos( e );
      }
      
      // No you're drawing it.
      
      else {
        lite_pos( e );
      }
      
      // update styles
      
      $scope.refresh();
    }
  }
  
  function lite_up( e ){
    point_clean();
  }
  
  function mouse_rel( e ){
    var pos = canvas.offset();
    var x = (e.clientX - pos.left);
    var y = (e.clientY - pos.top + $(document).scrollTop() );
    return { 'x':x/$scope.canvas_w, 'y':y/$scope.canvas_h }
  }
  
  
  // DRAGGER
  
  // Start the dragger
  
  function drag_start(){
    drag.draggable({
      containment:'parent',
      scroll:false,
      drag:function(){ dragging() },
      stop:function(){}
    });
  }
  
  // Move the canvas
  
  function canvas_move(){
    var pos = drag.position();
    var x =  pos.left/$scope.nav_scale();
    var y =  pos.top/$scope.nav_scale();
    $scope.canvas_x = x*-1*$scope.zoom;
    $scope.canvas_y = y*-1*$scope.zoom;
    $scope.refresh();
  }
  
  // What happens when dragger is moved
  
  function dragging(){
    $scope.canvas_w = orig.width*$scope.zoom;
    $scope.canvas_h = orig.height*$scope.zoom;
    canvas_move();
  }
  
  
  $scope.refresh = function(){
    $scope.$digest();
  }
  
}]);


// item/:urn

appControllers.controller( 'ItemCtrl', [
'$scope',
'$injector',
'onto',
'item',
function( $scope, $injector, onto, item ){
	
  $scope.title = "Item";
	
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var rep = onto.with_prefix('represents');
  var license = onto.with_prefix('rights');
  var keyword = onto.with_prefix('subject');
	
  $scope.form = {};
  $scope.form[label] = "";
  $scope.form[desc] = "";
  $scope.form[rep] = "";
  $scope.form[license] = "";
  $scope.form[keyword] = [];
  $injector.invoke( EditCtrl, this, { $scope: $scope } );
  $scope.init([label,desc,rep,license]);
  
  // Collection URN
  
  var collection = {}
  collection.urn = $scope.urn.substring( 0, $scope.urn.indexOf('.') )
  $scope.collections = [];
  $scope.collections[0] = collection;
	
	// ROIS
	
	var rois = {}
	item.rois( $scope.urn ).then( function( data ){
		$scope.rois = data;
	})
	
	// Upload thumb
	
	item.thumb( $scope.urn ).then(
	function( data ){
		$scope.upload = data;
	});
	
	// Upload src
	item.upload_src( $scope.urn ).then(
	function( data )	{
		$scope.img_src = data[0]['img'];
	});
	
	
}]);


// items

appControllers.controller( 'ItemListCtrl', [
'$scope',
'$injector',
'$rootScope',
'$routeParams',
'user',
'onto',
'query',
function( $scope, $injector, $rootScope, $routeParams, user, onto, query ){
  $scope.type = "item";
  $scope.keys = [ 'urn','label','desc','rep','user','time' ];
	$scope.limit = 10;
  $scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );

  // The fields you allow users to filter
  // are set with object keys in $scope.filter

  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var rep = onto.with_prefix('represents');
  $scope.filter = {};
  $scope.filter[label] = null;
  $scope.filter[desc] = null;
  $scope.filter[rep] = null;

	$scope.query = function(){
		return {
			where: [
				[ '?urn', 'type', '"item"' ],
				user_check(),
				[ '?urn', 'label', '?label', build_filter( '?label', label ) ],
				[ '?urn', 'description', '?desc', build_filter( '?desc', desc ) ],
				[ '?urn', 'represents', '?rep', build_filter( '?rep', rep ) ],
				[
					[ '?urn', 'src', '?up'],
					[ '?res', 'memberOf', '?up' ],
					[ '?res', 'src', '?thumb' ],
					{ optional:true }
				],
				[ '?urn', 'created', '?time', { optional:true } ],
				[ '?urn', 'creator', '?user', { optional:true } ],
			],
			order_by: 'desc( ?time )',
			limit: $scope.limit,
			offset: $scope.limit * ( $scope.page-1 )
		}
	}

	function user_check(){
		if ( user.only ) {
			return [ '?urn', 'creator', "<"+user.url()+">" ];
		}
		return null;
	}

	// Build a filter clause

	function build_filter( key, handle ){
		var filter = $scope.filter[ handle ]
		if ( filter == null ){
			return angular.copy( { optional:true } );
		}
		return angular.copy({ filter:'regex( '+key+', "'+ filter +'", "i" )' });
	}

  // Start once user event fires 

  $rootScope.$on( user.events.ok, 
    function(){ $scope.apply_filter() }
	);

  // Clear the filter

  $scope.clear_filter = function(){
    for ( var key in $scope.filter ){
      $scope.filter[key] = null;
    }
    $scope.apply_filter();
  }


  // Filtering changes if user.only changes

  $scope.$watch( function(){ return user.only },
    function( newVal, oldVal ){
      if ( newVal != oldVal ){
        $scope.apply_filter();
      }
    }
  );

  // Applying the filter is the same as initializing..

  $scope.apply_filter = function(){

		// Get count

		query.count( $scope.query() ).then(
		function( data ){
			$scope.count = data;
      $scope.pages = Math.ceil( $scope.count / $scope.limit );
      $scope.prev = ( $scope.page > 1 ) ? true : false;
      $scope.next = ( $scope.page < $scope.pages ) ? true : false;
		});

		// Get the data

    query.get( $scope.query() ).then( 
		function( data ){
			$scope.json = data;
		});
  }

}]);


// new/item/:urn

appControllers.controller( 'ItemNew', [
'$scope',
'urnServ',
'$routeParams',
'collection',
'$location',
'json',
'stdout',
'user',
'$injector',
'onto',
'tmpl',
function( $scope, urnServ, $routeParams, collection, $location, json, stdout, user, $injector, onto, tmpl ){
  $scope.upload_urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  $scope.type = "item";
  $scope.title = "Item New";
  $scope.urn = null;
  $scope.ready = false;
  $scope.collection = null;
  $scope.form = {};
	$scope.user_collections = null;
  
  
  // User clicks collection to add upload
  
  $scope.add_to = function( urn ){
    $scope.collection = urn;
    
    // Create a new item URN
    
    urnServ.fresh( urn+".{{ id }}", fresh_callback );
  }
	
	// Get the user's collections
	
	collection.mine().then( function( data ){
		$scope.user_collections = data;
	});
  
  
  // Get collections for the collection selector
  
  $scope.search = function(){
    var str = $scope.form.search;
    $scope.collections = [];
    collection.search( str ).then(
      function( data ){ $scope.collections = data }
    );
  }
  
  
  // Once you have a fresh item URN
  
  var fresh_callback = function( urn ){
    $scope.urn = urn;
		$scope.ready = true;
  }
  
  
  // User clicks edit item URN button
  
  $scope.create_item = function(){ default_json() }
  
  
  // Build the data path URL

  $scope.data_path = function( urn ){
    return $scope.type+'/'+urn
  }
  
  
  // Save the default after writing the most basic values

  var save = function(){
    touch().then( function(){
    	json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
    	function( data ){
    	  
    	  // Congratulations!
    	  // You've added an upload to a collection
    	  // Go to Edit item view
    	  
    	  $location.path('item/'+$scope.urn );  
    	});
		});
  }


  // Set basic values
	// Some values will get their default value from
	// the upload.

  var touch = function(){
		return json.urn( $scope.upload_urn ).then( function( data ){
			return json.get( data.src[0] ).then( function( data ){
				
		  	var src = onto.with_prefix('src');
		  	var creator = onto.with_prefix('creator');
		  	var memberOf = onto.with_prefix('memberOf');
		  	var created = onto.with_prefix('created');
		  	var license = onto.with_prefix('rights');
				var label = onto.with_prefix('label');
				var desc = onto.with_prefix('description');
				
		  	$scope.json['@id'] = $scope.urn;
		  	$scope.json[src]['@id'] = $scope.upload_urn;
		  	$scope.json[creator]['@id'] = user.id();
		  	$scope.json[memberOf]['@id'] = $scope.collection;
		  	$scope.json[created] = ( new TimeStamp ).xsd();
				$scope.json[label] = data[label];
				$scope.json[desc] = data[desc]
				
		  	// TODO this is a hack -- we want to read default values
		  	// and data types from the config
		
		  	$scope.json[license]['@id'] = onto.default_value('rights');
			})
		});
	}

  // Load the default JSON data

  var default_json = function(){
    tmpl.get( $scope.type ).then(
    function( data ){
      $scope.json = data;
      stdout.log( "Default "+ $scope.type +" JSON loaded" );
      save();
    });
  }
	
}]);



// JsonMsg
// Makes communication with JackSON server more transparent
// to the user.

appControllers.controller( 'JsonMsg', [
'$scope',
'json',
function( $scope, json ){
  
  var update = function( method, url, stat, msg ){
    $scope.method = method;
    $scope.url = url;
    $scope.status = stat;
    $scope.msg = msg;
    $scope.hide = false;
    switch( $scope.status ){
      case json.state().success:
        $scope.mode = 'success'
        break;
      case json.state().error:
        $scope.mode = 'alert'
        break;
      default:
        $scope.mode = 'secondary'
    }
  }
  
  json.on_change( update );
}]);


// login

appControllers.controller( 'LoginCtrl', [
'$scope',
'user',
function( $scope, user ){}]);


// Base controller
// http://blog.omkarpatil.com/2013/02/controller-inheritance-in-angularjs.html

var EditCtrl = ['$scope', 
'json',
'$routeParams',
'onto',
function( $scope, json, $routeParams, onto ){
	
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  $scope.stdout = "";
  $scope.context = null;
  
  
  // JSON and HTML form
  
  $scope.src = null;
  $scope.json = {};
  $scope.json_string = '';
  $scope.upload_ref = onto.with_prefix('src');
      
  $scope.save = function(){ save() }
  $scope.change = function( key ){ change(key) }
  $scope.init = function(edit_fields){ init(edit_fields) }
  
  
  // Update JSON when form changes
  
  function change( key ) {
    if ( key in $scope.json ) {
      if (angular.isDefined($scope.json[key]['@id'])) {
        $scope.json[key]['@id'] = $scope.form[key];
      } else {
        $scope.json[key] = $scope.form[key];
      }
      json_to_str( $scope.json );
    }
  }
  
  
  // Update the form with JSON data
  
  function form() {
    for ( var key in $scope.json ) {
      if ( key in $scope.form ) {
        if (angular.isDefined($scope.json[key]['@id'])) {
          $scope.form[key] = $scope.json[key]['@id'];
        } else {
          $scope.form[key] = $scope.json[key];
        }
      }
    }
  }
  
  
  // Save JSON
  
  function save() {
  	$scope.saving = true;
  	json.put( $scope.src[0], $scope.json ).then(
  	function( msg ){ 
  	  output( msg );
  	  setTimeout( function(){
  	    $scope.saving = false;
  	  }, 5000 );
  	});
  }
  
  
  // Write output
  
  function output( msg ) {
  	$scope.stdout += msg+"\n";
  }
  
  
  // Retrieve JSON src url
  
  function src() {
  	json.urn( $scope.urn ).then( 
  	function( data ){
      $scope.src = data.src;
  	  get();
  	});
  }
  
  
  // Get JSON
  
  function get() {
  	json.get( $scope.src[0] ).then( 
		function( data ){
	  	$scope.json = data;
	  	json_to_str( $scope.json );
	  	form();
	  	
	  	// Run code after receiving JSON
	  	
	  	if ( $scope.run != undefined ){
	  	  $scope.run();
	  	}
  	});
  }
  
  
  // Turn JSON into pretty-printed string
  
  function json_to_str( data ) {
  	var disp = json.disp( data );
  	$scope.context = disp[0];
  	$scope.json_string = disp[1];
  }
  
  
  // Run when controller is initialized
  // @param [Array] edit_fields array of editable fields for this item
  
  function init( edit_fields ) {
    src();
    $scope.edit_text_fields = edit_fields;
  }
	
}];


var NewCtrl = [
'$scope',
'urnServ',
'json',
'stdout',
'user',
'onto',
'tmpl',
function( $scope, urnServ, json, stdout, user, onto, tmpl ){
  
  // Update data
  
  $scope.json = {};
  $scope.ready = false;
  
  // Build CITE URN 
  
  $scope.id = null;
  $scope.urn = '';
  $scope.base_urn = urnServ.base;
  $scope.urn_build = function(){
    $scope.urn = $scope.base_urn+$scope.clean_id()
  }
  $scope.clean_id = function(){ 
		return $scope.id.alphaOnly().toLowerCase() 
	};

  // Run when controller is initialized
  // @param [Array] editable fields for this item
	
  $scope.init = function( edit_fields ){ 
		init( edit_fields )
	}
  function init( edit_fields ) {
    $scope.edit_text_fields = edit_fields;
  }
  
  // Output messages
  
  $scope.stdout = "";
  
  
  // Claim JackSON data url and CITE URN
  
  $scope.claim = function( urn ){
    urnServ.claim( $scope.data_path( urn ), urn ).then(
		function( data ){ 
		  stdout.log( data );
		  default_json();
		});
  }
  
  
  // Build the data path URL
  
  $scope.data_path = function( urn ){
    return $scope.type+'/'+urn
  }
  
  
  // Save the default after writing the most basic values
  
  var save = function(){
    touch();
    json.put( $scope.data_path( $scope.urn ), $scope.json ).then(
    function( data ){
      stdout.log( data );
      $scope.ready = true;
    });
  }
  
  
  // Set basic values
  
  var touch = function(){
    $scope.json['@id'] = $scope.urn;
    var creator = onto.with_prefix('creator');
    var created = onto.with_prefix('created');
    $scope.json[creator]['@id'] = user.id();
    $scope.json[created] = ( new TimeStamp ).xsd();
  }
  
  
  // Load the default JSON data
  
  var default_json = function(){
    tmpl.get( $scope.type ).then(
    function( data ){
      $scope.json = data;
      stdout.log( "Default "+$scope.type+" JSON loaded" );
      save();
    });
  }

}];


// Pre-delete

appControllers.controller( 'PreDeleteCtrl', [
'$scope',
'$window',
function( $scope, $window ){
	$scope.urn = null;
	$scope.go = function(){
		$window.location.href ="#/delete/"+$scope.urn;
	}
}]);


// resize/:urn

appControllers.controller( 'ResizeCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
'onto',
function( $scope, $injector, user, $rootScope, onto ){
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    var label = onto.with_prefix('label');
    var desc = onto.with_prefix('description');
    var keyword = onto.with_prefix('subject');
    $scope.title = "Resize";
    $scope.form = {};
    $scope.form[label] = "";
    $scope.form[desc] = "";
    $scope.form[subject] = [];
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    
    $scope.run = function() {
      $scope.uploads = [];
      $scope.uploads[0] = { 
        urn: $scope.json[onto.with_prefix('src')]['@id'] 
      };
    }
    
    $scope.init();
  }
}]);


// collection/:urn

appControllers.controller( 'RoiSearch', [ 
'$scope',
'user',
'roi',
function( $scope, user, roi ){
  
  $scope.search_for = null;
	
	$scope.search = function(){
		roi.by_label( $scope.search_for ).then( 
		function( r ){
			$scope.rois = r;
			console.log( $scope.rois );
		});
	}

}]);


// Sparql Msg
// Makes communcation with SPARQL endpoint more transparent

appControllers.controller( 'SparqlMsg', [
'$scope',
'sparql',
function( $scope, sparql ){
  
  $scope.query = '';
  var update = function( status, query ){
    $scope.query = query;
  }
  sparql.on_change( update );
  
}]);


// StdOut

appControllers.controller( 'StdOut', [
'$scope',
'stdout',
function( $scope, stdout ){
  $scope.stdout = stdout;
  $scope.$watch('stdout.msg', function(){
    $scope.msg = stdout.msg;
  });
}]);


// upload/:urn

appControllers.controller( 'UploadCtrl', [
'$scope',
'$injector',
'resize',
'item',
'onto',
function( $scope, $injector, resize, item, onto ){
  $scope.title = "Upload";
	
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var keyword = onto.with_prefix('subject');
  var rights = onto.with_prefix('rights');
  var owner = onto.with_prefix('owner');
	
  $scope.form = {};
  $scope.form[label] = null;
  $scope.form[desc] = null;
  $scope.form[owner] = null;
  $scope.form[rights] = onto.default_value('rights');
  $scope.form[keyword] = [];
  
  $injector.invoke( EditCtrl, this, { $scope: $scope } );
  $scope.init([label,desc,owner,rights]);
  
  // Resize
  
  $scope.resize = [];
  resize.get( $scope.urn ).then(
    function( data ){ $scope.resize = data }
  );
  
  // Items
  
  $scope.items = [];
  item.by_upload( $scope.urn ).then(
    function( data ){ $scope.items = data }
  );
  
}]);


// uploads

appControllers.controller( 'UploadListCtrl', [
'$scope',
'$injector',
'$rootScope',
'$routeParams',
'user',
'onto',
'query',
function( $scope, $injector, $rootScope, $routeParams, user, onto, query ){
  $scope.type = "upload";
  $scope.keys = [ 'urn','label','desc','user','time' ];
	$scope.limit = 10;
  $scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );
	
  // The fields you allow users to filter
  // are set with object keys in $scope.filter
  
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  $scope.filter = {};
  $scope.filter[label] = null;
  $scope.filter[desc] = null;
	
	$scope.query = function(){
		return {
			where: [
				[ '?urn', 'type', '"upload"' ],
				user_check(),
				[ '?urn', 'label', '?label', build_filter( '?label', label ) ],
				[ '?urn', 'description', '?desc', build_filter( '?desc', desc ) ],
				[
					[ '?res', 'memberOf', '?urn'],
					[ '?res', 'src', '?thumb' ],
					{ optional:true }
				],
				[ '?urn', 'created', '?time', { optional:true } ],
				[ '?urn', 'represents', '?rep', { optional:true } ],
				[ '?urn', 'creator', '?user', { optional:true } ],
			],
			order_by: 'desc( ?time )',
			limit: $scope.limit,
			offset: $scope.limit * ( $scope.page-1 )
		}
	}
	
	function user_check(){
		if ( user.only ) {
			return [ '?urn', 'creator', "<"+user.url()+">" ];
		}
		return null;
	}
	
	// Build a filter clause
	
	function build_filter( key, handle ){
		var filter = $scope.filter[ handle ]
		if ( filter == null ){
			return angular.copy( { optional:true } );
		}
		return angular.copy({ filter:'regex( '+key+', "'+ filter +'", "i" )' });
	}
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, 
    function(){ $scope.apply_filter() }
	);
	
  // Clear the filter
  
  $scope.clear_filter = function(){
    for ( var key in $scope.filter ){
      $scope.filter[key] = null;
    }
    $scope.apply_filter();
  }
  
  
  // Filtering changes if user.only changes

  $scope.$watch( function(){ return user.only },
    function( newVal, oldVal ){
      if ( newVal != oldVal ){
        $scope.apply_filter();
      }
    }
  );
	
  // Applying the filter is the same as initializing..
  
  $scope.apply_filter = function(){
		
		// Get count
		
		query.count( $scope.query() ).then(
		function( data ){
			$scope.count = data;
      $scope.pages = Math.ceil( $scope.count / $scope.limit );
      $scope.prev = ( $scope.page > 1 ) ? true : false;
      $scope.next = ( $scope.page < $scope.pages ) ? true : false;
		});
		
		// Get the data
		
    query.get( $scope.query() ).then( 
		function( data ){
			$scope.json = data;
		});
		
  }
	
}]);


// new/upload

appControllers.controller( 'UploadNew', [
'$scope',
'$injector',
'urnServ',
'json',
'stdout',
'user',
'$upload',
'config',
'$http',
'onto',
'resizer',
'tmpl',
function( $scope, $injector, urnServ, json, stdout, user, $upload, config, $http, onto, resizer, tmpl ){
  $scope.title = "Upload New";
  $scope.stdout = "";
  
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var src = onto.with_prefix('src');
  var rights = onto.with_prefix('rights');
  var owner = onto.with_prefix('owner');
  
  $scope.form = {};
  $scope.form[ label ] = "";
  $scope.form[ desc ] = "";
  $scope.form[ owner ] = "";
  $scope.form[ rights ] = "";
  $scope.form[ src ] = "";
  $scope.src_field = src;
  $scope.type = 'upload';
  
  // Initialize everything...
  // Pass along the form fields to edit in the init
  // function.
  
  // It's not dry.
  // Existence in $scope.form should be enough...
  
  // TODO Fix this mess.
  
  $injector.invoke( NewCtrl, this, { $scope: $scope } );
  $scope.init([ label, desc, rights, owner ]);
  $scope.saving = false;
  
  // Show disk
  
  $scope.show_disk = false;
  $scope.disk = function( show ){
    $scope.show_disk = show;
  }
  
  $scope.change = function(key){ change(key) }
  
  
  function set_form_default( form_key, data_key ) {
    $scope.form[ form_key ] = onto.default_value( data_key );
    $scope.change( form_key );
  }
  
  
  function touch (){
    var creator = onto.with_prefix('creator');
    var created = onto.with_prefix('created');
    $scope.json['@id'] = $scope.urn;
    $scope.json[creator]['@id'] = user.id();
    $scope.json[created] = ( new TimeStamp ).xsd();
    json_to_str( $scope.json );
  }
  
  
  // Update JSON when form changes
  
  function change( key ) {
    if ( key in $scope.json ) {
      if ( angular.isDefined( $scope.json[key]['@id'] ) ){
        $scope.json[key]['@id'] = $scope.form[key];
      } 
  	else {
        $scope.json[key] = $scope.form[key];
      }
  	json_to_str( $scope.json );
    }
  }
  
  
  // Update the form with JSON data
  
  function form() {
  	for ( var key in $scope.json ) {
      if ( key in $scope.form ) {
        $scope.form[key] = $scope.json[key];
      }
  	}
  }
  
  
  // Turn JSON into pretty-printed string
  
  function json_to_str( data ) {
  	var disp = json.disp( data );
  	$scope.context = disp[0];
  	$scope.json_string = disp[1];
  }
  
  
  // Save your new upload
  
  $scope.save = function(){
    $scope.saving = true;
    
    // Disk or URL?
    
    if ( $scope.show_disk == true ){
      if ( $scope.file ){
        $scope.upload();
      }
    }
    else {
	  	if ( $scope.form[ src ] ){
	  	  $scope.cp_http();
	  	}
    }
  }
  
  	
  // Load the default JSON
  
  function default_json(){
    tmpl.get( $scope.type ).then(
    function( data ){
      $scope.json = data;
      json_to_str( $scope.json );
      stdout.log( "Default "+$scope.type+" JSON loaded" );
      $scope.ready = true;
      
      // TODO we should loop through the 
      // ontology to see what has defaults 
      // rather than hard-coding the fields 
      // we want to set defaults for
      
      set_form_default(rights,'rights');
    });
  }
  default_json();
  
  
  // Image Uploader
  
  $scope.file = '';
  $scope.upload_out = false;
  $scope.upload = function(){
  	$upload.upload({
  		url: config.imgup.url+'/upload', 
  		method: 'POST',
  		file: $scope.file
   	})
  	.error( function(){
  		$scope.upload_out = "There was an error upload";
   	})
  	.success( function( data ){
  		upload_success( data );
   	});
  }
  
  $scope.cp_http = function(){
  	$http({
      method: 'POST',
      url: config.imgup.url+'/upload',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { src: $scope.form[ src ] }
  	})
  	.error( function(){
			$scope.upload_out = "There was an error upload";
  	})
  	.success( function( data ){
      upload_success( data );
  	})
  }
  
  function upload_success( data ){
		$scope.upload_out = "Uploaded successfully";
  	exif_json( data );
  	$scope.json[ onto.with_prefix('src') ]['@id'] = data.src.replace(' ', "%20");
  	$scope.json[ onto.with_prefix('orig') ] = data.orig;
  	json_to_str( $scope.json );
  	urnServ.fresh( urnServ.base+"upload.{{ id }}", fresh_callback );
  }
	
  // Once you have a fresh URN
  
  var fresh_callback = function( urn ){
    $scope.urn = urn;
    touch();
    json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
		function( data ){
			setTimeout( function(){
				$scope.saving = false;
			}, 5000 );
			
			// resize upload
			
			resizer.add( $scope.urn, 200, 200 );
			
		});
	}
  
  // TODO externalize exif ontology
  
  function exif_json( data ){
  	var exif = data.exif;
  	for ( var key in exif ) {
      $scope.json[ 'exif:'+key.toCamel() ] = exif[key];
  	}
  }
}]);


appControllers.controller( 'UploadNew2', [
'$scope',
'config',
'json',
'tmpl',
'resizer',
'$upload',
'onto',
'urnServ',
'user',
'resizer',
function( $scope, config, json, tmpl, resizer, $upload, onto, urnServ, user, resizer ){
	
	$scope.type = 'upload';
	
	// UPLOAD
	
	$scope.progress = {
		total: null,
		now: null,
		done: false,
		error: false
	};
	
	$scope.default = angular.copy( $scope.progress );
	
	var pbar = $( '#progressbar' );
	var plabel = $( '.progress-label' );
	
	$scope.upload = function( file ){
		$scope.progress = angular.copy( $scope.default );
		pbar.progressbar({
			value: false,
			change: function(){
				plabel.text( pbar.progressbar( "value" ) + "%" );
			}
		});
		
		$upload.upload({
			url:config.imgup.url+'/upload',
			method: 'POST',
			file: $scope.file
		})
		.progress( function(r){
			$scope.progress.total = r.total;
			$scope.progress.now = r.loaded;
			pbar.progressbar( "value", (r.loaded/r.total)*100 );
		})
		.error( function(r){
			$scope.progress.error = true;
			$scope.error_output = json.disp( r );
		})
		.success( function(r){
			$scope.progress.orig = r.orig;
			$scope.progress.src = r.src;
			$scope.progress.done = true;
	  	urnServ.fresh( urnServ.base+"upload.{{ id }}", fresh_callback );
		})
	}
	
  var fresh_callback = function( urn ){
    $scope.urn = urn;
		load_tmpl();
	}
	
	// METATADATA
	
	$scope.tmpl = {
		loaded: null,
		error: null,
		saving: false,
		saved: false
	};
	
	function load_tmpl(){
		tmpl.get( $scope.type ).then(
		function( r ){
			$scope.json = r;
			$scope.tmpl.loaded = true;
		}),
		function( err ){
			$scope.tmpl.error = err;
		};
	}
	
  var label = onto.with_prefix('label');  
  var desc = onto.with_prefix('description');
  var src = onto.with_prefix('src');
  var rights = onto.with_prefix('rights');
  var owner = onto.with_prefix('owner');
  
  $scope.form = {};
  $scope.form[ label ] = "";
  $scope.form[ desc ] = "";
  $scope.form[ owner ] = "";
  $scope.form[ rights ] = "";
  $scope.form[ src ] = "";
  $scope.src_field = src;
	
	$scope.edit_fields = [ label, desc, rights, owner ];
	
  // Update the form with JSON data
  
  function form() {
  	for ( var key in $scope.json ) {
      if ( key in $scope.form ) {
        $scope.form[key] = $scope.json[key];
      }
  	}
  }
	
  // Update JSON when form changes
  
  $scope.change = function( key ) {
    if ( key in $scope.json ) {
      if ( angular.isDefined( $scope.json[key]['@id'] ) ){
        $scope.json[key]['@id'] = $scope.form[key];
      } 
			else {
        $scope.json[key] = $scope.form[key];
      }
    }
  }
	
  // Build the data path URL
  
  $scope.data_path = function( urn ){
    return $scope.type+'/'+urn
  }
  
  
  // Save the default after writing the most basic values
  
	$scope.save = function(){
		$scope.tmpl.saving = true;
    touch();
    json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
    function( data ){
			if ( 'error' in data ){
				$scope.tmpl.error = data;
				$scope.error_out = json.disp( $scope.json );
			}
			else {
				$scope.tmpl.saved = true;
				resizer.add( $scope.urn, 200, 200 );
			}
    });
  }
  
  // Set basic values
  
	function touch(){
    $scope.json['@id'] = $scope.urn;
    var creator = onto.with_prefix('creator');
    var created = onto.with_prefix('created');
		var orig = onto.with_prefix('orig');
    $scope.json[creator]['@id'] = user.id();
    $scope.json[created] = ( new TimeStamp ).xsd();
		$scope.json[src]['@id'] = $scope.progress.src.replace(' ', "%20");
		$scope.json[orig] = $scope.progress.orig;
  }
	
	
}]);


// Talk to URN server

appControllers.controller( 'urnServ',[
'$scope',
'urnServ',
function( $scope, urnServ ){}])


// User

appControllers.controller( 'UserCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
function( $scope, $injector, user, $rootScope ){    
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    $scope.only = user.only;
    $scope.user = user.id();
    $scope.username = user.name();
  }
  
  $scope.switch = function( bool ){
    user.only = bool;
    go();
  }
}]);


// View

appControllers.controller( 'ViewCtrl', [
'$scope',
'$routeParams',
'json',
function( $scope, $routeParams, json ){
  
  // Get the URN
  
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  
  // Get the coords
  
  var urn = $scope.urn.split("@");
	if ( urn.length > 1 ){
  	$scope.coords = urn[1].split(',');
		get_src( urn[0] );
	}
  else {
  	get_src( urn );
  }
  $scope.max_width = 600;
  
  
  // What's the src JSON?
  
  function get_src( urn ){
    json.urn( urn ).then( function( data ){
      get_json( data['src'][0] );
    });
  }
  
  
  // Check the type
  
  function check_type( data ){
    var type = data['dct:type']
    switch( type ){
      case 'upload':
        $scope.src = data['dct:references']['@id']
      break;
      case 'item':
        get_src( data['dct:references']['@id'] )
      break;
    }
  }
  
  
  // Get the src JSON
  
  function get_json( src ){
    json.get( src ).then( function( data ){
      check_type( data );
    });
  }
  
}]);


var appDirectives = angular.module('appDirectives',[]);


// img-bit functionality.
// see .img-bit in app.scss

appDirectives.directive('imgBit', 
function(){
  return {
    link: function( scope, elem, attr ){
		
			elem.bind('load', function(e){
		  
				// Build the necessary dom elements
				
				elem.wrap( '<div class="frame">' );
				var frame = elem.parent();
				
				frame.wrap( '<div class="img-bit">' );
		  	var wrap = elem.parent();
		  	
				var height = this.naturalHeight;
				var width = this.naturalWidth;
				var param = attr.ngParam.split(',');
		  	
		  	// CSS makes the magic happen
		  	
		  	wrap.css({
		  	  display: "inline-block"
		  	});
		  	 
				frame.css({
					width: parseInt( width*param[2] ),
					height: parseInt( height*param[3] ),
					position: "relative",
					overflow: "hidden"
				});
		  	   
				elem.css({
					position: "absolute",
					display: "block",
					"vertical-align": "baseline",
					"max-width": "none",
					"max-height": "none",
				  width: width,
				  height: height,
				  top: parseInt( param[1]*height*-1 ),
				  left: parseInt( param[0]*width*-1 ),
				});
	  	});
			
    }
  }
});


// img-loc

appDirectives.directive('imgLoc',
function(){
  return {
	  link: function( scope, elem, attr ){
		  
		elem.bind('load', function(e){
			
			// Get the params you need
			
			var param = attr.ngParam.split(',');
			var height = this.naturalHeight;
			var width = this.naturalWidth;
			
			// Workout max width
			
			var max_width = param[4];
			var diff = max_width / width;
			if ( diff < 1 ){
				width = max_width
				height = height*diff
			}
			
			elem.wrap( '<div class="img-loc">' );
			var wrap = elem.parent();
			
			// CSS makes the magic happen
			// see .img-loc in app.scss to customize
		   
			wrap.css({
				width: parseInt( width ),
				height: parseInt( height ),
			  position: "relative",
			  overflow: "hidden"
			});
			
			elem.css({
				width: parseInt( width ),
			  height: parseInt( height )
			})
			
			wrap.append( '<div class="lite">' );
			var lite = elem.next();
			lite.css({
				position: "absolute",
				left: parseInt( width * param[0] ),
				top: parseInt( height * param[1] ),
				width: parseInt( width * param[2] ),
				height: parseInt( height * param[3] )
			});
			wrap.after( '<div class="clearfix"></div>' );
		});
		
	  }
  }
	
});


appDirectives.directive('imgUploader', 
function(){
  return {
    templateUrl: 'html/share/img-uploader.html'
  }
});


appDirectives.directive('collectionItemsShort', 
function(){
  return {
    templateUrl: 'html/share/collection-items-short.html'
  }
});


appDirectives.directive('collectionItems', 
function(){
  return {
    templateUrl: 'html/share/collection-items.html'
  }
});


appDirectives.directive('controlBox',
function(){
	return {
		templateUrl: 'html/share/control-box.html'
	}
});


appDirectives.directive('listMetaBox', 
function(){
  return {
    templateUrl: 'html/share/list-meta-box.html'
  }
});


appDirectives.directive('resizeItems', 
function(){
  return {
    templateUrl: 'html/share/resize-items.html'
  }
});


appDirectives.directive('uploadItems', 
function(){
  return {
    templateUrl: 'html/share/upload-items.html'
  }
});


appDirectives.directive('jsonMsgMini',
function(){
	return {
		templateUrl: 'html/share/msg/json-msg-mini.html'
	}
});


appDirectives.directive('jsonMsg',
function(){
	return {
		templateUrl: 'html/share/msg/json-msg.html'
	}
});


appDirectives.directive('jsonOut', 
function(){
  return {
    templateUrl: 'html/share/msg/json-out.html'
  }
});


appDirectives.directive('sparqlMsg',
function(){
	return {
		templateUrl: 'html/share/msg/sparql-msg.html'
	}
});


appDirectives.directive('stdOut', 
function(){
  return {
    templateUrl: 'html/share/msg/std-out.html'
  }
});


appDirectives.directive('urnServMsg',
function(){
	return {
		templateUrl: 'html/share/msg/urn-serv-msg.html'
	}
});


// Build a filterbox in list controllers

appDirectives.directive('filterBox', 
function(){
  return {
    templateUrl: 'html/share/filter-box.html'
  }
});


appDirectives.directive('navBox', 
function(){
  return {
    templateUrl: 'html/share/nav-box.html'
  }
});


appDirectives.directive('slider',
function( $timeout ){
	return {
		restrict: 'A',
		link: function( scope, elem, attr ){
			var max = 100;
			elem.slider({
				range: "min",
				value: attr.start * max,
				min: 0,
				max: max,
				slide: function( e, ui ){
					scope[attr.change]( ui.value / max );
				}
			});
		}
	}
});


appDirectives.directive('urnInfo', 
function(){
  return {
    templateUrl: 'html/share/urn-info.html'
  }
});


// Builds a box for checking URN uniqueness
// You must implement a $scope.urn_uniq function
// in your controller.

// see controllers.js: CollectionNew

appDirectives.directive('urnUniqBox', 
function(){
  return {
    templateUrl: 'html/share/urn-uniq-box.html'
  }
});


appDirectives.directive('userBox', 
function(){
  return {
    templateUrl: 'html/share/user-box.html'
  }
});


// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

var sel = '.button-group .button';

function check() {
	$( sel ).each( function() {
		var check = $(this).attr('href').split('/')[1];
		if ( check == view() ) {
			toggle(this)
		}
	});
}

function clear() { $( sel ).removeClass('selected') }

function toggle( me ) {
	$(me).addClass('selected');
}

function view() { return window.location.hash.split('/')[1] }

$(document).ready( function(){
	$(window).bind('hashchange', function() {
		clear();
		check();
	})
})


// Easy way to get a service handle...

function tserv( service ){
	return angular.element( document.body ).injector().get( service )
}


app.service( 'cropper', [
'json',
'imgup',
'config',
'urnServ',
'onto',
'item',
'tmpl',
function( json, imgup, config, urnServ, onto, item, tmpl ) {
  
  var roi_urn = null;
  var img = null;
  var item_urn = null;
  var crop_urn = null;
  var crop_tmpl = null;
  var urn = null;
  var param = [];
  
  return {
    add: add
  }
  
  
  // _urn @string ROI URN 
  // ex. 'urn:cite:perseus:manuscript.ROF3ZnNQT8q@0.7112,0.4808,0.1922,0.0774'
  
  function add( urn ){
    
    // Break-up ROI URN
    
    roi_urn = urn;
    var s = urn.split('@');
    item_urn = s[0];
    param = s[1].split(',');
    
    // Get the upload path associated with item_urn
    
    return item.upload_src( item_urn ).then(
    function( r ){
      img = r[0]['img'];
      return get_urn();
    });
  }
  
  function get_urn(){
    return urnServ.fresh( urnServ.base+"crop.{{ id }}",
    function( urn ){
      crop_urn = urn;
      return get_tmpl();
    });
  }
  
  function get_tmpl(){
    return tmpl.get( 'crop' ).then(
    function( r ){
      crop_tmpl = r;
      return set_vals();
    })
  }
  
  function set_vals(){
    crop_tmpl['@id'] = crop_urn;
    crop_tmpl[ onto.with_prefix('represents') ] = { '@id': roi_urn };
    console.log( crop_tmpl );
    send();
  }
  
  
  // Send the crop job to imgup
  
  function send(){
    var save_to = config.xhr.json.url+'/data/crop/'+crop_urn;
    return imgup.crop( img, param[0], param[1], param[2], param[3], save_to, crop_tmpl ).then(
    function( r ){
      return r;
    });
  }
  
}]);

/*

To run this in the console...

var crop = tserv('cropper');
crop.add( 'urn:cite:perseus:manuscript.ROF3ZnNQT8q@0.7112,0.4808,0.1922,0.0774' ).then(
function( r ){
  console.log( r );
});

*/


app.service( 'imgup', [
'$http',
'$q',
'$upload',
'config',
'user',
function( $http, $q, $upload, config, user ) {
	
	// Output
	
	this.msg = "";
	
	return ({
		upload: upload,
		cp_url: cp_url,
		resize: resize,
		crop: crop,
		msg: this.msg
	});
	
	
	// Copy a URL path
	
	function cp_url( src, success, error ){
		return $http({
		  method: 'POST',
		  url: config.imgup.url+'/upload',
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  data: { src: src }
		})
		.error( function( r ){
			update_msg( r );
			return r.data;
		})
		.success( function( r ){
			update_msg( r );
			return r.data;
		})
	}
	
	
	// Resize an image
	
	function resize( src, width, height, send_to, json ){
		var body = { 
			src: src,
			max_width: width,
			max_height: height,
			send_to: send_to,
			json: json
		};
		
		return $http({
			method: 'POST',
			url: config.imgup.url+'/resize',
		  headers: { 
				'Content-Type': 'application/json'
			},
			data: body
		})
		.error( function( r ){
			update_msg( r );
			return r.data;
		})
		.success( function( r ){
			update_msg( r );
			return r.data;
		})
	}
	
	
	// Crop an image
	
	function crop( src, x, y, width, height, send_to, json ){
		var body = {
			src: src,
			x: x,
			y: y,
			width: width,
			height: height,
			send_to: send_to,
			json: json
		};
		
		return $http({
			method: 'POST',
			url: config.imgup.url+'/crop',
		  headers: { 
				'Content-Type': 'application/json'
			},
			data: body
		})
		.error( function( r ){
			update_msg( r );
			return r.data;
		})
		.success( function( r ){
			update_msg( r );
			return r.data;
		})
	}
	
	
	// Upload a file to an imgup server
	
	function upload( file, success, error ){	
  	return $upload.upload({
  		url: config.imgup.url+'/upload',
  		method: 'POST',
  		file: file
   	})
  	.error( function( r ){
			update_msg( r );
  		return r.data;
   	})
  	.success( function( r ){
			update_msg( r );
  		return r.data;
   	})
  }
	
	
	// Update message
	
	function update_msg( r ){
		this.msg = r.data;
	}
	
}]);


app.service( 'resizer', [
'json',
'imgup',
'config',
'urnServ',
'onto',
'tmpl',
function( json, imgup, config, urnServ, onto, tmpl ) {
	
	var max_width = null;
	var max_height = null;
	var src = null;
	var upload = null;
	var resize_urn = null;
	var res_tmpl = null;
	var urn = null;
	
	return {
		add: add
	}
	
	function add( _urn, _max_width, _max_height ){
		max_width = _max_width;
		max_height = _max_height;
		urn = _urn;
		return upload_src()
	}
	
	function upload_src(){
		return json.urn( urn ).then( 
		function( data ){
			src = data['src'][0];
			return upload_json();
		});
	}
	
	function upload_json(){
		return json.get( src ).then(
		function( data ){
			upload = data;
			return get_urn();
		});
	}
	
	function get_urn(){
		return urnServ.fresh( urnServ.base+"resize.{{ id }}", 
		function( urn ){
			resize_urn = urn;
			return resize_tmpl();
		});
	}
	
	function resize_tmpl(){
		return tmpl.get( 'resize' ).then( 
		function( data ){
			res_tmpl = data;
			return set_vals();
		});
	}
	
	function set_vals(){
		res_tmpl['@id'] = resize_urn;
		res_tmpl[onto.with_prefix('memberOf')]['@id'] = upload['@id'];
		return send();
	}
	
	function send(){
		var save_to = config.xhr.json.url+'/data/resize/'+resize_urn;
		var img = upload[ onto.with_prefix('src') ]['@id'];
		return imgup.resize( img, 200, 200, save_to, res_tmpl ).then( 
		function( data ){
			return data;
		});
	}
	
}]);

/*

To run this in the console...

var r = tserv('resizer')
r.add('urn:cite:perseus:upload.QAlWThSWNU1', 200, 200)

*/





app.service( 'deleter', [
'json',
'onto',
'user',
'sparql',
function( json, onto, user, sparql ) {
	
	// Delete log 
	// [ { urn: server_output } ... ]
	
	var log = [{}];
	
	return ({
		urn: urn,
		log: log,
		refs: refs
	});
	
	
	// Delete by URN
	
	function urn( urn ){
		return path( urn );
	}
	
	
	// Add a log_item
	
	function log_item( urn, data ){
		log[ log.length-1 ] = {};
		log[ log.length-1 ][ urn ] = data;
	}
	
	
	// Get the the path to the JSON files
	
	function path( urn ){
		return json.urn( urn )
		.then( function( data ){
			var path = data.src[0];
			return src( path, urn )
		});
	}
	
	
	// Delete the JSON file
	
	function del( path, urn ){
		return json.del( path ).then(
		function( data ){
			log_item( urn, data );
		});
	}
	
	
	// Get related URNs
	
	function refs( src_urn ){
		
		var query = [
		onto.prefixes(),
		"SELECT ?urn ?verb",
		"WHERE {",
			"?urn ?verb <"+src_urn+">", 
		"}" ];
		
		var output = [];
		return sparql.search( query.join(' ') ).then(
		function( data ){
			for ( var i=0; i<data.length; i++ ) {
				var urn = data[i].urn.value;
				var verb = data[i].verb.value;
				if ( urn == src_urn ){ continue }
				output.push({ urn: urn, verb: onto.short( verb ) });
			}
			return output;
		});
	}
	
	
	// Remove reference
	
	function ghost( src_urn, prefix, rm_urn ){
		json.urn( src_urn )
		.then( function( data ){
			ghost_json( src_urn, prefix, rm_urn, data.src[0] );
		});
	}
	
	
	// So far all URN references use '@id'.
	// This may not be true.
	// It would be better to walk the JSON
	
	function ghost_json( src_urn, prefix, rm_urn, url ){
		json.get( url )
		.then( function( data ){
			var item = data[ prefix ];
			if( item['@id'] == rm_urn ){
				item['@id'] = '';
			}
			json.put( url, data )
		});
	}
	
	
	// Geth the JSON src file
	
	function src( path ){
		return json.get( path )
		.then( function( data ){
			
			// TODO: Check the user...
			
			// Delete the initial JSON src file
			return del( path, urn );
		});
	}
	
}]);

/*

Getting the deleter service working well.

It's probably impossible to have a totally generic deleter service.
I'd have to look at types.

Move data in and out for testing...

rm -rf /var/www/JackSON/data/*
cp -R ~/Desktop/JackSON.data.bkup/* /var/www/JackSON/data/

t = tserv('deleter');

*/


// This service adds user and timestamp data to JSON sent to server

app.service( 'jsonPrep', [
'onto',
'user',
function( onto, user ) {
	
	return({
		post: post,
		put: put
	});
	
	function post( json ){
		
	}
	
	function put( json ){
		
	}
	
}]);

/*

To test this...

var tmpl = tserv( 'tmpl' );
var json = null;
tmpl.get( 'collection' ).then(
function( json ){
	console.log
});


*/


app.service( 'json', [
'$http',
'$q',
'config',
'user',
function( $http, $q, config, user ) {
	
	
	// output
	
	this.msg = "";
	this.method = "";
	this.status = "";
	this.url = "";
	
	function state(){
		return {
			wait: 'WAIT',
			success: 'SUCCESS',
			error: 'ERROR'
		}
	};
	
	var events = [];
	function on_change( event ){ events.push( event ) }
	function run_events(){
		angular.forEach( events, function( event ){
			event( this.method, this.url, this.status, this.msg );
		});
	}
	
	
	// Avoid typos with constants
	
	var GET = 'GET';
	var POST = 'POST';
	var PUT = 'PUT';
	var DELETE = 'DELETE';
	
	
	// Publicly accessible methods
	
	return ({
		post: post,
		put: put,
		get: get,
		delete: del,
		del: del,
		ls: ls,
		urn: urn,
		disp: disp,
		on_change: on_change,
		msg: this.msg,
		method: this.method,
		status: this.status,
		state: state,
		url: this.url
	});
	
	
	// Retrieve a JSON file path by URN
	
	function urn( urn ){
		if ( urn == null ){
			return;
		}
		var request = api( GET, config.xhr.json.url+'/src?urn='+urn );
		return( request.then( 
			success, 
			error 
		));
	}
	
	
	// Turn JSON into pretty-printed string
	
	function disp( data ) {
		var json = {};
		var out = [];
		for ( var key in data ){
			if ( key == '@context' ){ 
				out[0] = angular.toJson( data[key], true );
				continue;
			}
			json[key] = data[key];
		}
		out[1] = angular.toJson( json, true );
		return out;
	}
	
	
	// Create a new JSON file if it doesn't already exist.
	
	function post( url, data ){
		var request = api( POST, rel(url), data );
		return( request.then(
			success, 
			function( r ){ return put( rel(url), data ) } 
		));
	}
	
	
	// Update data on server
	
	function put( url, data ){
		var request = api( PUT, rel(url), data );
		return( request.then( 
			success, 
			error 
		));
	}
	
	
	// DELETE the JSON
	
	function del( url ){
		var request = api( DELETE, rel(url) );
		return( request.then(
			success,
			error
		));
	}
	
	
	// GET the JSON
	
	function get( url ){
		var request = api( GET, rel(url) );
		return( request.then( 
			success, 
			error 
		));
	}
	
	
	// Run the ls command
	
	function ls( url ){
		var request = api( GET, rel(url)+"?cmd=ls" );
		return( request.then(
			success,
			error
		));
	}
	
	
	// Add 'user' field potentially.
	// Others in the future.
	
	function tack_on( data ){
		if ( tack('user') ){
			data['user'] = { '@id': user.url() }
		}
		return data;
	}
	
	function tack( key ){
		var tacks = config.xhr.json.tack_on;
		if ( tacks == undefined || tacks.indexOf( key ) == -1 ){
			return false;
		}
		return true;
	}
	
	
	// API
	
	function api( method, url, data ){
		
		this.method = method;
		this.url = url;
		this.status = state().wait;
		run_events();
		
		if ( data != undefined ){
			data = tack_on( data );
		}
		
		return $http({
			method: method.toUpperCase(),
			url: url,
		    headers: {
		        'Content-Type': 'application/json'
		    },
			data: wrap( data )
		});
	}
	
	
	// Properly resolve relative URLs
	
	function rel( url ){
		if ( url.indexOf('http://') == 0 ){
			return url;
		}
		return config.xhr.json.url+'/data/'+url;
	}
	
	
	// JackSON formatted json
	
	function wrap( json ){
		return { data: json }
	}
	
	
	// Error handler
	
	function error( r ){
		this.status = state().error;
		this.msg = angular.toJson( r.data, true );
		run_events();
		if (
			! angular.isObject( r.data ) ||
			! r.data.error
		){
			var unknown = "An unknown error occurred."
			return( $q.reject( unknown ) );
		}
		return( r.data );
	}
	
	
	// Success handler
	
	function success( r ){
		this.status = state().success;
		this.msg = angular.toJson( r.data, true );
		run_events();
		return( r.data );
	}
}]);


app.service( 'onto', [ 
'config',
function( config ) {
  var self = this;  

  function precheck( a_term ){
    return angular.isDefined( config.ontology[a_term] );
  } 
	
	
	// Get the prefix form from a url
	
	this.short = function( url ){
    for ( var key in config.ontology ) {
			var item = config.ontology[ key ];
			var verb = item['ns']+item['term'];
			if ( url == verb ) {
				return item['prefix']+":"+item['term'];
			}
    }
		return url
	}
	
	
	// Get ontology term with a prefix

  this.with_prefix = function( a_term ){
    if ( precheck( a_term ) ){
      return config.ontology[a_term].prefix + ":" + config.ontology[a_term].term;
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }

	
	// Get the ontology term with a name space
	
  this.with_ns = function( a_term ){
    if ( precheck( a_term ) ){
      return config.ontology[a_term].ns + config.ontology[a_term].term;
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }

  this.default_value = function( a_term ){
    if ( precheck( a_term ) ){
		  
      // TODO we should allow the config to specify the type as well
		  
      return config.ontology[a_term].default_value || "";
    }
	  else {
      console.log( "Missing ontology term " + a_term );
      return null;
    }
  }
	
	
	// Build all the prefixes

  this.prefixes = function() {
    var pfx_query = "";
    var seen = {};
	  
    angular.forEach( 
		Object.keys( config.ontology ), 
		function( term, i ) {
		  if ( ! seen[ config.ontology[term].prefix ] ){
			  pfx_query = pfx_query + " PREFIX " + config.ontology[term].prefix + ": <" + config.ontology[term].ns + ">";
		  }
		  seen[ config.ontology[term].prefix ] = 1;
    });
		  
    // backwards compatibility
		  
    pfx_query = pfx_query + " PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
    return pfx_query;
  }
	
	
	// Build the prefix as an array
	
	this.prefix_array = function(){
		var arr = [];
		var seen = {};
    for ( var key in config.ontology ) {
			var item = config.ontology[ key ];
			if ( ! seen[ item.prefix ] ){
				arr.push( "PREFIX " + item.prefix + ": <" + item.ns + ">" );
				seen[ item.prefix ] = 1;
			}
    }
		return arr;
	}
  
}]);



app.service( 'tmpl', [
'$http',
'config',
function( $http, config ) {
	
	return {
		get: get
	}
	
	function get( type ){
		return $http({
			method: 'GET',
			url: config.xhr.tmpl.url+'/'+type+'.json',
			headers: {
			    'Content-Type': 'application/json'
			}
		}).then( function( r ){
			return r.data;
		});
	}
	
}]);

/*

To run this in the console...

var tmpl = tserv('tmpl');
tmpl.get('resize').then( function(data){ console.log( data ) });

*/


app.service( 'urnServ', [
'sparql', 
'json', 
'host', 
'config', 
function( sparql, json, host, config ) {
  
  return ({
    uniq: uniq,
    fresh: fresh,
    claim: claim,
    base: config.serv.urn_serv.base
  })
  
  function query( urn ) {
  return "\
  SELECT count( distinct ?o )\
  WHERE { <"+urn+"> ?p ?o }"
  }
  
  function uniq( urn, callback ) {
    return sparql.search( query(urn) ).then(
    function( data ){
      var check = data[0]['.1']['value'];
      
      // urn already exists
      
      if ( check > 0 ) {
        callback( false, urn );
        return;
      }
      callback( true, urn );
      return;
    });
  }
  
  
  // Grab a fresh URN with an 11 digit id
  
  function fresh( templ, callback ) {
    var urn = templ.replace( '{{ id }}', id( 11,'#aA') );
    return uniq( urn, function( bool, urn ){
      if ( bool == true ){
      	callback( urn )
      }
			else {
				fresh( templ, callback )
			}
    })
  }
  
  
  // Generate an id
  
  function id( n, chars ) {
    var mask = '';
    if ( chars.indexOf('a') > -1 ) mask += 'abcdefghijklmnopqrstuvwxyz';
    if ( chars.indexOf('A') > -1 ) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if ( chars.indexOf('#') > -1 ) mask += '0123456789';
    var out = '';
    while ( n > 0 ) {
      out += mask[ 
        Math.round( Math.random() * ( mask.length-1 ) ) 
      ];
      n--;
    }
    return out
  }
  
  
  // Claim a URN and JackSON data location
  
  function claim( url, urn ) {
    var base = {
      '@context': {
        "urn": "http://data.perseus.org/collections/urn:"
      },
      "@id": urn
    }
    return json.post( url, base );
  }
  
}]);


app.service( 'query', [
'sparql',
'config',
'onto',
'results',
function( sparql, config, onto, results ) {
	
	
	// Public methods
	
	return {
		get: get,
		count: count,
		build: query
	}
	
	
	// Get count
	// Ignores offset, limit, and order by
	
	function count( json ){
		var b = construct( json );
		var q = onto.prefix_array();
		q = q.concat([ 
			'SELECT count( distinct ?urn )',
			'WHERE {',
		]);
		q = q.concat( b.where );
		q = q.concat([
			'}'
		]);
		return sparql.search( q.join("\n") ).then( 
		function( data ){
			return data[0]['.1']['value'];
		});
	}
	
	
	// Get the triples
	
	function get( json ){
    return sparql.search( query( json )  ).then(
    function( data ){
      return results.list( data );
    });
	}
	
	
	// Build the WHERE clause
	
	function get_where( json ){
		var where = [];
		for ( var i=0; i<json.where.length; i++ ){
			
			var tri = json.where[i];
			if ( tri == null ) continue;
			
			
			// Get options
			
			var opt = {};
			var last = tri[tri.length-1];
			if ( last instanceof Object ){
				opt = last;
			}
			
			// Create optional clauses
			
			if ( "optional" in opt ){
				if ( Array.isArray( tri[0] ) ){
					var sub = [];
					for ( var j=0; j<tri.length-1; j++ ){
						sub.push( line( tri[j] ) );
					}
					where.push( "OPTIONAL { " );
					where = where.concat( sub );
					where.push( "}" );
				}
				else {
					where.push( "OPTIONAL { "+ line( tri ) +" }" );
				}
			}
			else {
				where.push( line( tri ) );
			}
			
			// Build a filter
			
			if ( "filter" in opt ){
				where.push( "FILTER ( "+ opt.filter +" )" );
			}
			
		}
		return where;
	}
	
	
	// Construct the main body of the query
	
	function construct( json ){
		var where = get_where( json );		
		var handles = {};
		handles = get_handles( json.where, handles );
		var sel = [];
		for ( var key in handles ){
			sel.push( key );
		}
		return { where: where, selectors: sel }
	}
	
	
	// Build the query
	
	function query( json ){
		
		// Construct the main body of the query
		
		var b = construct( json );
		
		var q = onto.prefix_array();
		q = q.concat([ 
			'SELECT '+b.selectors.join(' '),
			'WHERE {',
		]);
		q = q.concat( b.where );
		q = q.concat([
			'}'
		]);
		
		// order by clause
		
		if ( 'order_by' in json ){
			q = q.concat([
				'ORDER BY '+json.order_by
			]);
		}
			
		// limit clause
		
		if ( 'limit' in json ){
			q = q.concat([
				'LIMIT '+json.limit
			]);
		}
		
		// offset clause
		
		if ( 'offset' in json ){
			q = q.concat([
				'OFFSET '+json.offset
			]);
		}
		
		// Return the query
		
		return q.join("\n");
	}
	
	
	// Get the SPARQL handles from WHERE
	
	function get_handles( search, handles ){
		for ( var i=0; i<search.length; i++ ){
			var tri = search[i];
			if ( tri == null ) continue;
			
			if ( Array.isArray( tri[0] ) ){
				get_handles( tri, handles )
			}
			
			var n = [0,2]
			for ( var j in n ){
				var index = n[j];
				if ( typeof tri[ index ] == "string" &&
						 tri[ index ].indexOf("?") == 0 ){
					handles[ tri[ index ] ] = 1;
				}
			}
		}
		return handles
	}
	
	
	// Build a triple line
	
	function line( tri ){
		var sub = tri[0];
		var obj = tri[2];
		return sub+" "+onto.with_prefix( tri[1] )+" "+obj+" .";
	}
	
}]);
/*

// Test

var t = tserv('query');
t.query();


// Samples

var json = {
	where: [
		[ '?urn', 'type', 'upload' ],
		[ '?urn', 'label', '?label', { filter:'regex( ?label, "space", "i" )' } ],
		[
			[ '?res', 'memberOf', '?urn'],
			[ '?res', 'src', '?thumb' ],
			{ optional:true }
		],
		[ '?urn', 'description', '?desc', { optional:true } ],
		[ '?urn', 'created', '?time', { optional:true } ],
		[ '?urn', 'represents', '?rep', { optional:true } ],
		[ '?urn', 'creator', '?user', { optional:true } ],
	],
	order_by: 'desc( ?time )',
	limit: 10,
	offset: 0
}  

*/


app.service( 'collection', [
'sparql',
'results',
'onto',
'query',
'user',
function( sparql, results, onto, query, user ) {
	
  return({
    get:get,
    search:search,
		items:items,
		belonging_to:belonging_to,
		mine:mine
  })
  
  function prefix(){
    return onto.prefixes();
  }
  
  
  // Get all collections
  
  function get(){
    return sparql.search( get_query() ).then( 
    function( data ){
      return results.list( data );
    });
  }
  
  function get_query(){
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    ?urn " + onto.with_prefix('type') + " 'collection'\
  }"
  }
  
  
  // Search for a specific collection
  
  function search( str ){
    return sparql.search( search_query( str ) ).then( 
    function( data ){
      return results.list( data );
    });
  }
  
  function search_query( str ){
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    ?urn " + onto.with_prefix('type') +" 'collection'\
    FILTER regex( str(?urn), \""+str+"\" )\
  }"
  }
	
	
	// Find collection items
	
	function items( urn ){
		var q = {
			where:[
				[ '?urn', 'memberOf', '<'+urn+'>' ],
				[ '?urn', 'label', '?label', { optional:true } ],
				[ '?urn', 'description', '?desc', { optional:true } ],
				[ '?urn', 'created', '?time', { optional:true } ],
				[ '?urn', 'represents', '?rep', { optional:true } ],
				[ '?urn', 'creator', '?user', { optional:true } ],
				[
					[ '?urn', 'src', '?up'],
					[ '?res', 'memberOf', '?up' ],
					[ '?res', 'src', '?thumb' ],
					{ optional:true }
				],
			]
		}
		return query.get( q ).then(
		function( data ){
			return data;
		});
	}
	
	
	// Get a user's collections
	
	function belonging_to( user_url ){
		if ( user_url == null ) {
			throw 'belonging_to() requires user_url'
		}
		var q = {
			where:[
				[ '?urn', 'type', '"collection"' ],
				[ '?urn', 'label', '?label' ],
				[ '?urn', 'creator', '<'+ user_url +'>' ]
			]
		}
		return query.get( q ).then(
		function( data ){
			return data;
		});
	}
	
	
	// Get the current user's collections
	
	function mine(){
		return belonging_to( user.url() );
	}
  
}]);

/*

var c = tserv('collection');
c.items('urn:cite:perseus:crystals');

*/


app.service( 'item', [
'sparql',
'results',
'onto',
'query',
function( sparql, results, onto, query ) {
	
  return({
    by_upload:by_upload,
    by_collection:by_collection,
		thumb:thumb,
		rois:rois,
		upload_src:upload_src
  })
  
  function prefix() {
    return onto.prefixes();
  }
  
  function old_query( where ){
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    ?urn " + onto.with_prefix('type') +" 'item'.\
    "+where+"\
  }"
  }
  
  
  // Retrieve items associated with an upload
  
  function by_upload( urn ){
    return sparql.search( upload_query(urn) ).then( 
    function( data ){
      return results.list( data );
    });
  }

  function upload_query( urn ){
  return old_query( "?urn " + onto.with_prefix('src') + " <"+urn+">" );
  }
  
  
  // Retrieve items associated with a collection
  
  function by_collection( urn ){
    return sparql.search( collection_query(urn) ).then(
    function( data ){
      return results.list( data );
    });
  }
  
  function collection_query( urn ){
    return old_query( "?urn " + onto.with_prefix('memberOf') + " <"+urn+">" );    
  }
	
	
	// Get thumbnails associated with an item
  
	function thumb( urn ){
		var q = {
			where:[
				[ '<'+urn+'>', 'src', '?up' ],
				[ '?res', 'memberOf', '?up' ],
				[ '?res', 'src', '?thumb', { optional:true } ]
			]
		}
		return query.get( q ).then(
		function( data ){
			return data;
		});
	}
	
	// Get the upload src image
	
	function upload_src( urn ){
		var q = {
			where:[
				[ '<'+urn+'>', 'src', '?up' ],
				[ '?up', 'src', '?img' ]
			]
		}
		return query.get( q ).then(
		function( data ){
			return data;
		});
	}
	
	
	// Get the ROIs associated with an item
	
	function rois( urn ){
		var q = {
			where:[
				[ '?urn', 'memberOf', '<'+urn+'>' ],
				[ '?urn', 'type', '"roi"' ],
				[ '?urn', 'x', '?x' ],
				[ '?urn', 'y', '?y' ],
				[ '?urn', 'width', '?width' ],
				[ '?urn', 'height', '?height' ],
				[ '?urn', 'label', '?label' ],
				[ '?urn', 'description', '?description' ],
			]
		}
		return query.get( q ).then(
    function( data ){
    	return data;
    });	
	}
	
}]);
/*

var c = tserv('item');
c.thumb('urn:cite:perseus:crystals.APyNKeJBqXt');

*/


app.service( 'resize', [
'sparql',
'results',
'onto', 
function( sparql, results, onto ) {
	
  return ({
    get:get
  })
  
  function prefix() {
    return onto.prefixes();
  }
  
  function query( urn ) {
  return "\
  "+prefix()+"\
  SELECT ?urn ?width ?height\
  WHERE {\
    ?urn " + onto.with_prefix('type') +" 'resize'.\
    ?urn " + onto.with_prefix('memberOf') + " <"+urn+">\
    OPTIONAL { ?urn " + onto.with_prefix('width') + " ?width . }\
    OPTIONAL { ?urn " + onto.with_prefix('height') +" ?height . }\
  }"
  }
  
  function get( urn ) {
    return sparql.search( query(urn) ).then( 
    function( data ){
      return results.list( data );
    });
  }
}]);



app.service( 'roi', [
'query',
'onto',
'user',
function( query, onto, user ){
  
  return({
    by_label:by_label
  })
  
  
  // Get the ROIs by label
  
  function by_label( filter ){
    var q = {
      where:[
        [ '?urn', 'type', '"roi"'],
        [ '?urn', 'label', '?label', 
          { filter:'regex( ?label, "'+ filter +'", "i" )' }
        ],
				[ '?urn', 'description', '?description', { optional: true } ],
        [
          [ '?crop', 'represents', '?urn' ],
          [ '?crop', 'type', '"crop"' ],
          [ '?crop', 'src', '?src' ],
          { optional: true }
        ] 
      ]
    }
    return query.get( q ).then(
    function( r ){
      return r
    });
  }
  
}
  
]);


app.service( 'upload', [
'sparql',
'results',
'onto',
function( sparql, results, onto ){
	
  return({
    by_annotation:by_annotation
  })
  
  function prefix() {
    return onto.prefixes();
  }
  
  function by_annotation( urn ) {
    return sparql.search( annotation_query( urn ) ).then(
    function( data ){
      return results.list( data );
    });
  }
  
  function annotation_query( urn ) {
  return "\
  "+prefix()+"\
  SELECT ?urn\
  WHERE {\
    <"+urn+"> " + onto.with_prefix('memberOf') + " ?item .\
    ?item " + onto.with_prefix('src') + " ?urn\
  }"
  }
}]);



// Process results returned from SPARQL query

app.service( 'results', [ 
function( sparql ) {
  
  return({
    list:list,
    more:more
  });
	
  
  // URN list
  
  function list( data ){
    var out = [];
    for ( var i=0; i<data.length; i++ ){
      var item = {};
      for ( var key in data[i] ){
        item[key] = data[i][key].value;
      }
      out.push( item );
    }
    return out;
  }
  
  function key_swap( swap, config ){
    for ( var key in config ){
      if ( swap.indexOf( config[key] ) == 0 ) {
        return swap.replace( config[key], key+":" );
      }
    }
    return swap;
  }
  
	
  // More than the URN list
  
  function more( data, config ){
    var out = [];
    var urns = {};
    for ( var i=0; i<data.length; i++ ){
      var urn = data[i].urn.value;
      var p = key_swap( data[i].p.value, config );
      var o = data[i].o.value;
      if ( ! ( urn in urns ) ){
        urns[ urn ] = {};
      }
      urns[ urn ][ 'urn' ] = urn;
      urns[ urn ][ p ] = o;
    }
    for ( var key in urns ){
      out.push( urns[key] );
    }
    return out;
  }

}]);


app.service( 'sparql', [
'$http', 
'$q',
'config', 
function( $http, $q, config ) {
	
	this.query = "";
	
	
	// Service states
	
	function state(){
		return {
			wait: 'WAIT',
			success: 'SUCCESS',
			error: 'ERROR'
		}
	};
	
	
	// Run events on success
	
	var events = [];
	function on_change( event ){ events.push( event ) }
	function run_events(){
		angular.forEach( events, function( event ){
			event( 'whoa', this.query );
		});
	}
	
	
	// SPARQL search
	
	function search( search ) {
		var request = get( search );
		return( request.then( 
			success,
			error
		));
	}
	
	function success( r ){
		run_events()
		return r.data.results.bindings
	}
	
	function error( r ){
		run_events()
		return r
	}
	
	
	// JackSON wrapper
	
	function get( search ) {
		this.query = search;
	  var url = config.xhr.sparql.url+'?query='+encodeURIComponent( search )+"&output=json";
		return $http({
			method: 'GET',
			url: url,
		    headers: {
		        'Content-Type': 'application/json'
		    }
		});
	}
	
	
	// Publicly accessible methods
	
	return ({
		search: search,
		on_change: on_change
	});
}]);


app.service( 'user', [ '$http', '$q', 'config', function( $http, $q, config ) {
  
  // Event namespace
  
  var ns = 'SERVICE.USER.';
  
  // Variables
  
  var data = null;
  var error = null;
  
  
  // What gets made available?
  
  return({
    data: function(){ 
      return ( data != null ) ? data : null;
    },
    dir: function(){ 
      return ( data != null ) ? data.uri.dirname() : null; 
    },
    id: function(){ 
      return ( data != null ) ? data.uri : null; 
    },
    url: function(){ 
      return ( data != null ) ? data.uri : null;
    },
    name: function(){
      return ( data != null ) ? data.name : null;
    },
    events: {
      ok: ns+'OK',
      error: ns+'ERROR'
    },
    error: function(){ return error },
    check: check,
    only: false
  });
  
  
  // Make sure user exists
  // see app.js/
  
  function check(){
    var def = $q.defer();
    
    // If you already have user data
    // don't request new user data
    
    if ( data != null ){
      def.resolve();
      return def.promise
    }
    
    // Ping Perseids to get user data
    
    $http.get(config.serv.user.ping, { withCredentials: true} ).then( 
      function( res ){
        data = res.data.user;
        def.resolve();
      },
      function( err ){
        error = err;
        def.reject();
      }
    )
    return def.promise;
  }
}]);



app.service( 'stdout', [ 
function() {
  
  this.msg = ">>\n";
  
  // Write output message
  
  function log( str ) {
    if ( typeof str == 'object' ){
      str = angular.toJson( str, true );
    }
    this.msg += str+"\n";
  }
  
  return ({
    log: log,
    msg: this.msg
  })
}]);