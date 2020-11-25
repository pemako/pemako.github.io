---
layout: post
title: PHP函数参考-核心扩展库
description: 'php,手册'
keywords: 'php,手册,语法'
category: php
tags:
  - php
---

# 02-核心扩展库

PHP官方手册主要包含了四大部分为了便于查阅进行整理总结，本篇主要是第二部分函数参考。

## 核心扩展库

### 1. 字符串

* [addcslashes](2017-02-13-php-function-reference.md) Quote string with slashes in a C style
* [addslashes](2017-02-13-php-function-reference.md) Quote string with slashes
* [bin2hex](2017-02-13-php-function-reference.md) Convert binary data into hexadecimal representation
* [chop](2017-02-13-php-function-reference.md) Alias of rtrim
* [chr](2017-02-13-php-function-reference.md) Return a specific character
* [chunk\_split](2017-02-13-php-function-reference.md) Split a string into smaller chunks
* [convert\_cyr\_string](2017-02-13-php-function-reference.md) Convert from one Cyrillic character set to another
* [convert\_uudecode](2017-02-13-php-function-reference.md) Decode a uuencoded string
* [convert\_uuencode](2017-02-13-php-function-reference.md) Uuencode a string
* [count\_chars](2017-02-13-php-function-reference.md) Return information about characters used in a string
* [crc32](2017-02-13-php-function-reference.md) Calculates the crc32 polynomial of a string
* [crypt](2017-02-13-php-function-reference.md) One-way string hashing
* [echo](2017-02-13-php-function-reference.md) Output one or more strings
* [explode](2017-02-13-php-function-reference.md) Split a string by string
* [fprintf](2017-02-13-php-function-reference.md) Write a formatted string to a stream
* [get\_html\_translation\_table](2017-02-13-php-function-reference.md) Returns the translation table used by htmlspecialchars and htmlentities
* [hebrev](2017-02-13-php-function-reference.md) Convert logical Hebrew text to visual text
* [hebrevc](2017-02-13-php-function-reference.md) Convert logical Hebrew text to visual text with newline conversion
* [hex2bin](2017-02-13-php-function-reference.md) Decodes a hexadecimally encoded binary string
* [html\_entity\_decode](2017-02-13-php-function-reference.md) Convert all HTML entities to their applicable characters
* [htmlentities](2017-02-13-php-function-reference.md) Convert all applicable characters to HTML entities
* [htmlspecialchars\_decode](2017-02-13-php-function-reference.md) Convert special HTML entities back to characters
* [htmlspecialchars](2017-02-13-php-function-reference.md) Convert special characters to HTML entities
* [implode](2017-02-13-php-function-reference.md) Join array elements with a string
* [join](2017-02-13-php-function-reference.md) Alias of implode
* [lcfirst](2017-02-13-php-function-reference.md) Make a string's first character lowercase
* [levenshtein](2017-02-13-php-function-reference.md) Calculate Levenshtein distance between two strings
* [localeconv](2017-02-13-php-function-reference.md) Get numeric formatting information
* [ltrim](2017-02-13-php-function-reference.md) Strip whitespace \(or other characters\) from the beginning of a string
* [md5\_file](2017-02-13-php-function-reference.md) Calculates the md5 hash of a given file
* [md5](2017-02-13-php-function-reference.md) Calculate the md5 hash of a string
* [metaphone](2017-02-13-php-function-reference.md) Calculate the metaphone key of a string
* [money\_format](2017-02-13-php-function-reference.md) Formats a number as a currency string
* [nl\_langinfo](2017-02-13-php-function-reference.md) Query language and locale information
* [nl2br](2017-02-13-php-function-reference.md) Inserts HTML line breaks before all newlines in a string
* [number\_format](2017-02-13-php-function-reference.md) Format a number with grouped thousands
* [ord](2017-02-13-php-function-reference.md) Return ASCII value of character
* [parse\_str](2017-02-13-php-function-reference.md) Parses the string into variables
* [print](2017-02-13-php-function-reference.md) Output a string
* [printf](2017-02-13-php-function-reference.md) Output a formatted string
* [quoted\_printable\_decode](2017-02-13-php-function-reference.md) Convert a quoted-printable string to an 8 bit string
* [quoted\_printable\_encode](2017-02-13-php-function-reference.md) Convert a 8 bit string to a quoted-printable string
* [quotemeta](2017-02-13-php-function-reference.md) Quote meta characters
* [rtrim](2017-02-13-php-function-reference.md) Strip whitespace \(or other characters\) from the end of a string
* [setlocale](2017-02-13-php-function-reference.md) Set locale information
* [sha1\_file](2017-02-13-php-function-reference.md) Calculate the sha1 hash of a file
* [sha1](2017-02-13-php-function-reference.md) Calculate the sha1 hash of a string
* [similar\_text](2017-02-13-php-function-reference.md) Calculate the similarity between two strings
* [soundex](2017-02-13-php-function-reference.md) Calculate the soundex key of a string
* [sprintf](2017-02-13-php-function-reference.md) Return a formatted string
* [sscanf](2017-02-13-php-function-reference.md) Parses input from a string according to a format
* [str\_getcsv](2017-02-13-php-function-reference.md) Parse a CSV string into an array
* [str\_ireplace](2017-02-13-php-function-reference.md) Case-insensitive version of str\_replace.
* [str\_pad](2017-02-13-php-function-reference.md) Pad a string to a certain length with another string
* [str\_repeat](2017-02-13-php-function-reference.md) Repeat a string
* [str\_replace](2017-02-13-php-function-reference.md) Replace all occurrences of the search string with the replacement string
* [str\_rot13](2017-02-13-php-function-reference.md) Perform the rot13 transform on a string
* [str\_shuffle](2017-02-13-php-function-reference.md) Randomly shuffles a string
* [str\_split](2017-02-13-php-function-reference.md) Convert a string to an array
* [str\_word\_count](2017-02-13-php-function-reference.md) Return information about words used in a string
* [strcasecmp](2017-02-13-php-function-reference.md) Binary safe case-insensitive string comparison
* [strchr](2017-02-13-php-function-reference.md) Alias of strstr
* [strcmp](2017-02-13-php-function-reference.md) Binary safe string comparison
* [strcoll](2017-02-13-php-function-reference.md) Locale based string comparison
* [strcspn](2017-02-13-php-function-reference.md) Find length of initial segment not matching mask
* [strip\_tags](2017-02-13-php-function-reference.md) Strip HTML and PHP tags from a string
* [stripcslashes](2017-02-13-php-function-reference.md) Un-quote string quoted with addcslashes
* [stripos](2017-02-13-php-function-reference.md) Find the position of the first occurrence of a case-insensitive substring in a string
* [stripslashes](2017-02-13-php-function-reference.md) Un-quotes a quoted string
* [stristr](2017-02-13-php-function-reference.md) Case-insensitive strstr
* [strlen](2017-02-13-php-function-reference.md) Get string length
* [strnatcasecmp](2017-02-13-php-function-reference.md) Case insensitive string comparisons using a "natural order" algorithm
* [strnatcmp](2017-02-13-php-function-reference.md) String comparisons using a "natural order" algorithm
* [strncasecmp](2017-02-13-php-function-reference.md) Binary safe case-insensitive string comparison of the first n characters
* [strncmp](2017-02-13-php-function-reference.md) Binary safe string comparison of the first n characters
* [strpbrk](2017-02-13-php-function-reference.md) Search a string for any of a set of characters
* [strpos](2017-02-13-php-function-reference.md) Find the position of the first occurrence of a substring in a string
* [strrchr](2017-02-13-php-function-reference.md) Find the last occurrence of a character in a string
* [strrev](2017-02-13-php-function-reference.md) Reverse a string
* [strripos](2017-02-13-php-function-reference.md) Find the position of the last occurrence of a case-insensitive substring in a string
* [strrpos](2017-02-13-php-function-reference.md) Find the position of the last occurrence of a substring in a string
* [strspn](2017-02-13-php-function-reference.md) Finds the length of the initial segment of a string consisting entirely of characters contained within a given mask.
* [strstr](2017-02-13-php-function-reference.md) Find the first occurrence of a string
* [strtok](2017-02-13-php-function-reference.md) Tokenize string
* [strtolower](2017-02-13-php-function-reference.md) Make a string lowercase
* [strtoupper](2017-02-13-php-function-reference.md) Make a string uppercase
* [strtr](2017-02-13-php-function-reference.md) Translate characters or replace substrings
* [substr\_compare](2017-02-13-php-function-reference.md) Binary safe comparison of two strings from an offset, up to length characters
* [substr\_count](2017-02-13-php-function-reference.md) Count the number of substring occurrences
* [substr\_replace](2017-02-13-php-function-reference.md) Replace text within a portion of a string
* [substr](2017-02-13-php-function-reference.md) Return part of a string
* [trim](2017-02-13-php-function-reference.md) Strip whitespace \(or other characters\) from the beginning and end of a string
* [ucfirst](2017-02-13-php-function-reference.md) Make a string's first character uppercase
* [ucwords](2017-02-13-php-function-reference.md) Uppercase the first character of each word in a string
* [vfprintf](2017-02-13-php-function-reference.md) Write a formatted string to a stream
* [vprintf](2017-02-13-php-function-reference.md) Output a formatted string
* [vsprintf](2017-02-13-php-function-reference.md) Return a formatted string
* [wordwrap](2017-02-13-php-function-reference.md) Wraps a string to a given number of characters

