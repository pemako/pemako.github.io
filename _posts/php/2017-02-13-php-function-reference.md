---
layout: post
title: PHP函数参考-核心扩展库
description: php,手册
keywords: php,手册,语法
category: php
tags: [php]
---

# 简介

PHP官方手册主要包含了四大部分为了便于查阅进行整理总结，本篇主要是第二部分函数参考。

## 核心扩展库
### 1. 字符串 

- [addcslashes]() Quote string with slashes in a C style
- [addslashes]() Quote string with slashes
- [bin2hex]() Convert binary data into hexadecimal representation
- [chop]() Alias of rtrim
- [chr]() Return a specific character
- [chunk_split]() Split a string into smaller chunks
- [convert_cyr_string]() Convert from one Cyrillic character set to another
- [convert_uudecode]() Decode a uuencoded string
- [convert_uuencode]() Uuencode a string
- [count_chars]() Return information about characters used in a string
- [crc32]() Calculates the crc32 polynomial of a string
- [crypt]() One-way string hashing
- [echo]() Output one or more strings
- [explode]() Split a string by string
- [fprintf]() Write a formatted string to a stream
- [get_html_translation_table]() Returns the translation table used by htmlspecialchars and htmlentities
- [hebrev]() Convert logical Hebrew text to visual text
- [hebrevc]() Convert logical Hebrew text to visual text with newline conversion
- [hex2bin]() Decodes a hexadecimally encoded binary string
- [html_entity_decode]() Convert all HTML entities to their applicable characters
- [htmlentities]() Convert all applicable characters to HTML entities
- [htmlspecialchars_decode]() Convert special HTML entities back to characters
- [htmlspecialchars]() Convert special characters to HTML entities
- [implode]() Join array elements with a string
- [join]() Alias of implode
- [lcfirst]() Make a string's first character lowercase
- [levenshtein]() Calculate Levenshtein distance between two strings
- [localeconv]() Get numeric formatting information
- [ltrim]() Strip whitespace (or other characters) from the beginning of a string
- [md5_file]() Calculates the md5 hash of a given file
- [md5]() Calculate the md5 hash of a string
- [metaphone]() Calculate the metaphone key of a string
- [money_format]() Formats a number as a currency string
- [nl_langinfo]() Query language and locale information
- [nl2br]() Inserts HTML line breaks before all newlines in a string
- [number_format]() Format a number with grouped thousands
- [ord]() Return ASCII value of character
- [parse_str]() Parses the string into variables
- [print]() Output a string
- [printf]() Output a formatted string
- [quoted_printable_decode]() Convert a quoted-printable string to an 8 bit string
- [quoted_printable_encode]() Convert a 8 bit string to a quoted-printable string
- [quotemeta]() Quote meta characters
- [rtrim]() Strip whitespace (or other characters) from the end of a string
- [setlocale]() Set locale information
- [sha1_file]() Calculate the sha1 hash of a file
- [sha1]() Calculate the sha1 hash of a string
- [similar_text]() Calculate the similarity between two strings
- [soundex]() Calculate the soundex key of a string
- [sprintf]() Return a formatted string
- [sscanf]() Parses input from a string according to a format
- [str_getcsv]() Parse a CSV string into an array
- [str_ireplace]() Case-insensitive version of str_replace.
- [str_pad]() Pad a string to a certain length with another string
- [str_repeat]() Repeat a string
- [str_replace]() Replace all occurrences of the search string with the replacement string
- [str_rot13]() Perform the rot13 transform on a string
- [str_shuffle]() Randomly shuffles a string
- [str_split]() Convert a string to an array
- [str_word_count]() Return information about words used in a string
- [strcasecmp]() Binary safe case-insensitive string comparison
- [strchr]() Alias of strstr
- [strcmp]() Binary safe string comparison
- [strcoll]() Locale based string comparison
- [strcspn]() Find length of initial segment not matching mask
- [strip_tags]() Strip HTML and PHP tags from a string
- [stripcslashes]() Un-quote string quoted with addcslashes
- [stripos]() Find the position of the first occurrence of a case-insensitive substring in a string
- [stripslashes]() Un-quotes a quoted string
- [stristr]() Case-insensitive strstr
- [strlen]() Get string length
- [strnatcasecmp]() Case insensitive string comparisons using a "natural order" algorithm
- [strnatcmp]() String comparisons using a "natural order" algorithm
- [strncasecmp]() Binary safe case-insensitive string comparison of the first n characters
- [strncmp]() Binary safe string comparison of the first n characters
- [strpbrk]() Search a string for any of a set of characters
- [strpos]() Find the position of the first occurrence of a substring in a string
- [strrchr]() Find the last occurrence of a character in a string
- [strrev]() Reverse a string
- [strripos]() Find the position of the last occurrence of a case-insensitive substring in a string
- [strrpos]() Find the position of the last occurrence of a substring in a string
- [strspn]() Finds the length of the initial segment of a string consisting entirely of characters contained within a given mask.
- [strstr]() Find the first occurrence of a string
- [strtok]() Tokenize string
- [strtolower]() Make a string lowercase
- [strtoupper]() Make a string uppercase
- [strtr]() Translate characters or replace substrings
- [substr_compare]() Binary safe comparison of two strings from an offset, up to length characters
- [substr_count]() Count the number of substring occurrences
- [substr_replace]() Replace text within a portion of a string
- [substr]() Return part of a string
- [trim]() Strip whitespace (or other characters) from the beginning and end of a string
- [ucfirst]() Make a string's first character uppercase
- [ucwords]() Uppercase the first character of each word in a string
- [vfprintf]() Write a formatted string to a stream
- [vprintf]() Output a formatted string
- [vsprintf]() Return a formatted string
- [wordwrap]() Wraps a string to a given number of characters

