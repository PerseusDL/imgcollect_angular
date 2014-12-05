# Development Installation

Fresh Install of Ubuntu 12.04

	Note I used VirtualBox for testing
	This reminder is for me...
		fn+shift UP and DOWN to terminal scroll with Macbook

### Foundation

	sudo apt-get update
	sudo apt-get install build-essential zlib1g-dev libssl1.0.0 libssl-dev git 

### Setup JackSON directory

	sudo mkdir -p /var/www
	sudo chown -R user:group /var/www
	git clone https://github.com/caesarfeta/JackSON /var/www/JackSON

### Build Ruby

	cd /var/www/JackSON
	./rbenv.sh
	source ~/.bash_profile
	rbenv rehash

### Install JackSON

	sudo apt-get install rubygems
	gem install bundler
	bundle install

### Install JackRDF

	git clone https://github.com/caesarfeta/JackRDF /var/www/JackRDF
	cd /var/www/JackRDF
	rake install

### Install JackRDFs coupled fuseki server

	cd /var/www/JackRDF
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

	git clone https://github.com/caesarfeta/imgcollect_angular /var/www/JackSON/public/apps/imgcollect
	cd /var/www/JackSON/public/apps/imgcollect
	gem install compass

Install nodejs this funky way
http://stackoverflow.com/questions/12913141/installing-from-npm-fails

	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install -y nodejs
	sudo npm install bower -g
	bower install

Watch for changes

	bundle exec compass watch

### Get CITE-JSON-LD templates

	git clone https://github.com/PerseusDL/CITE-JSON-LD /var/www/JackSON/templates/cite

### Create fake development data

	gem install faker
	cd /var/www/JackSON/templates/cite/templates/img
	ruby fake.rb

### Your app is working?

	http://localhost:4567/apps/imgcollect

### Clearout fake data
When the time comes...

	cd /var/www/JackSON
	rake data:destroy

# Production Installation
Coming soon!