### 2. 数组

* [array\_change\_key\_case](2017-02-13-php-function-reference.md) Changes the case of all keys in an array
* [array\_chunk](2017-02-13-php-function-reference.md) Split an array into chunks
* [array\_column](2017-02-13-php-function-reference.md) Return the values from a single column in the input array
* [array\_combine](2017-02-13-php-function-reference.md) Creates an array by using one array for keys and another for its values
* [array\_count\_values](2017-02-13-php-function-reference.md) Counts all the values of an array
* [array\_diff\_assoc](2017-02-13-php-function-reference.md) Computes the difference of arrays with additional index check
* [array\_diff\_key](2017-02-13-php-function-reference.md) Computes the difference of arrays using keys for comparison
* [array\_diff\_uassoc](2017-02-13-php-function-reference.md) Computes the difference of arrays with additional index check which is performed by a user supplied callback function
* [array\_diff\_ukey](2017-02-13-php-function-reference.md) Computes the difference of arrays using a callback function on the keys for comparison
* [array\_diff](2017-02-13-php-function-reference.md) Computes the difference of arrays
* [array\_fill\_keys](2017-02-13-php-function-reference.md) Fill an array with values, specifying keys
* [array\_fill](2017-02-13-php-function-reference.md) Fill an array with values
* [array\_filter](2017-02-13-php-function-reference.md) Filters elements of an array using a callback function
* [array\_flip](2017-02-13-php-function-reference.md) Exchanges all keys with their associated values in an array
* [array\_intersect\_assoc](2017-02-13-php-function-reference.md) Computes the intersection of arrays with additional index check
* [array\_intersect\_key](2017-02-13-php-function-reference.md) Computes the intersection of arrays using keys for comparison
* [array\_intersect\_uassoc](2017-02-13-php-function-reference.md) Computes the intersection of arrays with additional index check, compares indexes by a callback function
* [array\_intersect\_ukey](2017-02-13-php-function-reference.md) Computes the intersection of arrays using a callback function on the keys for comparison
* [array\_intersect](2017-02-13-php-function-reference.md) Computes the intersection of arrays
* [array\_key\_exists](2017-02-13-php-function-reference.md) Checks if the given key or index exists in the array
* [array\_keys](2017-02-13-php-function-reference.md) Return all the keys or a subset of the keys of an array
* [array\_map](2017-02-13-php-function-reference.md) Applies the callback to the elements of the given arrays
* [array\_merge\_recursive](2017-02-13-php-function-reference.md) Merge two or more arrays recursively
* [array\_merge](2017-02-13-php-function-reference.md) Merge one or more arrays
* [array\_multisort](2017-02-13-php-function-reference.md) Sort multiple or multi-dimensional arrays
* [array\_pad](2017-02-13-php-function-reference.md) Pad array to the specified length with a value
* [array\_pop](2017-02-13-php-function-reference.md) Pop the element off the end of array
* [array\_product](2017-02-13-php-function-reference.md) Calculate the product of values in an array
* [array\_push](2017-02-13-php-function-reference.md) Push one or more elements onto the end of array
* [array\_rand](2017-02-13-php-function-reference.md) Pick one or more random entries out of an array
* [array\_reduce](2017-02-13-php-function-reference.md) Iteratively reduce the array to a single value using a callback function
* [array\_replace\_recursive](2017-02-13-php-function-reference.md) Replaces elements from passed arrays into the first array recursively
* [array\_replace](2017-02-13-php-function-reference.md) Replaces elements from passed arrays into the first array
* [array\_reverse](2017-02-13-php-function-reference.md) Return an array with elements in reverse order
* [array\_search](2017-02-13-php-function-reference.md) Searches the array for a given value and returns the first corresponding key if successful
* [array\_shift](2017-02-13-php-function-reference.md) Shift an element off the beginning of array
* [array\_slice](2017-02-13-php-function-reference.md) Extract a slice of the array
* [array\_splice](2017-02-13-php-function-reference.md) Remove a portion of the array and replace it with something else
* [array\_sum](2017-02-13-php-function-reference.md) Calculate the sum of values in an array
* [array\_udiff\_assoc](2017-02-13-php-function-reference.md) Computes the difference of arrays with additional index check, compares data by a callback function
* [array\_udiff\_uassoc](2017-02-13-php-function-reference.md) Computes the difference of arrays with additional index check, compares data and indexes by a callback function
* [array\_udiff](2017-02-13-php-function-reference.md) Computes the difference of arrays by using a callback function for data comparison
* [array\_uintersect\_assoc](2017-02-13-php-function-reference.md) Computes the intersection of arrays with additional index check, compares data by a callback function
* [array\_uintersect\_uassoc](2017-02-13-php-function-reference.md) Computes the intersection of arrays with additional index check, compares data and indexes by separate callback functions
* [array\_uintersect](2017-02-13-php-function-reference.md) Computes the intersection of arrays, compares data by a callback function
* [array\_unique](2017-02-13-php-function-reference.md) Removes duplicate values from an array
* [array\_unshift](2017-02-13-php-function-reference.md) Prepend one or more elements to the beginning of an array
* [array\_values](2017-02-13-php-function-reference.md) Return all the values of an array
* [array\_walk\_recursive](2017-02-13-php-function-reference.md) Apply a user function recursively to every member of an array
* [array\_walk](2017-02-13-php-function-reference.md) Apply a user supplied function to every member of an array
* [array](2017-02-13-php-function-reference.md) Create an array
* [arsort](2017-02-13-php-function-reference.md) Sort an array in reverse order and maintain index association
* [asort](2017-02-13-php-function-reference.md) Sort an array and maintain index association
* [compact](2017-02-13-php-function-reference.md) Create array containing variables and their values
* [count](2017-02-13-php-function-reference.md) Count all elements in an array, or something in an object
* [current](2017-02-13-php-function-reference.md) Return the current element in an array
* [each](2017-02-13-php-function-reference.md) Return the current key and value pair from an array and advance the array cursor
* [end](2017-02-13-php-function-reference.md) Set the internal pointer of an array to its last element
* [extract](2017-02-13-php-function-reference.md) Import variables into the current symbol table from an array
* [in\_array](2017-02-13-php-function-reference.md) Checks if a value exists in an array
* [key\_exists](2017-02-13-php-function-reference.md) Alias of array\_key\_exists
* [key](2017-02-13-php-function-reference.md) Fetch a key from an array
* [krsort](2017-02-13-php-function-reference.md) Sort an array by key in reverse order
* [ksort](2017-02-13-php-function-reference.md) Sort an array by key
* [list](2017-02-13-php-function-reference.md) Assign variables as if they were an array
* [natcasesort](2017-02-13-php-function-reference.md) Sort an array using a case insensitive "natural order" algorithm
* [natsort](2017-02-13-php-function-reference.md) Sort an array using a "natural order" algorithm
* [next](2017-02-13-php-function-reference.md) Advance the internal array pointer of an array
* [pos](2017-02-13-php-function-reference.md) Alias of current
* [prev](2017-02-13-php-function-reference.md) Rewind the internal array pointer
* [range](2017-02-13-php-function-reference.md) Create an array containing a range of elements
* [reset](2017-02-13-php-function-reference.md) Set the internal pointer of an array to its first element
* [rsort](2017-02-13-php-function-reference.md) Sort an array in reverse order
* [shuffle](2017-02-13-php-function-reference.md) Shuffle an array
* [sizeof](2017-02-13-php-function-reference.md) Alias of count
* [sort](2017-02-13-php-function-reference.md) Sort an array
* [uasort](2017-02-13-php-function-reference.md) Sort an array with a user-defined comparison function and maintain index association
* [uksort](2017-02-13-php-function-reference.md) Sort an array by keys using a user-defined comparison function
* [usort](2017-02-13-php-function-reference.md) Sort an array by values using a user-defined comparison function

### 3. 类/对象