### 2. 数组

- [array_change_key_case]() Changes the case of all keys in an array
- [array_chunk]() Split an array into chunks
- [array_column]() Return the values from a single column in the input array
- [array_combine]() Creates an array by using one array for keys and another for its values
- [array_count_values]() Counts all the values of an array
- [array_diff_assoc]() Computes the difference of arrays with additional index check
- [array_diff_key]() Computes the difference of arrays using keys for comparison
- [array_diff_uassoc]() Computes the difference of arrays with additional index check which is performed by a user supplied callback function
- [array_diff_ukey]() Computes the difference of arrays using a callback function on the keys for comparison
- [array_diff]() Computes the difference of arrays
- [array_fill_keys]() Fill an array with values, specifying keys
- [array_fill]() Fill an array with values
- [array_filter]() Filters elements of an array using a callback function
- [array_flip]() Exchanges all keys with their associated values in an array
- [array_intersect_assoc]() Computes the intersection of arrays with additional index check
- [array_intersect_key]() Computes the intersection of arrays using keys for comparison
- [array_intersect_uassoc]() Computes the intersection of arrays with additional index check, compares indexes by a callback function
- [array_intersect_ukey]() Computes the intersection of arrays using a callback function on the keys for comparison
- [array_intersect]() Computes the intersection of arrays
- [array_key_exists]() Checks if the given key or index exists in the array
- [array_keys]() Return all the keys or a subset of the keys of an array
- [array_map]() Applies the callback to the elements of the given arrays
- [array_merge_recursive]() Merge two or more arrays recursively
- [array_merge]() Merge one or more arrays
- [array_multisort]() Sort multiple or multi-dimensional arrays
- [array_pad]() Pad array to the specified length with a value
- [array_pop]() Pop the element off the end of array
- [array_product]() Calculate the product of values in an array
- [array_push]() Push one or more elements onto the end of array
- [array_rand]() Pick one or more random entries out of an array
- [array_reduce]() Iteratively reduce the array to a single value using a callback function
- [array_replace_recursive]() Replaces elements from passed arrays into the first array recursively
- [array_replace]() Replaces elements from passed arrays into the first array
- [array_reverse]() Return an array with elements in reverse order
- [array_search]() Searches the array for a given value and returns the first corresponding key if successful
- [array_shift]() Shift an element off the beginning of array
- [array_slice]() Extract a slice of the array
- [array_splice]() Remove a portion of the array and replace it with something else
- [array_sum]() Calculate the sum of values in an array
- [array_udiff_assoc]() Computes the difference of arrays with additional index check, compares data by a callback function
- [array_udiff_uassoc]() Computes the difference of arrays with additional index check, compares data and indexes by a callback function
- [array_udiff]() Computes the difference of arrays by using a callback function for data comparison
- [array_uintersect_assoc]() Computes the intersection of arrays with additional index check, compares data by a callback function
- [array_uintersect_uassoc]() Computes the intersection of arrays with additional index check, compares data and indexes by separate callback functions
- [array_uintersect]() Computes the intersection of arrays, compares data by a callback function
- [array_unique]() Removes duplicate values from an array
- [array_unshift]() Prepend one or more elements to the beginning of an array
- [array_values]() Return all the values of an array
- [array_walk_recursive]() Apply a user function recursively to every member of an array
- [array_walk]() Apply a user supplied function to every member of an array
- [array]() Create an array
- [arsort]() Sort an array in reverse order and maintain index association
- [asort]() Sort an array and maintain index association
- [compact]() Create array containing variables and their values
- [count]() Count all elements in an array, or something in an object
- [current]() Return the current element in an array
- [each]() Return the current key and value pair from an array and advance the array cursor
- [end]() Set the internal pointer of an array to its last element
- [extract]() Import variables into the current symbol table from an array
- [in_array]() Checks if a value exists in an array
- [key_exists]() Alias of array_key_exists
- [key]() Fetch a key from an array
- [krsort]() Sort an array by key in reverse order
- [ksort]() Sort an array by key
- [list]() Assign variables as if they were an array
- [natcasesort]() Sort an array using a case insensitive "natural order" algorithm
- [natsort]() Sort an array using a "natural order" algorithm
- [next]() Advance the internal array pointer of an array
- [pos]() Alias of current
- [prev]() Rewind the internal array pointer
- [range]() Create an array containing a range of elements
- [reset]() Set the internal pointer of an array to its first element
- [rsort]() Sort an array in reverse order
- [shuffle]() Shuffle an array
- [sizeof]() Alias of count
- [sort]() Sort an array
- [uasort]() Sort an array with a user-defined comparison function and maintain index association
- [uksort]() Sort an array by keys using a user-defined comparison function
- [usort]() Sort an array by values using a user-defined comparison function

