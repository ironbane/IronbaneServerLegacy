Ironbane Server
============================================

![Ironbane Logo](http://www.ironbane.com/theme/images/logo_isolated.png)

The server for Ironbane, the open source MMO.
Play the game at <http://www.ironbane.com/>.

## Requirements
* GraphicsMagick
* NodeJS
* Grunt
* MySql

## Getting started

* Clone this repository somewhere on your system.

```
    git clone https://github.com/ironbane/IronbaneServer.git
```

* Install [GraphicsMagick](http://www.graphicsmagick.org/), make sure the binaries are in your PATH.

* Install [MySql](http://dev.mysql.com/downloads/mysql/)

* Install [Node.js version 0.8.5 or higher](http://nodejs.org/download/)

* Checkout the [IronbaneAssets repo](https://github.com/ironbane/IronbaneAssets) in your root folder.

```
    git clone git@github.com:ironbane/IronbaneAssets.git
``` 

Your root folder should now contain an IronbaneAssets folder.

* Run ```npm install``` from the root directory

* Run ```node ironbane.js init``` at the prompt **OR** Create a ```config.json``` file setting values for the properties you need. Refer to ```nconf.js``` for the defaults.

* Run ```npm install -g grunt-cli``` to install Grunt

* (Optional) If you want to make new 3d models and test them out, you will need to have [Python 2.7.x](http://www.python.org/download/) installed. Do not use the latest version of Python, only 2.7.x currently works with the script that converts our 3d models to be used in-game.

* Run grunt ```grunt```

* Run ```node ironbane.js adminpass``` from the root directory to set a new admin password.

* Run ```mysql -u root -p ironbane < IronbaneAssets/gamecontent.sql``` from the root directory to populate the db

* Run ```node ironbane.js start``` from the root directory.

* Open ```http://localhost:8080/``` to try out your installation.

* Login using username ```admin``` and your password.