* [\_\_autoload](2017-02-13-php-function-reference.md) Attempt to load undefined class
* [call\_user\_method\_array](2017-02-13-php-function-reference.md) Call a user method given with an array of parameters
* [call\_user\_method](2017-02-13-php-function-reference.md) Call a user method on an specific object
* [class\_alias](2017-02-13-php-function-reference.md) Creates an alias for a class
* [class\_exists](2017-02-13-php-function-reference.md) Checks if the class has been defined
* [get\_called\_class](2017-02-13-php-function-reference.md) the "Late Static Binding" class name
* [get\_class\_methods](2017-02-13-php-function-reference.md) Gets the class methods' names
* [get\_class\_vars](2017-02-13-php-function-reference.md) Get the default properties of the class
* [get\_class](2017-02-13-php-function-reference.md) Returns the name of the class of an object
* [get\_declared\_classes](2017-02-13-php-function-reference.md) Returns an array with the name of the defined classes
* [get\_declared\_interfaces](2017-02-13-php-function-reference.md) Returns an array of all declared interfaces
* [get\_declared\_traits](2017-02-13-php-function-reference.md) Returns an array of all declared traits
* [get\_object\_vars](2017-02-13-php-function-reference.md) Gets the properties of the given object
* [get\_parent\_class](2017-02-13-php-function-reference.md) Retrieves the parent class name for object or class
* [interface\_exists](2017-02-13-php-function-reference.md) Checks if the interface has been defined
* [is\_a](2017-02-13-php-function-reference.md) Checks if the object is of this class or has this class as one of its parents
* [is\_subclass\_of](2017-02-13-php-function-reference.md) Checks if the object has this class as one of its parents or implements it.
* [method\_exists](2017-02-13-php-function-reference.md) Checks if the class method exists
* [property\_exists](2017-02-13-php-function-reference.md) Checks if the object or class has a property
* [trait\_exists](2017-02-13-php-function-reference.md) Checks if the trait exists

### 4. 日期/时间

* [checkdate](2017-02-13-php-function-reference.md) Validate a Gregorian date
* [date\_add](2017-02-13-php-function-reference.md) Alias of DateTime::add
* [date\_create\_from\_format](2017-02-13-php-function-reference.md) Alias of DateTime::createFromFormat
* [date\_create\_immutable\_from\_format](2017-02-13-php-function-reference.md) Alias of DateTimeImmutable::createFromFormat
* [date\_create\_immutable](2017-02-13-php-function-reference.md) Alias of DateTimeImmutable::\_\_construct
* [date\_create](2017-02-13-php-function-reference.md) Alias of DateTime::\_\_construct
* [date\_date\_set](2017-02-13-php-function-reference.md) Alias of DateTime::setDate
* [date\_default\_timezone\_get](2017-02-13-php-function-reference.md) Gets the default timezone used by all date/time functions in a script
* [date\_default\_timezone\_set](2017-02-13-php-function-reference.md) Sets the default timezone used by all date/time functions in a script
* [date\_diff](2017-02-13-php-function-reference.md) Alias of DateTime::diff
* [date\_format](2017-02-13-php-function-reference.md) Alias of DateTime::format
* [date\_get\_last\_errors](2017-02-13-php-function-reference.md) Alias of DateTime::getLastErrors
* [date\_interval\_create\_from\_date\_string](2017-02-13-php-function-reference.md) Alias of DateInterval::createFromDateString
* [date\_interval\_format](2017-02-13-php-function-reference.md) Alias of DateInterval::format
* [date\_isodate\_set](2017-02-13-php-function-reference.md) Alias of DateTime::setISODate
* [date\_modify](2017-02-13-php-function-reference.md) Alias of DateTime::modify
* [date\_offset\_get](2017-02-13-php-function-reference.md) Alias of DateTime::getOffset
* [date\_parse\_from\_format](2017-02-13-php-function-reference.md) Get info about given date formatted according to the specified format
* [date\_parse](2017-02-13-php-function-reference.md) Returns associative array with detailed info about given date
* [date\_sub](2017-02-13-php-function-reference.md) Alias of DateTime::sub
* [date\_sun\_info](2017-02-13-php-function-reference.md) Returns an array with information about sunset/sunrise and twilight begin/end
* [date\_sunrise](2017-02-13-php-function-reference.md) Returns time of sunrise for a given day and location
* [date\_sunset](2017-02-13-php-function-reference.md) Returns time of sunset for a given day and location
* [date\_time\_set](2017-02-13-php-function-reference.md) Alias of DateTime::setTime
* [date\_timestamp\_get](2017-02-13-php-function-reference.md) Alias of DateTime::getTimestamp
* [date\_timestamp\_set](2017-02-13-php-function-reference.md) Alias of DateTime::setTimestamp
* [date\_timezone\_get](2017-02-13-php-function-reference.md) Alias of DateTime::getTimezone
* [date\_timezone\_set](2017-02-13-php-function-reference.md) Alias of DateTime::setTimezone
* [date](2017-02-13-php-function-reference.md) Format a local time/date
* [getdate](2017-02-13-php-function-reference.md) Get date/time information
* [gettimeofday](2017-02-13-php-function-reference.md) Get current time
* [gmdate](2017-02-13-php-function-reference.md) Format a GMT/UTC date/time
* [gmmktime](2017-02-13-php-function-reference.md) Get Unix timestamp for a GMT date
* [gmstrftime](2017-02-13-php-function-reference.md) Format a GMT/UTC time/date according to locale settings
* [idate](2017-02-13-php-function-reference.md) Format a local time/date as integer
* [localtime](2017-02-13-php-function-reference.md) Get the local time
* [microtime](2017-02-13-php-function-reference.md) Return current Unix timestamp with microseconds
* [mktime](2017-02-13-php-function-reference.md) Get Unix timestamp for a date
* [strftime](2017-02-13-php-function-reference.md) Format a local time/date according to locale settings
* [strptime](2017-02-13-php-function-reference.md) Parse a time/date generated with strftime
* [strtotime](2017-02-13-php-function-reference.md) Parse about any English textual datetime description into a Unix timestamp
* [time](2017-02-13-php-function-reference.md) Return current Unix timestamp
* [timezone\_abbreviations\_list](2017-02-13-php-function-reference.md) Alias of DateTimeZone::listAbbreviations
* [timezone\_identifiers\_list](2017-02-13-php-function-reference.md) Alias of DateTimeZone::listIdentifiers
* [timezone\_location\_get](2017-02-13-php-function-reference.md) Alias of DateTimeZone::getLocation
* [timezone\_name\_from\_abbr](2017-02-13-php-function-reference.md) Returns the timezone name from abbreviation
* [timezone\_name\_get](2017-02-13-php-function-reference.md) Alias of DateTimeZone::getName
* [timezone\_offset\_get](2017-02-13-php-function-reference.md) Alias of DateTimeZone::getOffset
* [timezone\_open](2017-02-13-php-function-reference.md) Alias of DateTimeZone::\_\_construct
* [timezone\_transitions\_get](2017-02-13-php-function-reference.md) Alias of DateTimeZone::getTransitions
* [timezone\_version\_get](2017-02-13-php-function-reference.md) Gets the version of the timezonedb

### 5. 目录

* [chdir](2017-02-13-php-function-reference.md) Change directory
* [chroot](2017-02-13-php-function-reference.md) Change the root directory
* [closedir](2017-02-13-php-function-reference.md) Close directory handle
* [dir](2017-02-13-php-function-reference.md) Return an instance of the Directory class
* [getcwd](2017-02-13-php-function-reference.md) Gets the current working directory
* [opendir](2017-02-13-php-function-reference.md) Open directory handle
* [readdir](2017-02-13-php-function-reference.md) Read entry from directory handle
* [rewinddir](2017-02-13-php-function-reference.md) Rewind directory handle
* [scandir](2017-02-13-php-function-reference.md) List files and directories inside the specified path

### 6. 错误处理

* [debug\_backtrace](2017-02-13-php-function-reference.md) Generates a backtrace
* [debug\_print\_backtrace](2017-02-13-php-function-reference.md) Prints a backtrace
* [error\_clear\_last](2017-02-13-php-function-reference.md) Clear the most recent error
* [error\_get\_last](2017-02-13-php-function-reference.md) Get the last occurred error
* [error\_log](2017-02-13-php-function-reference.md) Send an error message to the defined error handling routines
* [error\_reporting](2017-02-13-php-function-reference.md) Sets which PHP errors are reported
* [restore\_error\_handler](2017-02-13-php-function-reference.md) Restores the previous error handler function
* [restore\_exception\_handler](2017-02-13-php-function-reference.md) Restores the previously defined exception handler function
* [set\_error\_handler](2017-02-13-php-function-reference.md) Sets a user-defined error handler function
* [set\_exception\_handler](2017-02-13-php-function-reference.md) Sets a user-defined exception handler function
* [trigger\_error](2017-02-13-php-function-reference.md) Generates a user-level error/warning/notice message
* [user\_error](2017-02-13-php-function-reference.md) Alias of trigger\_error