### 3. 类/对象

- [\_\_autoload]() Attempt to load undefined class
- [call_user_method_array]() Call a user method given with an array of parameters
- [call_user_method]() Call a user method on an specific object
- [class_alias]() Creates an alias for a class
- [class_exists]() Checks if the class has been defined
- [get_called_class]() the "Late Static Binding" class name
- [get_class_methods]() Gets the class methods' names
- [get_class_vars]() Get the default properties of the class
- [get_class]() Returns the name of the class of an object
- [get_declared_classes]() Returns an array with the name of the defined classes
- [get_declared_interfaces]() Returns an array of all declared interfaces
- [get_declared_traits]() Returns an array of all declared traits
- [get_object_vars]() Gets the properties of the given object
- [get_parent_class]() Retrieves the parent class name for object or class
- [interface_exists]() Checks if the interface has been defined
- [is_a]() Checks if the object is of this class or has this class as one of its parents
- [is_subclass_of]() Checks if the object has this class as one of its parents or implements it.
- [method_exists]() Checks if the class method exists
- [property_exists]() Checks if the object or class has a property
- [trait_exists]() Checks if the trait exists

### 4. 日期/时间

- [checkdate]() Validate a Gregorian date
- [date_add]() Alias of DateTime::add
- [date_create_from_format]() Alias of DateTime::createFromFormat
- [date_create_immutable_from_format]() Alias of DateTimeImmutable::createFromFormat
- [date_create_immutable]() Alias of DateTimeImmutable::\_\_construct
- [date_create]() Alias of DateTime::\_\_construct
- [date_date_set]() Alias of DateTime::setDate
- [date_default_timezone_get]() Gets the default timezone used by all date/time functions in a script
- [date_default_timezone_set]() Sets the default timezone used by all date/time functions in a script
- [date_diff]() Alias of DateTime::diff
- [date_format]() Alias of DateTime::format
- [date_get_last_errors]() Alias of DateTime::getLastErrors
- [date_interval_create_from_date_string]() Alias of DateInterval::createFromDateString
- [date_interval_format]() Alias of DateInterval::format
- [date_isodate_set]() Alias of DateTime::setISODate
- [date_modify]() Alias of DateTime::modify
- [date_offset_get]() Alias of DateTime::getOffset
- [date_parse_from_format]() Get info about given date formatted according to the specified format
- [date_parse]() Returns associative array with detailed info about given date
- [date_sub]() Alias of DateTime::sub
- [date_sun_info]() Returns an array with information about sunset/sunrise and twilight begin/end
- [date_sunrise]() Returns time of sunrise for a given day and location
- [date_sunset]() Returns time of sunset for a given day and location
- [date_time_set]() Alias of DateTime::setTime
- [date_timestamp_get]() Alias of DateTime::getTimestamp
- [date_timestamp_set]() Alias of DateTime::setTimestamp
- [date_timezone_get]() Alias of DateTime::getTimezone
- [date_timezone_set]() Alias of DateTime::setTimezone
- [date]() Format a local time/date
- [getdate]() Get date/time information
- [gettimeofday]() Get current time
- [gmdate]() Format a GMT/UTC date/time
- [gmmktime]() Get Unix timestamp for a GMT date
- [gmstrftime]() Format a GMT/UTC time/date according to locale settings
- [idate]() Format a local time/date as integer
- [localtime]() Get the local time
- [microtime]() Return current Unix timestamp with microseconds
- [mktime]() Get Unix timestamp for a date
- [strftime]() Format a local time/date according to locale settings
- [strptime]() Parse a time/date generated with strftime
- [strtotime]() Parse about any English textual datetime description into a Unix timestamp
- [time]() Return current Unix timestamp
- [timezone_abbreviations_list]() Alias of DateTimeZone::listAbbreviations
- [timezone_identifiers_list]() Alias of DateTimeZone::listIdentifiers
- [timezone_location_get]() Alias of DateTimeZone::getLocation
- [timezone_name_from_abbr]() Returns the timezone name from abbreviation
- [timezone_name_get]() Alias of DateTimeZone::getName
- [timezone_offset_get]() Alias of DateTimeZone::getOffset
- [timezone_open]() Alias of DateTimeZone::\_\_construct
- [timezone_transitions_get]() Alias of DateTimeZone::getTransitions
- [timezone_version_get]() Gets the version of the timezonedb


### 5. 目录

- [chdir]() Change directory
- [chroot]() Change the root directory
- [closedir]() Close directory handle
- [dir]() Return an instance of the Directory class
- [getcwd]() Gets the current working directory
- [opendir]() Open directory handle
- [readdir]() Read entry from directory handle
- [rewinddir]() Rewind directory handle
- [scandir]() List files and directories inside the specified path

### 6. 错误处理

