---
layout: post
title: shell logging
description: linux, shell, logging
tags: [linux]
category: linux
```

```shell
#!/bin/bash
# set LOG_FILEPATH, then log will be printed to the location. e.g., LOG_FILEPATH=./log/cpc_impression_report.log
# e.g., noticelog "first log information"

if [ "$LOG_FILEPATH" != "" ]
then
   _logname=`basename $LOG_FILEPATH `
   _logdir=${LOG_FILEPATH%/*}
   _logpath=$LOG_FILEPATH
else
   _logname=`basename $0`.log
   _logdir=./log && test -d ./logs  && _logdir=./logs
   _logpath=${_logdir}/${_logname}
fi


_logrotate=14
_script=$0
_logpathwf=${_logpath}.wf
_log_initflag=1

_initlog()
{
   if [ ! -d "$_logdir" ]
   then
	  _logpath=/dev/stdout && _logpathwf=/dev/stderr
   fi
}

_writelog()
{
   _loglevel=$1
   if [ $1 == "" ] ; then
	  _loglevel="INFO"
   fi
   _logmsg="$2"
   if [ "$_logmsg" == "" ] ; then
	  _logmsg= "NULL"
   fi

   _logstamp=`date +%Y%m%d-%H:%M:%S`

   if [ "$_loglevel" == "STDOUT" ] ; then
	  echo "${_logstamp} ${_loglevel} : ${_logmsg}"
	  return
   fi

   if [ ! -d "$_logdir" ]
   then
	  if [ "$_loglevel" == "INFO" ] || [ "$_loglevel" == "DEBUG" ]
	  then
		 echo "${_logstamp} ${_loglevel} : ${_logmsg}"
	  else
		 echo "${_logstamp} ${_loglevel} : ${_logmsg}" 1>&2
	  fi
   else
	  if [ "$_loglevel" == "INFO" ] || [ "$_loglevel" == "DEBUG" ]
	  then
		 echo "${_logstamp} ${_loglevel} : ${_logmsg}" >> ${_logpath}
	  else
		 echo "${_logstamp} ${_loglevel} : ${_logmsg}" >> ${_logpathwf}
	  fi
   fi
}

setlogpath ()
{
   _logpath=$1
   _logname=`basename $_logpath `
   _logdir=${_logpath%/*}
   _logpathwf=${_logpath}.wf

   _initlog
}

stdoutlog ()
{
   _writelog "STDOUT" "$1"
}

debuglog ()
{
   _writelog "DEBUG" "$1"
}

infolog ()
{
   _writelog "INFO" "$1"
}

noticelog ()
{
   _writelog "NOTICE" "$1"
}

warnlog ()
{
   _writelog "WARNING" "$1"
}

errorlog ()
{
   _writelog "ERROR" "$1"
}

fatallog ()
{
   _writelog "FATAL" "$1"
}
criticallog ()
{
   _writelog "CRITICAL" "$1"
}

_initlog

```