### 7. 程序执行

* [escapeshellarg](2017-02-13-php-function-reference.md) Escape a string to be used as a shell argument
* [escapeshellcmd](2017-02-13-php-function-reference.md) Escape shell metacharacters
* [exec](2017-02-13-php-function-reference.md) Execute an external program
* [passthru](2017-02-13-php-function-reference.md) Execute an external program and display raw output
* [proc\_close](2017-02-13-php-function-reference.md) Close a process opened by proc\_open and return the exit code of that process
* [proc\_get\_status](2017-02-13-php-function-reference.md) Get information about a process opened by proc\_open
* [proc\_nice](2017-02-13-php-function-reference.md) Change the priority of the current process
* [proc\_open](2017-02-13-php-function-reference.md) Execute a command and open file pointers for input/output
* [proc\_terminate](2017-02-13-php-function-reference.md) Kills a process opened by proc\_open
* [shell\_exec](2017-02-13-php-function-reference.md) Execute command via shell and return the complete output as a string
* [system](2017-02-13-php-function-reference.md) Execute an external program and display the output

### 8. Filesystem

* [basename](2017-02-13-php-function-reference.md) Returns trailing name component of path
* [chgrp](2017-02-13-php-function-reference.md) Changes file group
* [chmod](2017-02-13-php-function-reference.md) Changes file mode
* [chown](2017-02-13-php-function-reference.md) Changes file owner
* [clearstatcache](2017-02-13-php-function-reference.md) Clears file status cache
* [copy](2017-02-13-php-function-reference.md) Copies file
* [delete](2017-02-13-php-function-reference.md) See unlink or unset
* [dirname](2017-02-13-php-function-reference.md) Returns a parent directory's path
* [disk\_free\_space](2017-02-13-php-function-reference.md) Returns available space on filesystem or disk partition
* [disk\_total\_space](2017-02-13-php-function-reference.md) Returns the total size of a filesystem or disk partition
* [diskfreespace](2017-02-13-php-function-reference.md) Alias of disk\_free\_space
* [fclose](2017-02-13-php-function-reference.md) Closes an open file pointer
* [feof](2017-02-13-php-function-reference.md) Tests for end-of-file on a file pointer
* [fflush](2017-02-13-php-function-reference.md) Flushes the output to a file
* [fgetc](2017-02-13-php-function-reference.md) Gets character from file pointer
* [fgetcsv](2017-02-13-php-function-reference.md) Gets line from file pointer and parse for CSV fields
* [fgets](2017-02-13-php-function-reference.md) Gets line from file pointer
* [fgetss](2017-02-13-php-function-reference.md) Gets line from file pointer and strip HTML tags
* [file\_exists](2017-02-13-php-function-reference.md) Checks whether a file or directory exists
* [file\_get\_contents](2017-02-13-php-function-reference.md) Reads entire file into a string
* [file\_put\_contents](2017-02-13-php-function-reference.md) Write a string to a file
* [file](2017-02-13-php-function-reference.md) Reads entire file into an array
* [fileatime](2017-02-13-php-function-reference.md) Gets last access time of file
* [filectime](2017-02-13-php-function-reference.md) Gets inode change time of file
* [filegroup](2017-02-13-php-function-reference.md) Gets file group
* [fileinode](2017-02-13-php-function-reference.md) Gets file inode
* [filemtime](2017-02-13-php-function-reference.md) Gets file modification time
* [fileowner](2017-02-13-php-function-reference.md) Gets file owner
* [fileperms](2017-02-13-php-function-reference.md) Gets file permissions
* [filesize](2017-02-13-php-function-reference.md) Gets file size
* [filetype](2017-02-13-php-function-reference.md) Gets file type
* [flock](2017-02-13-php-function-reference.md) Portable advisory file locking
* [fnmatch](2017-02-13-php-function-reference.md) Match filename against a pattern
* [fopen](2017-02-13-php-function-reference.md) Opens file or URL
* [fpassthru](2017-02-13-php-function-reference.md) Output all remaining data on a file pointer
* [fputcsv](2017-02-13-php-function-reference.md) Format line as CSV and write to file pointer
* [fputs](2017-02-13-php-function-reference.md) Alias of fwrite
* [fread](2017-02-13-php-function-reference.md) Binary-safe file read
* [fscanf](2017-02-13-php-function-reference.md) Parses input from a file according to a format
* [fseek](2017-02-13-php-function-reference.md) Seeks on a file pointer
* [fstat](2017-02-13-php-function-reference.md) Gets information about a file using an open file pointer
* [ftell](2017-02-13-php-function-reference.md) Returns the current position of the file read/write pointer
* [ftruncate](2017-02-13-php-function-reference.md) Truncates a file to a given length
* [fwrite](2017-02-13-php-function-reference.md) Binary-safe file write
* [glob](2017-02-13-php-function-reference.md) Find pathnames matching a pattern
* [is\_dir](2017-02-13-php-function-reference.md) Tells whether the filename is a directory
* [is\_executable](2017-02-13-php-function-reference.md) Tells whether the filename is executable
* [is\_file](2017-02-13-php-function-reference.md) Tells whether the filename is a regular file
* [is\_link](2017-02-13-php-function-reference.md) Tells whether the filename is a symbolic link
* [is\_readable](2017-02-13-php-function-reference.md) Tells whether a file exists and is readable
* [is\_uploaded\_file](2017-02-13-php-function-reference.md) Tells whether the file was uploaded via HTTP POST
* [is\_writable](2017-02-13-php-function-reference.md) Tells whether the filename is writable
* [is\_writeable](2017-02-13-php-function-reference.md) Alias of is\_writable
* [lchgrp](2017-02-13-php-function-reference.md) Changes group ownership of symlink
* [lchown](2017-02-13-php-function-reference.md) Changes user ownership of symlink
* [link](2017-02-13-php-function-reference.md) Create a hard link
* [linkinfo](2017-02-13-php-function-reference.md) Gets information about a link
* [lstat](2017-02-13-php-function-reference.md) Gives information about a file or symbolic link
* [mkdir](2017-02-13-php-function-reference.md) Makes directory
* [move\_uploaded\_file](2017-02-13-php-function-reference.md) Moves an uploaded file to a new location
* [parse\_ini\_file](2017-02-13-php-function-reference.md) Parse a configuration file
* [parse\_ini\_string](2017-02-13-php-function-reference.md) Parse a configuration string
* [pathinfo](2017-02-13-php-function-reference.md) Returns information about a file path
* [pclose](2017-02-13-php-function-reference.md) Closes process file pointer
* [popen](2017-02-13-php-function-reference.md) Opens process file pointer
* [readfile](2017-02-13-php-function-reference.md) Outputs a file
* [readlink](2017-02-13-php-function-reference.md) Returns the target of a symbolic link
* [realpath\_cache\_get](2017-02-13-php-function-reference.md) Get realpath cache entries
* [realpath\_cache\_size](2017-02-13-php-function-reference.md) Get realpath cache size
* [realpath](2017-02-13-php-function-reference.md) Returns canonicalized absolute pathname
* [rename](2017-02-13-php-function-reference.md) Renames a file or directory
* [rewind](2017-02-13-php-function-reference.md) Rewind the position of a file pointer
* [rmdir](2017-02-13-php-function-reference.md) Removes directory
* [set\_file\_buffer](2017-02-13-php-function-reference.md) Alias of stream\_set\_write\_buffer
* [stat](2017-02-13-php-function-reference.md) Gives information about a file
* [symlink](2017-02-13-php-function-reference.md) Creates a symbolic link
* [tempnam](2017-02-13-php-function-reference.md) Create file with unique file name
* [tmpfile](2017-02-13-php-function-reference.md) Creates a temporary file
* [touch](2017-02-13-php-function-reference.md) Sets access and modification time of file
* [umask](2017-02-13-php-function-reference.md) Changes the current umask
* [unlink](2017-02-13-php-function-reference.md) Deletes a file

### 9. Filter

* [filter\_has\_var](2017-02-13-php-function-reference.md) Checks if variable of specified type exists
* [filter\_id](2017-02-13-php-function-reference.md) Returns the filter ID belonging to a named filter
* [filter\_input\_array](2017-02-13-php-function-reference.md) Gets external variables and optionally filters them
* [filter\_input](2017-02-13-php-function-reference.md) Gets a specific external variable by name and optionally filters it
* [filter\_list](2017-02-13-php-function-reference.md) Returns a list of all supported filters
* [filter\_var\_array](2017-02-13-php-function-reference.md) Gets multiple variables and optionally filters them
* [filter\_var](2017-02-13-php-function-reference.md) Filters a variable with a specified filter