- [debug_backtrace]() Generates a backtrace
- [debug_print_backtrace]() Prints a backtrace
- [error_clear_last]() Clear the most recent error
- [error_get_last]() Get the last occurred error
- [error_log]() Send an error message to the defined error handling routines
- [error_reporting]() Sets which PHP errors are reported
- [restore_error_handler]() Restores the previous error handler function
- [restore_exception_handler]() Restores the previously defined exception handler function
- [set_error_handler]() Sets a user-defined error handler function
- [set_exception_handler]() Sets a user-defined exception handler function
- [trigger_error]() Generates a user-level error/warning/notice message
- [user_error]() Alias of trigger_error

### 7. 程序执行

- [escapeshellarg]() Escape a string to be used as a shell argument
- [escapeshellcmd]() Escape shell metacharacters
- [exec]() Execute an external program
- [passthru]() Execute an external program and display raw output
- [proc_close]() Close a process opened by proc_open and return the exit code of that process
- [proc_get_status]() Get information about a process opened by proc_open
- [proc_nice]() Change the priority of the current process
- [proc_open]() Execute a command and open file pointers for input/output
- [proc_terminate]() Kills a process opened by proc_open
- [shell_exec]() Execute command via shell and return the complete output as a string
- [system]() Execute an external program and display the output

### 8. Filesystem

- [basename]() Returns trailing name component of path
- [chgrp]() Changes file group
- [chmod]() Changes file mode
- [chown]() Changes file owner
- [clearstatcache]() Clears file status cache
- [copy]() Copies file
- [delete]() See unlink or unset
- [dirname]() Returns a parent directory's path
- [disk_free_space]() Returns available space on filesystem or disk partition
- [disk_total_space]() Returns the total size of a filesystem or disk partition
- [diskfreespace]() Alias of disk_free_space
- [fclose]() Closes an open file pointer
- [feof]() Tests for end-of-file on a file pointer
- [fflush]() Flushes the output to a file
- [fgetc]() Gets character from file pointer
- [fgetcsv]() Gets line from file pointer and parse for CSV fields
- [fgets]() Gets line from file pointer
- [fgetss]() Gets line from file pointer and strip HTML tags
- [file_exists]() Checks whether a file or directory exists
- [file_get_contents]() Reads entire file into a string
- [file_put_contents]() Write a string to a file
- [file]() Reads entire file into an array
- [fileatime]() Gets last access time of file
- [filectime]() Gets inode change time of file
- [filegroup]() Gets file group
- [fileinode]() Gets file inode
- [filemtime]() Gets file modification time
- [fileowner]() Gets file owner
- [fileperms]() Gets file permissions
- [filesize]() Gets file size
- [filetype]() Gets file type
- [flock]() Portable advisory file locking
- [fnmatch]() Match filename against a pattern
- [fopen]() Opens file or URL
- [fpassthru]() Output all remaining data on a file pointer
- [fputcsv]() Format line as CSV and write to file pointer
- [fputs]() Alias of fwrite
- [fread]() Binary-safe file read
- [fscanf]() Parses input from a file according to a format
- [fseek]() Seeks on a file pointer
- [fstat]() Gets information about a file using an open file pointer
- [ftell]() Returns the current position of the file read/write pointer
- [ftruncate]() Truncates a file to a given length
- [fwrite]() Binary-safe file write
- [glob]() Find pathnames matching a pattern
- [is_dir]() Tells whether the filename is a directory
- [is_executable]() Tells whether the filename is executable
- [is_file]() Tells whether the filename is a regular file
- [is_link]() Tells whether the filename is a symbolic link
- [is_readable]() Tells whether a file exists and is readable
- [is_uploaded_file]() Tells whether the file was uploaded via HTTP POST
- [is_writable]() Tells whether the filename is writable
- [is_writeable]() Alias of is_writable
- [lchgrp]() Changes group ownership of symlink
- [lchown]() Changes user ownership of symlink
- [link]() Create a hard link
- [linkinfo]() Gets information about a link
- [lstat]() Gives information about a file or symbolic link
- [mkdir]() Makes directory
- [move_uploaded_file]() Moves an uploaded file to a new location
- [parse_ini_file]() Parse a configuration file
- [parse_ini_string]() Parse a configuration string
- [pathinfo]() Returns information about a file path
- [pclose]() Closes process file pointer
- [popen]() Opens process file pointer
- [readfile]() Outputs a file
- [readlink]() Returns the target of a symbolic link
- [realpath_cache_get]() Get realpath cache entries
- [realpath_cache_size]() Get realpath cache size
- [realpath]() Returns canonicalized absolute pathname
- [rename]() Renames a file or directory
- [rewind]() Rewind the position of a file pointer
- [rmdir]() Removes directory
- [set_file_buffer]() Alias of stream_set_write_buffer
- [stat]() Gives information about a file
- [symlink]() Creates a symbolic link
- [tempnam]() Create file with unique file name
- [tmpfile]() Creates a temporary file
- [touch]() Sets access and modification time of file
- [umask]() Changes the current umask
- [unlink]() Deletes a file

### 9. Filter

