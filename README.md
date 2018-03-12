
# About
This platform and corresponding mobile app were developed in the [Look! A healthy neighborhood](http://cargocollective.com/citizendatalab/filter/mapping/Look-A-Healthy-Neighbourhood) project which was a collaboration between [AUAS(HvA)](http://www.hva.nl/), [RIVM](http://www.rivm.nl), [GGD](http://www.ggd.nl), [Eigenwijks](https://www.eigenwijks.nl/) and the [municipality of Amsterdam](https://www.amsterdam.nl/).

See the [Wiki](https://github.com/citizendatalab/Mappingthecity/wiki) for screenshots

The tool consists of a data platform and  a mobile application. The mobile application allows people to collect data, based on the routes and questions created in the data platform admin panel. Users can gather points by completing questions and routes, which will be shown on a leaderboard in the app. All collected data is stored in the data platform. It is also possible to view the collected data on a map.

Publications using the current and previous versions of this tool:

- *Groen, M., Meys, W. (2017). Collaborative data practices in the neighborhood: An Amsterdam case study, E-Society Conference Proceedings*

- *Cila, N., Jansen, G., Groen, M., Meys, W., den Broeder, L., & Kröse, B. (2016). Look! A healthy neighborhood: means to motivate participants in using an app for monitoring community health. In Proceedings of the 2016 CHI Conference Extended Abstracts on Human Factors in Computing Systems (pp. 889-898). ACM.*

- *Groen, M., Meys, W. (2015) Measuring Amsterdam: A participatory mapping tool for citizen empowerment, Hybrid City Conference Proceedings, University of Athens.*


# Requirements
This tutorial will focus on deploying the dataplatform on an Ubuntu Server(12.04).

# Deploying dataplatform

Install [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

Install [Nodejs](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

Install bower using:

    npm install -g bower

Install Forever package (For running the server)
	
    npm install forever -g


Run the following commands in the project root folder:

    npm install
    bower install



Edit the sample_config.js file. Change the secret and email credentials. Rename the file to config.js

Create a *sslcert* folder in the main folder and add your SSL certificates. Edit server_https.js and edit the *privateKey*, *certificate* and *cacert* variables if needed. 

You can start the server using:

    forever start server_https


Going to *https://yourserveripordomain:3000* should now show an empty map.



You can create a regular user via the https://yourserveripordomain:3000/register endpoint using the following body:


`{email:<emailadres>, password:<password>}`

Accounts created via the register endpoint do not have admin rights. 
For now you will have to change the role of the added user manually from 'normal' to 'admin' in the database.



# Building App


Install cordova on your local machine via [https://cordova.apache.org/docs/en/latest/guide/cli/](https://cordova.apache.org/docs/en/latest/guide/cli/)


    cordova platform add android
    cordova platform add ios


Generate APK using

    cordova build android 

See for more info about building and deploying via Cordova [the official documentation](https://cordova.apache.org/docs/en/latest/)