### 10. Function Handing

* [call\_user\_func\_array](2017-02-13-php-function-reference.md) Call a callback with an array of parameters
* [call\_user\_func](2017-02-13-php-function-reference.md) Call the callback given by the first parameter
* [create\_function](2017-02-13-php-function-reference.md) Create an anonymous \(lambda-style\) function
* [forward\_static\_call\_array](2017-02-13-php-function-reference.md) Call a static method and pass the arguments as array
* [forward\_static\_call](2017-02-13-php-function-reference.md) Call a static method
* [func\_get\_arg](2017-02-13-php-function-reference.md) Return an item from the argument list
* [func\_get\_args](2017-02-13-php-function-reference.md) Returns an array comprising a function's argument list
* [func\_num\_args](2017-02-13-php-function-reference.md) Returns the number of arguments passed to the function
* [function\_exists](2017-02-13-php-function-reference.md) Return TRUE if the given function has been defined
* [get\_defined\_functions](2017-02-13-php-function-reference.md) Returns an array of all defined functions
* [register\_shutdown\_function](2017-02-13-php-function-reference.md) Register a function for execution on shutdown
* [register\_tick\_function](2017-02-13-php-function-reference.md) Register a function for execution on each tick
* [unregister\_tick\_function](2017-02-13-php-function-reference.md) De-register a function for execution on each tick

### 11. Hash

* [hash\_algos](2017-02-13-php-function-reference.md) Return a list of registered hashing algorithms
* [hash\_copy](2017-02-13-php-function-reference.md) Copy hashing context
* [hash\_equals](2017-02-13-php-function-reference.md) Timing attack safe string comparison
* [hash\_file](2017-02-13-php-function-reference.md) Generate a hash value using the contents of a given file
* [hash\_final](2017-02-13-php-function-reference.md) Finalize an incremental hash and return resulting digest
* [hash\_hmac\_file](2017-02-13-php-function-reference.md) Generate a keyed hash value using the HMAC method and the contents of a given file
* [hash\_hmac](2017-02-13-php-function-reference.md) Generate a keyed hash value using the HMAC method
* [hash\_init](2017-02-13-php-function-reference.md) Initialize an incremental hashing context
* [hash\_pbkdf2](2017-02-13-php-function-reference.md) Generate a PBKDF2 key derivation of a supplied password
* [hash\_update\_file](2017-02-13-php-function-reference.md) Pump data into an active hashing context from a file
* [hash\_update\_stream](2017-02-13-php-function-reference.md) Pump data into an active hashing context from an open stream
* [hash\_update](2017-02-13-php-function-reference.md) Pump data into an active hashing context
* [hash](2017-02-13-php-function-reference.md) Generate a hash value \(message digest\)

### 12. PHP 选项/信息

* [assert\_options](2017-02-13-php-function-reference.md) Set/get the various assert flags
* [assert](2017-02-13-php-function-reference.md) Checks if assertion is FALSE
* [cli\_get\_process\_title](2017-02-13-php-function-reference.md) Returns the current process title
* [cli\_set\_process\_title](2017-02-13-php-function-reference.md) Sets the process title
* [dl](2017-02-13-php-function-reference.md) Loads a PHP extension at runtime
* [extension\_loaded](2017-02-13-php-function-reference.md) Find out whether an extension is loaded
* [gc\_collect\_cycles](2017-02-13-php-function-reference.md) Forces collection of any existing garbage cycles
* [gc\_disable](2017-02-13-php-function-reference.md) Deactivates the circular reference collector
* [gc\_enable](2017-02-13-php-function-reference.md) Activates the circular reference collector
* [gc\_enabled](2017-02-13-php-function-reference.md) Returns status of the circular reference collector
* [gc\_mem\_caches](2017-02-13-php-function-reference.md) Reclaims memory used by the Zend Engine memory manager
* [get\_cfg\_var](2017-02-13-php-function-reference.md) Gets the value of a PHP configuration option
* [get\_current\_user](2017-02-13-php-function-reference.md) Gets the name of the owner of the current PHP script
* [get\_defined\_constants](2017-02-13-php-function-reference.md) Returns an associative array with the names of all the constants and their values
* [get\_extension\_funcs](2017-02-13-php-function-reference.md) Returns an array with the names of the functions of a module
* [get\_include\_path](2017-02-13-php-function-reference.md) Gets the current include\_path configuration option
* [get\_included\_files](2017-02-13-php-function-reference.md) Returns an array with the names of included or required files
* [get\_loaded\_extensions](2017-02-13-php-function-reference.md) Returns an array with the names of all modules compiled and loaded
* [get\_magic\_quotes\_gpc](2017-02-13-php-function-reference.md) Gets the current configuration setting of magic\_quotes\_gpc
* [get\_magic\_quotes\_runtime](2017-02-13-php-function-reference.md) Gets the current active configuration setting of magic\_quotes\_runtime
* [get\_required\_files](2017-02-13-php-function-reference.md) Alias of get\_included\_files
* [get\_resources](2017-02-13-php-function-reference.md) Returns active resources
* [getenv](2017-02-13-php-function-reference.md) Gets the value of an environment variable
* [getlastmod](2017-02-13-php-function-reference.md) Gets time of last page modification
* [getmygid](2017-02-13-php-function-reference.md) Get PHP script owner's GID
* [getmyinode](2017-02-13-php-function-reference.md) Gets the inode of the current script
* [getmypid](2017-02-13-php-function-reference.md) Gets PHP's process ID
* [getmyuid](2017-02-13-php-function-reference.md) Gets PHP script owner's UID
* [getopt](2017-02-13-php-function-reference.md) Gets options from the command line argument list
* [getrusage](2017-02-13-php-function-reference.md) Gets the current resource usages
* [ini\_alter](2017-02-13-php-function-reference.md) Alias of ini\_set
* [ini\_get\_all](2017-02-13-php-function-reference.md) Gets all configuration options
* [ini\_get](2017-02-13-php-function-reference.md) Gets the value of a configuration option
* [ini\_restore](2017-02-13-php-function-reference.md) Restores the value of a configuration option
* [ini\_set](2017-02-13-php-function-reference.md) Sets the value of a configuration option
* [magic\_quotes\_runtime](2017-02-13-php-function-reference.md) Alias of set\_magic\_quotes\_runtime
* [main](2017-02-13-php-function-reference.md) Dummy for main
* [memory\_get\_peak\_usage](2017-02-13-php-function-reference.md) Returns the peak of memory allocated by PHP
* [memory\_get\_usage](2017-02-13-php-function-reference.md) Returns the amount of memory allocated to PHP
* [php\_ini\_loaded\_file](2017-02-13-php-function-reference.md) Retrieve a path to the loaded php.ini file
* [php\_ini\_scanned\_files](2017-02-13-php-function-reference.md) Return a list of .ini files parsed from the additional ini dir
* [php\_logo\_guid](2017-02-13-php-function-reference.md) Gets the logo guid
* [php\_sapi\_name](2017-02-13-php-function-reference.md) Returns the type of interface between web server and PHP
* [php\_uname](2017-02-13-php-function-reference.md) Returns information about the operating system PHP is running on
* [phpcredits](2017-02-13-php-function-reference.md) Prints out the credits for PHP
* [phpinfo](2017-02-13-php-function-reference.md) Outputs information about PHP's configuration
* [phpversion](2017-02-13-php-function-reference.md) Gets the current PHP version
* [putenv](2017-02-13-php-function-reference.md) Sets the value of an environment variable
* [restore\_include\_path](2017-02-13-php-function-reference.md) Restores the value of the include\_path configuration option
* [set\_include\_path](2017-02-13-php-function-reference.md) Sets the include\_path configuration option
* [set\_magic\_quotes\_runtime](2017-02-13-php-function-reference.md) Sets the current active configuration setting of magic\_quotes\_runtime
* [set\_time\_limit](2017-02-13-php-function-reference.md) Limits the maximum execution time
* [sys\_get\_temp\_dir](2017-02-13-php-function-reference.md) Returns directory path used for temporary files
* [version\_compare](2017-02-13-php-function-reference.md) Compares two "PHP-standardized" version number strings
* [zend\_logo\_guid](2017-02-13-php-function-reference.md) Gets the Zend guid
* [zend\_thread\_id](2017-02-13-php-function-reference.md) Returns a unique identifier for the current thread
* [zend\_version](2017-02-13-php-function-reference.md) Gets the version of the current Zend engine