- [filter_has_var]() Checks if variable of specified type exists
- [filter_id]() Returns the filter ID belonging to a named filter
- [filter_input_array]() Gets external variables and optionally filters them
- [filter_input]() Gets a specific external variable by name and optionally filters it
- [filter_list]() Returns a list of all supported filters
- [filter_var_array]() Gets multiple variables and optionally filters them
- [filter_var]() Filters a variable with a specified filter

### 10. Function Handing

- [call_user_func_array]() Call a callback with an array of parameters
- [call_user_func]() Call the callback given by the first parameter
- [create_function]() Create an anonymous (lambda-style) function
- [forward_static_call_array]() Call a static method and pass the arguments as array
- [forward_static_call]() Call a static method
- [func_get_arg]() Return an item from the argument list
- [func_get_args]() Returns an array comprising a function's argument list
- [func_num_args]() Returns the number of arguments passed to the function
- [function_exists]() Return TRUE if the given function has been defined
- [get_defined_functions]() Returns an array of all defined functions
- [register_shutdown_function]() Register a function for execution on shutdown
- [register_tick_function]() Register a function for execution on each tick
- [unregister_tick_function]() De-register a function for execution on each tick

### 11. Hash

- [hash_algos]() Return a list of registered hashing algorithms
- [hash_copy]() Copy hashing context
- [hash_equals]() Timing attack safe string comparison
- [hash_file]() Generate a hash value using the contents of a given file
- [hash_final]() Finalize an incremental hash and return resulting digest
- [hash_hmac_file]() Generate a keyed hash value using the HMAC method and the contents of a given file
- [hash_hmac]() Generate a keyed hash value using the HMAC method
- [hash_init]() Initialize an incremental hashing context
- [hash_pbkdf2]() Generate a PBKDF2 key derivation of a supplied password
- [hash_update_file]() Pump data into an active hashing context from a file
- [hash_update_stream]() Pump data into an active hashing context from an open stream
- [hash_update]() Pump data into an active hashing context
- [hash]() Generate a hash value (message digest)

### 12. PHP 选项/信息

- [assert_options]() Set/get the various assert flags
- [assert]() Checks if assertion is FALSE
- [cli_get_process_title]() Returns the current process title
- [cli_set_process_title]() Sets the process title
- [dl]() Loads a PHP extension at runtime
- [extension_loaded]() Find out whether an extension is loaded
- [gc_collect_cycles]() Forces collection of any existing garbage cycles
- [gc_disable]() Deactivates the circular reference collector
- [gc_enable]() Activates the circular reference collector
- [gc_enabled]() Returns status of the circular reference collector
- [gc_mem_caches]() Reclaims memory used by the Zend Engine memory manager
- [get_cfg_var]() Gets the value of a PHP configuration option
- [get_current_user]() Gets the name of the owner of the current PHP script
- [get_defined_constants]() Returns an associative array with the names of all the constants and their values
- [get_extension_funcs]() Returns an array with the names of the functions of a module
- [get_include_path]() Gets the current include_path configuration option
- [get_included_files]() Returns an array with the names of included or required files
- [get_loaded_extensions]() Returns an array with the names of all modules compiled and loaded
- [get_magic_quotes_gpc]() Gets the current configuration setting of magic_quotes_gpc
- [get_magic_quotes_runtime]() Gets the current active configuration setting of magic_quotes_runtime
- [get_required_files]() Alias of get_included_files
- [get_resources]() Returns active resources
- [getenv]() Gets the value of an environment variable
- [getlastmod]() Gets time of last page modification
- [getmygid]() Get PHP script owner's GID
- [getmyinode]() Gets the inode of the current script
- [getmypid]() Gets PHP's process ID
- [getmyuid]() Gets PHP script owner's UID
- [getopt]() Gets options from the command line argument list
- [getrusage]() Gets the current resource usages
- [ini_alter]() Alias of ini_set
- [ini_get_all]() Gets all configuration options
- [ini_get]() Gets the value of a configuration option
- [ini_restore]() Restores the value of a configuration option
- [ini_set]() Sets the value of a configuration option
- [magic_quotes_runtime]() Alias of set_magic_quotes_runtime
- [main]() Dummy for main
- [memory_get_peak_usage]() Returns the peak of memory allocated by PHP
- [memory_get_usage]() Returns the amount of memory allocated to PHP
- [php_ini_loaded_file]() Retrieve a path to the loaded php.ini file
- [php_ini_scanned_files]() Return a list of .ini files parsed from the additional ini dir
- [php_logo_guid]() Gets the logo guid
- [php_sapi_name]() Returns the type of interface between web server and PHP
- [php_uname]() Returns information about the operating system PHP is running on
- [phpcredits]() Prints out the credits for PHP
- [phpinfo]() Outputs information about PHP's configuration
- [phpversion]() Gets the current PHP version
- [putenv]() Sets the value of an environment variable
- [restore_include_path]() Restores the value of the include_path configuration option
- [set_include_path]() Sets the include_path configuration option
- [set_magic_quotes_runtime]() Sets the current active configuration setting of magic_quotes_runtime
- [set_time_limit]() Limits the maximum execution time
- [sys_get_temp_dir]() Returns directory path used for temporary files
- [version_compare]() Compares two "PHP-standardized" version number strings
- [zend_logo_guid]() Gets the Zend guid
- [zend_thread_id]() Returns a unique identifier for the current thread
- [zend_version]() Gets the version of the current Zend engine

