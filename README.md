Ironbane Server - AngularJS / NodeJS Edition
============================================

The server for Ironbane, the open source MMO. 
Play the game at <http://www.ironbane.com/>.

## Requirements
* NodeJS
* Grunt
* MySql

## Getting started

* Clone this repository somewhere on your system. Don't put it inside your webserver directory, as anyone can then view your database password.

```
    git clone https://github.com/ironbane/IronbaneServer.git
```

* Install [Node.js version 0.8.5 or higher](http://nodejs.org/download/) if you haven't yet

* Next, run the following command from the root directory
 
```
    npm install
```

* Create a ```config.json``` file setting values for the properties you need. Refer to ```nconf.js``` for the defaults.

* Install grunt ``` npm install -g grunt-cli ```

* Run grunt ``` grunt ```

* Run ```node main.js``` from the root directory.   

## Note

This branch is currently a WIP of rewriting the code base to use all AngularJS and NodeJS.