### 13. Mail

### 14. Math

* [abs](2017-02-13-php-function-reference.md) Absolute value
* [acos](2017-02-13-php-function-reference.md) Arc cosine
* [acosh](2017-02-13-php-function-reference.md) Inverse hyperbolic cosine
* [asin](2017-02-13-php-function-reference.md) Arc sine
* [asinh](2017-02-13-php-function-reference.md) Inverse hyperbolic sine
* [atan2](2017-02-13-php-function-reference.md) Arc tangent of two variables
* [atan](2017-02-13-php-function-reference.md) Arc tangent
* [atanh](2017-02-13-php-function-reference.md) Inverse hyperbolic tangent
* [base\_convert](2017-02-13-php-function-reference.md) Convert a number between arbitrary bases
* [bindec](2017-02-13-php-function-reference.md) Binary to decimal
* [ceil](2017-02-13-php-function-reference.md) Round fractions up
* [cos](2017-02-13-php-function-reference.md) Cosine
* [cosh](2017-02-13-php-function-reference.md) Hyperbolic cosine
* [decbin](2017-02-13-php-function-reference.md) Decimal to binary
* [dechex](2017-02-13-php-function-reference.md) Decimal to hexadecimal
* [decoct](2017-02-13-php-function-reference.md) Decimal to octal
* [deg2rad](2017-02-13-php-function-reference.md) Converts the number in degrees to the radian equivalent
* [exp](2017-02-13-php-function-reference.md) Calculates the exponent of e
* [expm1](2017-02-13-php-function-reference.md) Returns exp\(number\) - 1, computed in a way that is accurate even when the value of number is close to zero
* [floor](2017-02-13-php-function-reference.md) Round fractions down
* [fmod](2017-02-13-php-function-reference.md) Returns the floating point remainder \(modulo\) of the division of the arguments
* [getrandmax](2017-02-13-php-function-reference.md) Show largest possible random value
* [hexdec](2017-02-13-php-function-reference.md) Hexadecimal to decimal
* [hypot](2017-02-13-php-function-reference.md) Calculate the length of the hypotenuse of a right-angle triangle
* [intdiv](2017-02-13-php-function-reference.md) Integer division
* [is\_finite](2017-02-13-php-function-reference.md) Finds whether a value is a legal finite number
* [is\_infinite](2017-02-13-php-function-reference.md) Finds whether a value is infinite
* [is\_nan](2017-02-13-php-function-reference.md) Finds whether a value is not a number
* [lcg\_value](2017-02-13-php-function-reference.md) Combined linear congruential generator
* [log10](2017-02-13-php-function-reference.md) Base-10 logarithm
* [log1p](2017-02-13-php-function-reference.md) Returns log\(1 + number\), computed in a way that is accurate even when the value of number is close to zero
* [log](2017-02-13-php-function-reference.md) Natural logarithm
* [max](2017-02-13-php-function-reference.md) Find highest value
* [min](2017-02-13-php-function-reference.md) Find lowest value
* [mt\_getrandmax](2017-02-13-php-function-reference.md) Show largest possible random value
* [mt\_rand](2017-02-13-php-function-reference.md) Generate a better random value
* [mt\_srand](2017-02-13-php-function-reference.md) Seed the better random number generator
* [octdec](2017-02-13-php-function-reference.md) Octal to decimal
* [pi](2017-02-13-php-function-reference.md) Get value of pi
* [pow](2017-02-13-php-function-reference.md) Exponential expression
* [rad2deg](2017-02-13-php-function-reference.md) Converts the radian number to the equivalent number in degrees
* [rand](2017-02-13-php-function-reference.md) Generate a random integer
* [round](2017-02-13-php-function-reference.md) Rounds a float
* [sin](2017-02-13-php-function-reference.md) Sine
* [sinh](2017-02-13-php-function-reference.md) Hyperbolic sine
* [sqrt](2017-02-13-php-function-reference.md) Square root
* [srand](2017-02-13-php-function-reference.md) Seed the random number generator
* [tan](2017-02-13-php-function-reference.md) Tangent
* [tanh](2017-02-13-php-function-reference.md) Hyperbolic tangent

### 15. Misc

* [connection\_aborted](2017-02-13-php-function-reference.md) Check whether client disconnected
* [connection\_status](2017-02-13-php-function-reference.md) Returns connection status bitfield
* [constant](2017-02-13-php-function-reference.md) Returns the value of a constant
* [define](2017-02-13-php-function-reference.md) Defines a named constant
* [defined](2017-02-13-php-function-reference.md) Checks whether a given named constant exists
* [die](2017-02-13-php-function-reference.md) Equivalent to exit
* [eval](2017-02-13-php-function-reference.md) Evaluate a string as PHP code
* [exit](2017-02-13-php-function-reference.md) Output a message and terminate the current script
* [get\_browser](2017-02-13-php-function-reference.md) Tells what the user's browser is capable of
* [\_\_halt\_compiler](2017-02-13-php-function-reference.md) Halts the compiler execution
* [highlight\_file](2017-02-13-php-function-reference.md) Syntax highlighting of a file
* [highlight\_string](2017-02-13-php-function-reference.md) Syntax highlighting of a string
* [ignore\_user\_abort](2017-02-13-php-function-reference.md) Set whether a client disconnect should abort script execution
* [pack](2017-02-13-php-function-reference.md) Pack data into binary string
* [php\_check\_syntax](2017-02-13-php-function-reference.md) Check the PHP syntax of \(and execute\) the specified file
* [php\_strip\_whitespace](2017-02-13-php-function-reference.md) Return source with stripped comments and whitespace
* [show\_source](2017-02-13-php-function-reference.md) Alias of highlight\_file
* [sleep](2017-02-13-php-function-reference.md) Delay execution
* [sys\_getloadavg](2017-02-13-php-function-reference.md) Gets system load average
* [time\_nanosleep](2017-02-13-php-function-reference.md) Delay for a number of seconds and nanoseconds
* [time\_sleep\_until](2017-02-13-php-function-reference.md) Make the script sleep until the specified time
* [uniqid](2017-02-13-php-function-reference.md) Generate a unique ID
* [unpack](2017-02-13-php-function-reference.md) Unpack data from binary string
* [usleep](2017-02-13-php-function-reference.md) Delay execution in microseconds

### 16. 网络

* [checkdnsrr](2017-02-13-php-function-reference.md) Check DNS records corresponding to a given Internet host name or IP address
* [closelog](2017-02-13-php-function-reference.md) Close connection to system logger
* [define\_syslog\_variables](2017-02-13-php-function-reference.md) Initializes all syslog related variables
* [dns\_check\_record](2017-02-13-php-function-reference.md) Alias of checkdnsrr
* [dns\_get\_mx](2017-02-13-php-function-reference.md) Alias of getmxrr
* [dns\_get\_record](2017-02-13-php-function-reference.md) Fetch DNS Resource Records associated with a hostname
* [fsockopen](2017-02-13-php-function-reference.md) Open Internet or Unix domain socket connection
* [gethostbyaddr](2017-02-13-php-function-reference.md) Get the Internet host name corresponding to a given IP address
* [gethostbyname](2017-02-13-php-function-reference.md) Get the IPv4 address corresponding to a given Internet host name
* [gethostbynamel](2017-02-13-php-function-reference.md) Get a list of IPv4 addresses corresponding to a given Internet host name
* [gethostname](2017-02-13-php-function-reference.md) Gets the host name
* [getmxrr](2017-02-13-php-function-reference.md) Get MX records corresponding to a given Internet host name
* [getprotobyname](2017-02-13-php-function-reference.md) Get protocol number associated with protocol name
* [getprotobynumber](2017-02-13-php-function-reference.md) Get protocol name associated with protocol number
* [getservbyname](2017-02-13-php-function-reference.md) Get port number associated with an Internet service and protocol
* [getservbyport](2017-02-13-php-function-reference.md) Get Internet service which corresponds to port and protocol
* [header\_register\_callback](2017-02-13-php-function-reference.md) Call a header function
* [header\_remove](2017-02-13-php-function-reference.md) Remove previously set headers
* [header](2017-02-13-php-function-reference.md) Send a raw HTTP header
* [headers\_list](2017-02-13-php-function-reference.md) Returns a list of response headers sent \(or ready to send\)
* [headers\_sent](2017-02-13-php-function-reference.md) Checks if or where headers have been sent
* [http\_response\_code](2017-02-13-php-function-reference.md) Get or Set the HTTP response code
* [inet\_ntop](2017-02-13-php-function-reference.md) Converts a packed internet address to a human readable representation
* [inet\_pton](2017-02-13-php-function-reference.md) Converts a human readable IP address to its packed in\_addr representation
* [ip2long](2017-02-13-php-function-reference.md) Converts a string containing an \(IPv4\) Internet Protocol dotted address into a long integer
* [long2ip](2017-02-13-php-function-reference.md) Converts an long integer address into a string in \(IPv4\) Internet standard dotted format
* [openlog](2017-02-13-php-function-reference.md) Open connection to system logger
* [pfsockopen](2017-02-13-php-function-reference.md) Open persistent Internet or Unix domain socket connection
* [setcookie](2017-02-13-php-function-reference.md) Send a cookie
* [setrawcookie](2017-02-13-php-function-reference.md) Send a cookie without urlencoding the cookie value
* [socket\_get\_status](2017-02-13-php-function-reference.md) Alias of stream\_get\_meta\_data
* [socket\_set\_blocking](2017-02-13-php-function-reference.md) Alias of stream\_set\_blocking
* [socket\_set\_timeout](2017-02-13-php-function-reference.md) Alias of stream\_set\_timeout
* [syslog](2017-02-13-php-function-reference.md) Generate a system log message

