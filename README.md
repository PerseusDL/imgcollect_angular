# Development Installation

Fresh Install of Ubuntu 12.04

	Note I used VirtualBox for testing
	This reminder is for me...
		fn+shift UP and DOWN to terminal scroll with Macbook

### Basic Environment

	sudo apt-get update
	sudo apt-get install build-essential zlib1g-dev libssl1.0.0 libssl-dev git 

### Setup JackSON

	sudo mkdir -p /var/www
	sudo chown -R user /var/www
	git clone https://github.com/caesarfeta/JackSON /var/www/JackSON
	cd /var/www/JackSON
	git submodule update --init

### Build Ruby

	cd /var/www/JackSON
	./rbenv.sh
	source ~/.bash_profile
	rbenv rehash

### Install JackSON dependencies

	sudo apt-get install rubygems
	gem install bundler
	rbenv rehash
	bundle install

### Install JackRDF

	git clone https://github.com/caesarfeta/JackRDF /var/www/JackRDF
	cd /var/www/JackRDF
	rake install

You might get this error...

	rake aborted!
	Couldn't install gem...

Just run this:

	gem install /var/www/JackRDF/pkg/JackRDF-1.0.1.gem

### Install JackRDFs coupled fuseki server

	sudo apt-get install default-jre
	sudo apt-get install default-jdk
	rake server:install

### Start fuseki

	cd /var/www/JackRDF
	rake server:start

Make sure JackRDF and fuseki are working

	rake test

### Start JackSON

	cd /var/www/JackSON
	rake start

Make sure JackSON is running properly

	rake test

### Install imgcollect_angular UI

	cd /var/www/JackSON/public/apps/imgcollect

Install nodejs this funky way.  [Taken from stackoverflow](http://stackoverflow.com/questions/12913141/installing-from-npm-fails)

	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
	sudo npm install bower -g
	bower install
	bundle install

Watch for changes / build CSS

	bundle exec compass watch

### Install imgup server

	git clone https://github.com/caesarfeta/imgup

### Get CITE-JSON-LD templates

	git clone https://github.com/PerseusDL/CITE-JSON-LD /var/www/JackSON/templates/cite

### Create fake development data

	gem install faker
	ruby /var/www/JackSON/templates/cite/templates/img/fake.rb

### Your app is working?

Take a quick peak.

	http://localhost:4567/apps/imgcollect

### Clearout fake data
When the time comes...

	cd /var/www/JackSON
	rake data:destroy

# Production Installation
Things to consider.
What is necessary to install?
You might have to share a host with other services.
You don't want to break those services by unncessarily installing.
