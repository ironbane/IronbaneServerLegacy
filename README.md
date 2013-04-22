Ironbane Server
==============

The server for Ironbane, the open source MMO. 
Play the game at <http://www.ironbane.com/>.

## Requirements

* NodeJS 0.8.5 (possibly also later versions, haven't tested)
* A local webserver (XAMPP, WAMP, etc)
* MySQL 5.0 or later
* A MySQL client (I recommend [SQLyog Community Edition](https://code.google.com/p/sqlyog/downloads/list) but you can also use phpMyAdmin which should come pre-installed with your webserver)
* PHP 5.3.8 or later
* [An installed Ironbane Server](https://github.com/ironbane/IronbaneServer/)

## Getting started

* Clone this repository someowhere on your system.
    git clone git@github.com:ironbane/IronbaneServer.git

* Next, you need to install a few npm packages:

    npm install socket.io@0.9.6
    npm install mysql@2.0.0-alpha2

    TODO

## Note

A lot of code in this repository is somewhat ancient and majority of it needs to be improved/rewritten.
I have learned more about better software development since I started this project, and would do it differently if I had to start over.
That being said, it works! If you find stuff you think you can improve, by all means go for it and make a pull request!