### 17. 输出控制

* [flush](2017-02-13-php-function-reference.md) Flush system output buffer
* [ob\_clean](2017-02-13-php-function-reference.md) Clean \(erase\) the output buffer
* [ob\_end\_clean](2017-02-13-php-function-reference.md) Clean \(erase\) the output buffer and turn off output buffering
* [ob\_end\_flush](2017-02-13-php-function-reference.md) Flush \(send\) the output buffer and turn off output buffering
* [ob\_flush](2017-02-13-php-function-reference.md) Flush \(send\) the output buffer
* [ob\_get\_clean](2017-02-13-php-function-reference.md) Get current buffer contents and delete current output buffer
* [ob\_get\_contents](2017-02-13-php-function-reference.md) Return the contents of the output buffer
* [ob\_get\_flush](2017-02-13-php-function-reference.md) Flush the output buffer, return it as a string and turn off output buffering
* [ob\_get\_length](2017-02-13-php-function-reference.md) Return the length of the output buffer
* [ob\_get\_level](2017-02-13-php-function-reference.md) Return the nesting level of the output buffering mechanism
* [ob\_get\_status](2017-02-13-php-function-reference.md) Get status of output buffers
* [ob\_gzhandler](2017-02-13-php-function-reference.md) ob\_start callback function to gzip output buffer
* [ob\_implicit\_flush](2017-02-13-php-function-reference.md) Turn implicit flush on/off
* [ob\_list\_handlers](2017-02-13-php-function-reference.md) List all output handlers in use
* [ob\_start](2017-02-13-php-function-reference.md) Turn on output buffering
* [output\_add\_rewrite\_var](2017-02-13-php-function-reference.md) Add URL rewriter values
* [output\_reset\_rewrite\_vars](2017-02-13-php-function-reference.md) Reset URL rewriter values

### 18. Password Hashing

* [password\_get\_info](2017-02-13-php-function-reference.md) Returns information about the given hash
* [password\_hash](2017-02-13-php-function-reference.md) Creates a password hash
* [password\_needs\_rehash](2017-02-13-php-function-reference.md) Checks if the given hash matches the given options
* [password\_verify](2017-02-13-php-function-reference.md) Verifies that a password matches a hash

### 19. Session

* [session\_abort](2017-02-13-php-function-reference.md) Discard session array changes and finish session
* [session\_cache\_expire](2017-02-13-php-function-reference.md) Return current cache expire
* [session\_cache\_limiter](2017-02-13-php-function-reference.md) Get and/or set the current cache limiter
* [session\_commit](2017-02-13-php-function-reference.md) Alias of session\_write\_close
* [session\_create\_id](2017-02-13-php-function-reference.md) Create new session id
* [session\_decode](2017-02-13-php-function-reference.md) Decodes session data from a session encoded string
* [session\_destroy](2017-02-13-php-function-reference.md) Destroys all data registered to a session
* [session\_encode](2017-02-13-php-function-reference.md) Encodes the current session data as a session encoded string
* [session\_gc](2017-02-13-php-function-reference.md) Perform session data garbage collection
* [session\_get\_cookie\_params](2017-02-13-php-function-reference.md) Get the session cookie parameters
* [session\_id](2017-02-13-php-function-reference.md) Get and/or set the current session id
* [session\_is\_registered](2017-02-13-php-function-reference.md) Find out whether a global variable is registered in a session
* [session\_module\_name](2017-02-13-php-function-reference.md) Get and/or set the current session module
* [session\_name](2017-02-13-php-function-reference.md) Get and/or set the current session name
* [session\_regenerate\_id](2017-02-13-php-function-reference.md) Update the current session id with a newly generated one
* [session\_register\_shutdown](2017-02-13-php-function-reference.md) Session shutdown function
* [session\_register](2017-02-13-php-function-reference.md) Register one or more global variables with the current session
* [session\_reset](2017-02-13-php-function-reference.md) Re-initialize session array with original values
* [session\_save\_path](2017-02-13-php-function-reference.md) Get and/or set the current session save path
* [session\_set\_cookie\_params](2017-02-13-php-function-reference.md) Set the session cookie parameters
* [session\_set\_save\_handler](2017-02-13-php-function-reference.md) Sets user-level session storage functions
* [session\_start](2017-02-13-php-function-reference.md) Start new or resume existing session
* [session\_status](2017-02-13-php-function-reference.md) Returns the current session status
* [session\_unregister](2017-02-13-php-function-reference.md) Unregister a global variable from the current session
* [session\_unset](2017-02-13-php-function-reference.md) Free all session variables
* [session\_write\_close](2017-02-13-php-function-reference.md) Write session data and end session

### 20. 反射

### 21. POSIX Regex

* [ereg\_replace](2017-02-13-php-function-reference.md) Replace regular expression
* [ereg](2017-02-13-php-function-reference.md) Regular expression match
* [eregi\_replace](2017-02-13-php-function-reference.md) Replace regular expression case insensitive
* [eregi](2017-02-13-php-function-reference.md) Case insensitive regular expression match
* [split](2017-02-13-php-function-reference.md) Split string into array by regular expression
* [spliti](2017-02-13-php-function-reference.md) Split string into array by regular expression case insensitive
* [sql\_regcase](2017-02-13-php-function-reference.md) Make regular expression for case insensitive matche

### 22. SPL

* [class\_implements](2017-02-13-php-function-reference.md) Return the interfaces which are implemented by the given class or interface
* [class\_parents](2017-02-13-php-function-reference.md) Return the parent classes of the given class
* [class\_uses](2017-02-13-php-function-reference.md) Return the traits used by the given class
* [iterator\_apply](2017-02-13-php-function-reference.md) Call a function for every element in an iterator
* [iterator\_count](2017-02-13-php-function-reference.md) Count the elements in an iterator
* [iterator\_to\_array](2017-02-13-php-function-reference.md) Copy the iterator into an array
* [spl\_autoload\_call](2017-02-13-php-function-reference.md) Try all registered \_\_autoload\(\) function to load the requested class
* [spl\_autoload\_extensions](2017-02-13-php-function-reference.md) Register and return default file extensions for spl\_autoload
* [spl\_autoload\_functions](2017-02-13-php-function-reference.md) Return all registered \_\_autoload\(\) functions
* [spl\_autoload\_register](2017-02-13-php-function-reference.md) Register given function as \_\_autoload\(\) implementation
* [spl\_autoload\_unregister](2017-02-13-php-function-reference.md) Unregister given function as \_\_autoload\(\) implementation
* [spl\_autoload](2017-02-13-php-function-reference.md) Default implementation for \_\_autoload\(\)
* [spl\_classes](2017-02-13-php-function-reference.md) Return available SPL classes
* [spl\_object\_hash](2017-02-13-php-function-reference.md) Return hash id for given object

### 23. Streams

