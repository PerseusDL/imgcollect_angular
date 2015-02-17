require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

desc "Install dependencies and build"
task :install do
  sh "bower install"
  sh "bundle install"
  sh "bundle exec compass compile"
end