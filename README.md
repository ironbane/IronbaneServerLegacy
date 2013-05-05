Ironbane Server
==============

The server for Ironbane, the open source MMO. 
Play the game at <http://www.ironbane.com/>.

## Requirements

* Make sure you have [installed the Ironbane client](https://github.com/ironbane/IronbaneClient) as code is shared between the client and server
* NodeJS 0.8.5 (possibly also later versions, haven't tested)

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
* Copy ```config_example.js``` from the ```/install/``` directory to the root directory

* Rename your copied ```config_example.js``` to ```config.js```

* Change the variables inside ```config.js``` to match your system.
   **Note for Windows users**: do not use an absolute path for clientDir. There is a bug with Node.js that creates faulty absolute paths, only use relative paths.

* Run ```node main.js``` from the root directory.   

## Note

A lot of code in this repository is somewhat ancient and majority of it needs to be improved/rewritten.
I have learned more about better software development since I started this project, and would do it differently if I had to start over.
That being said, it works! If you find stuff you think you can improve, by all means go for it and make a pull request!