### 13. Mail

### 14. Math

- [abs]() Absolute value
- [acos]() Arc cosine
- [acosh]() Inverse hyperbolic cosine
- [asin]() Arc sine
- [asinh]() Inverse hyperbolic sine
- [atan2]() Arc tangent of two variables
- [atan]() Arc tangent
- [atanh]() Inverse hyperbolic tangent
- [base_convert]() Convert a number between arbitrary bases
- [bindec]() Binary to decimal
- [ceil]() Round fractions up
- [cos]() Cosine
- [cosh]() Hyperbolic cosine
- [decbin]() Decimal to binary
- [dechex]() Decimal to hexadecimal
- [decoct]() Decimal to octal
- [deg2rad]() Converts the number in degrees to the radian equivalent
- [exp]() Calculates the exponent of e
- [expm1]() Returns exp(number) - 1, computed in a way that is accurate even when the value of number is close to zero
- [floor]() Round fractions down
- [fmod]() Returns the floating point remainder (modulo) of the division of the arguments
- [getrandmax]() Show largest possible random value
- [hexdec]() Hexadecimal to decimal
- [hypot]() Calculate the length of the hypotenuse of a right-angle triangle
- [intdiv]() Integer division
- [is_finite]() Finds whether a value is a legal finite number
- [is_infinite]() Finds whether a value is infinite
- [is_nan]() Finds whether a value is not a number
- [lcg_value]() Combined linear congruential generator
- [log10]() Base-10 logarithm
- [log1p]() Returns log(1 + number), computed in a way that is accurate even when the value of number is close to zero
- [log]() Natural logarithm
- [max]() Find highest value
- [min]() Find lowest value
- [mt_getrandmax]() Show largest possible random value
- [mt_rand]() Generate a better random value
- [mt_srand]() Seed the better random number generator
- [octdec]() Octal to decimal
- [pi]() Get value of pi
- [pow]() Exponential expression
- [rad2deg]() Converts the radian number to the equivalent number in degrees
- [rand]() Generate a random integer
- [round]() Rounds a float
- [sin]() Sine
- [sinh]() Hyperbolic sine
- [sqrt]() Square root
- [srand]() Seed the random number generator
- [tan]() Tangent
- [tanh]() Hyperbolic tangent

### 15. Misc

- [connection_aborted]() Check whether client disconnected
- [connection_status]() Returns connection status bitfield
- [constant]() Returns the value of a constant
- [define]() Defines a named constant
- [defined]() Checks whether a given named constant exists
- [die]() Equivalent to exit
- [eval]() Evaluate a string as PHP code
- [exit]() Output a message and terminate the current script
- [get_browser]() Tells what the user's browser is capable of
- [__halt_compiler]() Halts the compiler execution
- [highlight_file]() Syntax highlighting of a file
- [highlight_string]() Syntax highlighting of a string
- [ignore_user_abort]() Set whether a client disconnect should abort script execution
- [pack]() Pack data into binary string
- [php_check_syntax]() Check the PHP syntax of (and execute) the specified file
- [php_strip_whitespace]() Return source with stripped comments and whitespace
- [show_source]() Alias of highlight_file
- [sleep]() Delay execution
- [sys_getloadavg]() Gets system load average
- [time_nanosleep]() Delay for a number of seconds and nanoseconds
- [time_sleep_until]() Make the script sleep until the specified time
- [uniqid]() Generate a unique ID
- [unpack]() Unpack data from binary string
- [usleep]() Delay execution in microseconds

### 16. 网络

- [checkdnsrr]() Check DNS records corresponding to a given Internet host name or IP address
- [closelog]() Close connection to system logger
- [define_syslog_variables]() Initializes all syslog related variables
- [dns_check_record]() Alias of checkdnsrr
- [dns_get_mx]() Alias of getmxrr
- [dns_get_record]() Fetch DNS Resource Records associated with a hostname
- [fsockopen]() Open Internet or Unix domain socket connection
- [gethostbyaddr]() Get the Internet host name corresponding to a given IP address
- [gethostbyname]() Get the IPv4 address corresponding to a given Internet host name
- [gethostbynamel]() Get a list of IPv4 addresses corresponding to a given Internet host name
- [gethostname]() Gets the host name
- [getmxrr]() Get MX records corresponding to a given Internet host name
- [getprotobyname]() Get protocol number associated with protocol name
- [getprotobynumber]() Get protocol name associated with protocol number
- [getservbyname]() Get port number associated with an Internet service and protocol
- [getservbyport]() Get Internet service which corresponds to port and protocol
- [header_register_callback]() Call a header function
- [header_remove]() Remove previously set headers
- [header]() Send a raw HTTP header
- [headers_list]() Returns a list of response headers sent (or ready to send)
- [headers_sent]() Checks if or where headers have been sent
- [http_response_code]() Get or Set the HTTP response code
- [inet_ntop]() Converts a packed internet address to a human readable representation
- [inet_pton]() Converts a human readable IP address to its packed in_addr representation
- [ip2long]() Converts a string containing an (IPv4) Internet Protocol dotted address into a long integer
- [long2ip]() Converts an long integer address into a string in (IPv4) Internet standard dotted format
- [openlog]() Open connection to system logger
- [pfsockopen]() Open persistent Internet or Unix domain socket connection
- [setcookie]() Send a cookie
- [setrawcookie]() Send a cookie without urlencoding the cookie value
- [socket_get_status]() Alias of stream_get_meta_data
- [socket_set_blocking]() Alias of stream_set_blocking
- [socket_set_timeout]() Alias of stream_set_timeout
- [syslog]() Generate a system log message

