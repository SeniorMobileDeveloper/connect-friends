Ionic 2 Friends Connection - Tinder Style
=====================

## Using this project

You'll need the Ionic CLI with support for v2 apps:

```bash
$ npm install -g ionic
$ npm install
```

## App structure

```
.
|-- src
|   |-- app
|   |   |-- app.componet.ts 			# main app component
|   |   |-- app.module.ts       		# app root module
|   |   |-- constants.ts      			# app constants
|   |       
|   |-- assets          			# static resources folder
|   |   |-- img 						# static images
|   |   |-- fonts   					# custom static fonts
|   |       
|   |-- components					# reusable components
|   |   |-- modal_confirm				# confirm modal component
|   |   |	|-- confirm.html				# modal template
|   |   |	|-- confirm.scss				# component style
|   |   |	|-- confirm.ts					# component actions
|   |       
|   |-- lib      					# third party files
|   |       
|   |-- pages      					# third party files
|   |   |-- account 					# user profile page
|   |   |	|-- account.html				# profile page template
|   |   |	|-- account.scss				# profile page style
|   |   |	|-- account.ts					# profile page actions
|   |   |-- checkin_page				# check in page
|   |   |	|-- checkin_page.html			# check in page template
|   |   |	|-- checkin_page.scss			# check in page style
|   |   |	|-- checkin_page.ts				# check in page actions
|   |   |-- login 						# login page
|   |   |	|-- login.html					# login page template
|   |   |	|-- login.scss					# login page style
|   |   |	|-- login.ts					# login page actions
|   |   |-- main_page					# main page
|   |   |	|-- main_page.html				# main page template
|   |   |	|-- main_page.ts				# main page actions
|   |   |-- navigation_page				# navigation page
|   |   |	|-- navigation_page.html			# navigation page template
|   |   |	|-- navigation_page.scss			# navigation page style
|   |   |	|-- navigation_page.ts				# navigation page actions
|   |   |-- signup						# signup page
|   |   |	|-- signup.html					# signup page template
|   |   |	|-- signup.ts					# signup page actions
|   |   |-- swipe_main_page				# swipe page
|   |   |	|-- swipe_main_page.html		# swipe page template
|   |   |	|-- swipe_main_page.scss		# swipe page style
|   |   |	|-- swipe_main_page.ts			# swipe page actions
|   |       
|   |-- providers 						# services and directives
|   |   |-- groups.service.ts				# service for managing group operations
|   |   |-- httpclient.service.ts			# service for managing http requests
|   |   |-- location.service.ts				# geolocation service
|   |   |-- users.service.ts				# service for managing user operations
|   |       
|   |-- index.html
...

```


## Run this command to open in browser
```
$ ionic serve
```

## Add iOS platform
```
$ ionic platform add ios
```

## Add Android platform
```
$ ionic platform add android
```