* [set\_socket\_blocking](2017-02-13-php-function-reference.md) Alias of stream\_set\_blocking
* [stream\_bucket\_append](2017-02-13-php-function-reference.md) Append bucket to brigade
* [stream\_bucket\_make\_writeable](2017-02-13-php-function-reference.md) Return a bucket object from the brigade for operating on
* [stream\_bucket\_new](2017-02-13-php-function-reference.md) Create a new bucket for use on the current stream
* [stream\_bucket\_prepend](2017-02-13-php-function-reference.md) Prepend bucket to brigade
* [stream\_context\_create](2017-02-13-php-function-reference.md) Creates a stream context
* [stream\_context\_get\_default](2017-02-13-php-function-reference.md) Retrieve the default stream context
* [stream\_context\_get\_options](2017-02-13-php-function-reference.md) Retrieve options for a stream/wrapper/context
* [stream\_context\_get\_params](2017-02-13-php-function-reference.md) Retrieves parameters from a context
* [stream\_context\_set\_default](2017-02-13-php-function-reference.md) Set the default stream context
* [stream\_context\_set\_option](2017-02-13-php-function-reference.md) Sets an option for a stream/wrapper/context
* [stream\_context\_set\_params](2017-02-13-php-function-reference.md) Set parameters for a stream/wrapper/context
* [stream\_copy\_to\_stream](2017-02-13-php-function-reference.md) Copies data from one stream to another
* [stream\_encoding](2017-02-13-php-function-reference.md) Set character set for stream encoding
* [stream\_filter\_append](2017-02-13-php-function-reference.md) Attach a filter to a stream
* [stream\_filter\_prepend](2017-02-13-php-function-reference.md) Attach a filter to a stream
* [stream\_filter\_register](2017-02-13-php-function-reference.md) Register a user defined stream filter
* [stream\_filter\_remove](2017-02-13-php-function-reference.md) Remove a filter from a stream
* [stream\_get\_contents](2017-02-13-php-function-reference.md) Reads remainder of a stream into a string
* [stream\_get\_filters](2017-02-13-php-function-reference.md) Retrieve list of registered filters
* [stream\_get\_line](2017-02-13-php-function-reference.md) Gets line from stream resource up to a given delimiter
* [stream\_get\_meta\_data](2017-02-13-php-function-reference.md) Retrieves header/meta data from streams/file pointers
* [stream\_get\_transports](2017-02-13-php-function-reference.md) Retrieve list of registered socket transports
* [stream\_get\_wrappers](2017-02-13-php-function-reference.md) Retrieve list of registered streams
* [stream\_is\_local](2017-02-13-php-function-reference.md) Checks if a stream is a local stream
* [stream\_notification\_callback](2017-02-13-php-function-reference.md) A callback function for the notification context parameter
* [stream\_register\_wrapper](2017-02-13-php-function-reference.md) Alias of stream\_wrapper\_register
* [stream\_resolve\_include\_path](2017-02-13-php-function-reference.md) Resolve filename against the include path
* [stream\_select](2017-02-13-php-function-reference.md) Runs the equivalent of the select\(\) system call on the given arrays of streams with a timeout specified by tv\_sec and tv\_usec
* [stream\_set\_blocking](2017-02-13-php-function-reference.md) Set blocking/non-blocking mode on a stream
* [stream\_set\_chunk\_size](2017-02-13-php-function-reference.md) Set the stream chunk size
* [stream\_set\_read\_buffer](2017-02-13-php-function-reference.md) Set read file buffering on the given stream
* [stream\_set\_timeout](2017-02-13-php-function-reference.md) Set timeout period on a stream
* [stream\_set\_write\_buffer](2017-02-13-php-function-reference.md) Sets write file buffering on the given stream
* [stream\_socket\_accept](2017-02-13-php-function-reference.md) Accept a connection on a socket created by stream\_socket\_server
* [stream\_socket\_client](2017-02-13-php-function-reference.md) Open Internet or Unix domain socket connection
* [stream\_socket\_enable\_crypto](2017-02-13-php-function-reference.md) Turns encryption on/off on an already connected socket
* [stream\_socket\_get\_name](2017-02-13-php-function-reference.md) Retrieve the name of the local or remote sockets
* [stream\_socket\_pair](2017-02-13-php-function-reference.md) Creates a pair of connected, indistinguishable socket streams
* [stream\_socket\_recvfrom](2017-02-13-php-function-reference.md) Receives data from a socket, connected or not
* [stream\_socket\_sendto](2017-02-13-php-function-reference.md) Sends a message to a socket, whether it is connected or not
* [stream\_socket\_server](2017-02-13-php-function-reference.md) Create an Internet or Unix domain server socket
* [stream\_socket\_shutdown](2017-02-13-php-function-reference.md) Shutdown a full-duplex connection
* [stream\_supports\_lock](2017-02-13-php-function-reference.md) Tells whether the stream supports locking.
* [stream\_wrapper\_register](2017-02-13-php-function-reference.md) Register a URL wrapper implemented as a PHP class
* [stream\_wrapper\_restore](2017-02-13-php-function-reference.md) Restores a previously unregistered built-in wrapper
* [stream\_wrapper\_unregister](2017-02-13-php-function-reference.md) Unregister a URL wrapper

### 24. Tokenizer

* [token\_get\_all](2017-02-13-php-function-reference.md) Split given source into PHP tokens
* [token\_name](2017-02-13-php-function-reference.md) Get the symbolic name of a given PHP token

### 25. URLs

* [base64\_decode](2017-02-13-php-function-reference.md) Decodes data encoded with MIME base64
* [base64\_encode](2017-02-13-php-function-reference.md) Encodes data with MIME base64
* [get\_headers](2017-02-13-php-function-reference.md) Fetches all the headers sent by the server in response to a HTTP request
* [get\_meta\_tags](2017-02-13-php-function-reference.md) Extracts all meta tag content attributes from a file and returns an array
* [http\_build\_query](2017-02-13-php-function-reference.md) Generate URL-encoded query string
* [parse\_url](2017-02-13-php-function-reference.md) Parse a URL and return its components
* [rawurldecode](2017-02-13-php-function-reference.md) Decode URL-encoded strings
* [rawurlencode](2017-02-13-php-function-reference.md) URL-encode according to RFC 3986
* [urldecode](2017-02-13-php-function-reference.md) Decodes URL-encoded string
* [urlencode](2017-02-13-php-function-reference.md) URL-encodes string

### 26. Variable Handing

* [boolval](2017-02-13-php-function-reference.md) Get the boolean value of a variable
* [debug\_zval\_dump](2017-02-13-php-function-reference.md) Dumps a string representation of an internal zend value to output
* [doubleval](2017-02-13-php-function-reference.md) Alias of floatval
* [empty](2017-02-13-php-function-reference.md) Determine whether a variable is empty
* [floatval](2017-02-13-php-function-reference.md) Get float value of a variable
* [get\_defined\_vars](2017-02-13-php-function-reference.md) Returns an array of all defined variables
* [get\_resource\_type](2017-02-13-php-function-reference.md) Returns the resource type
* [gettype](2017-02-13-php-function-reference.md) Get the type of a variable
* [import\_request\_variables](2017-02-13-php-function-reference.md) Import GET/POST/Cookie variables into the global scope
* [intval](2017-02-13-php-function-reference.md) Get the integer value of a variable
* [is\_array](2017-02-13-php-function-reference.md) Finds whether a variable is an array
* [is\_bool](2017-02-13-php-function-reference.md) Finds out whether a variable is a boolean
* [is\_callable](2017-02-13-php-function-reference.md) Verify that the contents of a variable can be called as a function
* [is\_double](2017-02-13-php-function-reference.md) Alias of is\_float
* [is\_float](2017-02-13-php-function-reference.md) Finds whether the type of a variable is float
* [is\_int](2017-02-13-php-function-reference.md) Find whether the type of a variable is integer
* [is\_integer](2017-02-13-php-function-reference.md) Alias of is\_int
* [is\_long](2017-02-13-php-function-reference.md) Alias of is\_int
* [is\_null](2017-02-13-php-function-reference.md) Finds whether a variable is NULL
* [is\_numeric](2017-02-13-php-function-reference.md) Finds whether a variable is a number or a numeric string
* [is\_object](2017-02-13-php-function-reference.md) Finds whether a variable is an object
* [is\_real](2017-02-13-php-function-reference.md) Alias of is\_float
* [is\_resource](2017-02-13-php-function-reference.md) Finds whether a variable is a resource
* [is\_scalar](2017-02-13-php-function-reference.md) Finds whether a variable is a scalar
* [is\_string](2017-02-13-php-function-reference.md) Find whether the type of a variable is string
* [isset](2017-02-13-php-function-reference.md) Determine if a variable is set and is not NULL
* [print\_r](2017-02-13-php-function-reference.md) Prints human-readable information about a variable
* [serialize](2017-02-13-php-function-reference.md) Generates a storable representation of a value
* [settype](2017-02-13-php-function-reference.md) Set the type of a variable
* [strval](2017-02-13-php-function-reference.md) Get string value of a variable
* [unserialize](2017-02-13-php-function-reference.md) Creates a PHP value from a stored representation
* [unset](2017-02-13-php-function-reference.md) Unset a given variable
* [var\_dump](2017-02-13-php-function-reference.md) Dumps information about a variable
* [var\_export](2017-02-13-php-function-reference.md) Outputs or returns a parsable string representation of a variable