### 17. 输出控制

- [flush]() Flush system output buffer
- [ob_clean]() Clean (erase) the output buffer
- [ob_end_clean]() Clean (erase) the output buffer and turn off output buffering
- [ob_end_flush]() Flush (send) the output buffer and turn off output buffering
- [ob_flush]() Flush (send) the output buffer
- [ob_get_clean]() Get current buffer contents and delete current output buffer
- [ob_get_contents]() Return the contents of the output buffer
- [ob_get_flush]() Flush the output buffer, return it as a string and turn off output buffering
- [ob_get_length]() Return the length of the output buffer
- [ob_get_level]() Return the nesting level of the output buffering mechanism
- [ob_get_status]() Get status of output buffers
- [ob_gzhandler]() ob_start callback function to gzip output buffer
- [ob_implicit_flush]() Turn implicit flush on/off
- [ob_list_handlers]() List all output handlers in use
- [ob_start]() Turn on output buffering
- [output_add_rewrite_var]() Add URL rewriter values
- [output_reset_rewrite_vars]() Reset URL rewriter values

### 18. Password Hashing

- [password_get_info]() Returns information about the given hash
- [password_hash]() Creates a password hash
- [password_needs_rehash]() Checks if the given hash matches the given options
- [password_verify]() Verifies that a password matches a hash

### 19. Session

- [session_abort]() Discard session array changes and finish session
- [session_cache_expire]() Return current cache expire
- [session_cache_limiter]() Get and/or set the current cache limiter
- [session_commit]() Alias of session_write_close
- [session_create_id]() Create new session id
- [session_decode]() Decodes session data from a session encoded string
- [session_destroy]() Destroys all data registered to a session
- [session_encode]() Encodes the current session data as a session encoded string
- [session_gc]() Perform session data garbage collection
- [session_get_cookie_params]() Get the session cookie parameters
- [session_id]() Get and/or set the current session id
- [session_is_registered]() Find out whether a global variable is registered in a session
- [session_module_name]() Get and/or set the current session module
- [session_name]() Get and/or set the current session name
- [session_regenerate_id]() Update the current session id with a newly generated one
- [session_register_shutdown]() Session shutdown function
- [session_register]() Register one or more global variables with the current session
- [session_reset]() Re-initialize session array with original values
- [session_save_path]() Get and/or set the current session save path
- [session_set_cookie_params]() Set the session cookie parameters
- [session_set_save_handler]() Sets user-level session storage functions
- [session_start]() Start new or resume existing session
- [session_status]() Returns the current session status
- [session_unregister]() Unregister a global variable from the current session
- [session_unset]() Free all session variables
- [session_write_close]() Write session data and end session

### 20. 反射

### 21. POSIX Regex

- [ereg_replace]() Replace regular expression
- [ereg]() Regular expression match
- [eregi_replace]() Replace regular expression case insensitive
- [eregi]() Case insensitive regular expression match
- [split]() Split string into array by regular expression
- [spliti]() Split string into array by regular expression case insensitive
- [sql_regcase]() Make regular expression for case insensitive matche

### 22. SPL

- [class_implements]() Return the interfaces which are implemented by the given class or interface
- [class_parents]() Return the parent classes of the given class
- [class_uses]() Return the traits used by the given class
- [iterator_apply]() Call a function for every element in an iterator
- [iterator_count]() Count the elements in an iterator
- [iterator_to_array]() Copy the iterator into an array
- [spl_autoload_call]() Try all registered __autoload() function to load the requested class
- [spl_autoload_extensions]() Register and return default file extensions for spl_autoload
- [spl_autoload_functions]() Return all registered __autoload() functions
- [spl_autoload_register]() Register given function as __autoload() implementation
- [spl_autoload_unregister]() Unregister given function as __autoload() implementation
- [spl_autoload]() Default implementation for __autoload()
- [spl_classes]() Return available SPL classes
- [spl_object_hash]() Return hash id for given object

### 23. Streams

