---
categories:
  - HAProxy
  - Setup
  - Install
title: "Getting started with HAProxy: Install from code source"
date: "2018-05-09T20:51:0-05:00"
draft: false
---
## intro
In this post, I will demonstrate how we can install HAProxy from source code. According to [Wikipedia](https://en.wikipedia.org/wiki/HAProxy), HAProxy was written and still maintained by [Willy Tarreau](http://1wt.eu/#wami) since 2000. HAProxy is free open source software (FOSS), that provides a high availability load balancer and proxy server for TCP (Transmission Control Protocol) and HTTP (Hypertext Transfer Protocol) based applications that spreads requests across multiple servers. It is written in __C__ language and thus the reputation for being fast and efficient.
 
If you are curious, this [HAProxy Page](http://www.haproxy.org/#feat) offers more details about its features.

## Installation

In this guide , we will be installing the latest stable version of 1.8 (as of May 09, 2018). the current HAProxy available under RHEL is `1.5.18` and `1.8.8` on Debian/Ubuntu. before taking the next step, make sure you have `gcc`, `pcre-static` and `pcre-devel` installed:

    # CentOS RHEL:
    sudo yum -y install make gcc perl pcre-devel zlib-devel
    
    # Debian/Ubuntu:
    sudo apt install make gcc perl pcre-devel zlib-devel
    
Enable IP forwarding and binding to non-local IP addresses:

    # echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
    # echo "net.ipv4.ip_nonlocal_bind = 1" >> /etc/sysctl.conf
    # sysctl -p
    net.ipv4.ip_forward = 1
    net.ipv4.ip_nonlocal_bind = 1

Download the source code:

    wget https://www.haproxy.org/download/1.8/src/haproxy-1.8.8.tar.gz
    
Extract the file and change directory:

    tar xvzf haproxy-1.8.8.tar.gz && cd haproxy-1.8.8

Compile the program:

    make TARGET=linux2628 USE_PCRE=1 USE_OPENSSL=1 USE_ZLIB=1

This is the list of TARGETs:

  - linux22     for Linux 2.2
  - linux24     for Linux 2.4 and above (default)
  - linux24e    for Linux 2.4 with support for a working epoll (> 0.21)
  - linux26     for Linux 2.6 and above
  - linux2628   for Linux 2.6.28, 3.x, and above (enables splice and tproxy)
  - solaris     for Solaris 8 or 10 (others untested)
  - freebsd     for FreeBSD 5 to 10 (others untested)
  - netbsd      for NetBSD
  - osx         for Mac OS/X
  - openbsd     for OpenBSD 5.7 and above
  - aix51       for AIX 5.1
  - aix52       for AIX 5.2
  - cygwin      for Cygwin
  - haiku       for Haiku
  - generic     for any other OS or version.
  - custom      to manually adjust every setting

You can also compile the program with following options:
USE_PCRE=1 to use libpcre, in whatever form is available on your system (shared or static).
USE_ZLIP=1 to use zlib compression Library.
USE_OPENSSL=1 to add native support for SSL using the GNU makefile.

Install HAProxy:

    sudo make install
    
With that, we should now have the chosen HAProxy version installed. now we need to setup HAProxy.

## Setup:

Adding HAProxy user:
    
    id -u haproxy &> /dev/null || useradd -s /usr/sbin/nologin -r haproxy
    
Copy HAProxy binary located in the extracted HAProxy directory to `/usr/sbin/`:

    cp haproxy /usr/sbin/
    
Create Manual page:
    
    wget -qO - https://raw.githubusercontent.com/horms/haproxy/master/doc/configuration.txt | gzip -c > /usr/share/doc/haproxy/configuration.txt.gz


Create Systemd service script to manage HAProxy, use the following at your discretion:

    sudo wget https://gist.githubusercontent.com/tmidi/1699a358533ae876513e2887fec6fbe2/raw/6c07ce39adc56c731d2bbeb88b90d8bbc636f3ea/haproxy.service -O /lib/systemd/system/haproxy.service
    

or create `/lib/systemd/system/haproxy.service` with the following content: 
    
    [Unit]
    Description=HAProxy Load Balancer
    Documentation=man:haproxy(1)
    Documentation=file:/usr/share/doc/haproxy/configuration.txt.gz
    # allows us to do millisecond level restarts without triggering alert in Systemd
    StartLimitInterval=0
    StartLimitBurst=0
    After=network.target syslog.service
    Wants=syslog.service
    
    [Service]
    Environment="CONFIG=/etc/haproxy/haproxy.cfg" "PIDFILE=/run/haproxy.pid"
    # EXTRAOPTS and RELOADOPS come from this default file
    EnvironmentFile=-/etc/default/haproxy
    ExecStartPre=/usr/sbin/haproxy -f $CONFIG -c -q
    ExecStart=/usr/sbin/haproxy -W -f $CONFIG -p $PIDFILE $EXTRAOPTS
    ExecReload=/usr/sbin/haproxy -f $CONFIG -c -q $EXTRAOPTS $RELOADOPTS
    ExecReload=/bin/kill -USR2 $MAINPID
    KillMode=mixed
    Restart=always
    Type=forking
    
    [Install]
    WantedBy=multi-user.target


Enable and start `haproxy.service`:
    
    systemctl enablle haproxy.service
    systemctl start haproxy.service

## Conclusion
This conclude conclude HAProxy installation steps.This guide however covers only the installation steps, in future post I will demonstrate how to configure HAProxy to load balance three backend web servers while using sticky session and SSL Pass-through.

If you find this guide helpful, please share it with your friends and colleagues. I am on [Twitter](https://twitter.com/taleeb_midi) and [LinkedIn](https://www.linkedin.com/in/taleebmidi/), let's connect or let me know if you have any question or any suggestions.