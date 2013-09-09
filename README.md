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

* Get a copy of the base assets from http://www.ironbane.com/data.tar

* Make a new folder ```media``` in your repository, and extract the assets archive in this folder.

* Next, run ```npm install``` from the root directory

* Run ```ironbane init``` at the prompt OR Create a ```config.json``` file setting values for the properties you need. Refer to ```nconf.js``` for the defaults.

* Install grunt ``` npm install -g grunt-cli ```

* (Optional) If you want to make new 3d models and test them out, you will need to have [Python 2.7.x](http://www.python.org/download/) installed. Do not use the latest version of Python, only 2.7.x currently works with the script that converts our 3d models to be used in-game.

* Run grunt ```grunt```

* Run ```ironbane start``` from the root directory.

* Open ```http://localhost:8080/``` to try out your installation.

* Login using username and password ```admin```.