- [set_socket_blocking]() Alias of stream_set_blocking
- [stream_bucket_append]() Append bucket to brigade
- [stream_bucket_make_writeable]() Return a bucket object from the brigade for operating on
- [stream_bucket_new]() Create a new bucket for use on the current stream
- [stream_bucket_prepend]() Prepend bucket to brigade
- [stream_context_create]() Creates a stream context
- [stream_context_get_default]() Retrieve the default stream context
- [stream_context_get_options]() Retrieve options for a stream/wrapper/context
- [stream_context_get_params]() Retrieves parameters from a context
- [stream_context_set_default]() Set the default stream context
- [stream_context_set_option]() Sets an option for a stream/wrapper/context
- [stream_context_set_params]() Set parameters for a stream/wrapper/context
- [stream_copy_to_stream]() Copies data from one stream to another
- [stream_encoding]() Set character set for stream encoding
- [stream_filter_append]() Attach a filter to a stream
- [stream_filter_prepend]() Attach a filter to a stream
- [stream_filter_register]() Register a user defined stream filter
- [stream_filter_remove]() Remove a filter from a stream
- [stream_get_contents]() Reads remainder of a stream into a string
- [stream_get_filters]() Retrieve list of registered filters
- [stream_get_line]() Gets line from stream resource up to a given delimiter
- [stream_get_meta_data]() Retrieves header/meta data from streams/file pointers
- [stream_get_transports]() Retrieve list of registered socket transports
- [stream_get_wrappers]() Retrieve list of registered streams
- [stream_is_local]() Checks if a stream is a local stream
- [stream_notification_callback]() A callback function for the notification context parameter
- [stream_register_wrapper]() Alias of stream_wrapper_register
- [stream_resolve_include_path]() Resolve filename against the include path
- [stream_select]() Runs the equivalent of the select() system call on the given arrays of streams with a timeout specified by tv_sec and tv_usec
- [stream_set_blocking]() Set blocking/non-blocking mode on a stream
- [stream_set_chunk_size]() Set the stream chunk size
- [stream_set_read_buffer]() Set read file buffering on the given stream
- [stream_set_timeout]() Set timeout period on a stream
- [stream_set_write_buffer]() Sets write file buffering on the given stream
- [stream_socket_accept]() Accept a connection on a socket created by stream_socket_server
- [stream_socket_client]() Open Internet or Unix domain socket connection
- [stream_socket_enable_crypto]() Turns encryption on/off on an already connected socket
- [stream_socket_get_name]() Retrieve the name of the local or remote sockets
- [stream_socket_pair]() Creates a pair of connected, indistinguishable socket streams
- [stream_socket_recvfrom]() Receives data from a socket, connected or not
- [stream_socket_sendto]() Sends a message to a socket, whether it is connected or not
- [stream_socket_server]() Create an Internet or Unix domain server socket
- [stream_socket_shutdown]() Shutdown a full-duplex connection
- [stream_supports_lock]() Tells whether the stream supports locking.
- [stream_wrapper_register]() Register a URL wrapper implemented as a PHP class
- [stream_wrapper_restore]() Restores a previously unregistered built-in wrapper
- [stream_wrapper_unregister]() Unregister a URL wrapper

### 24. Tokenizer

- [token_get_all]() Split given source into PHP tokens
- [token_name]() Get the symbolic name of a given PHP token

### 25. URLs

- [base64_decode]() Decodes data encoded with MIME base64
- [base64_encode]() Encodes data with MIME base64
- [get_headers]() Fetches all the headers sent by the server in response to a HTTP request
- [get_meta_tags]() Extracts all meta tag content attributes from a file and returns an array
- [http_build_query]() Generate URL-encoded query string
- [parse_url]() Parse a URL and return its components
- [rawurldecode]() Decode URL-encoded strings
- [rawurlencode]() URL-encode according to RFC 3986
- [urldecode]() Decodes URL-encoded string
- [urlencode]() URL-encodes string

### 26. Variable Handing

- [boolval]() Get the boolean value of a variable
- [debug_zval_dump]() Dumps a string representation of an internal zend value to output
- [doubleval]() Alias of floatval
- [empty]() Determine whether a variable is empty
- [floatval]() Get float value of a variable
- [get_defined_vars]() Returns an array of all defined variables
- [get_resource_type]() Returns the resource type
- [gettype]() Get the type of a variable
- [import_request_variables]() Import GET/POST/Cookie variables into the global scope
- [intval]() Get the integer value of a variable
- [is_array]() Finds whether a variable is an array
- [is_bool]() Finds out whether a variable is a boolean
- [is_callable]() Verify that the contents of a variable can be called as a function
- [is_double]() Alias of is_float
- [is_float]() Finds whether the type of a variable is float
- [is_int]() Find whether the type of a variable is integer
- [is_integer]() Alias of is_int
- [is_long]() Alias of is_int
- [is_null]() Finds whether a variable is NULL
- [is_numeric]() Finds whether a variable is a number or a numeric string
- [is_object]() Finds whether a variable is an object
- [is_real]() Alias of is_float
- [is_resource]() Finds whether a variable is a resource
- [is_scalar]() Finds whether a variable is a scalar
- [is_string]() Find whether the type of a variable is string
- [isset]() Determine if a variable is set and is not NULL
- [print_r]() Prints human-readable information about a variable
- [serialize]() Generates a storable representation of a value
- [settype]() Set the type of a variable
- [strval]() Get string value of a variable
- [unserialize]() Creates a PHP value from a stored representation
- [unset]() Unset a given variable
- [var_dump]() Dumps information about a variable
- [var_export]() Outputs or returns a parsable string representation of a variable