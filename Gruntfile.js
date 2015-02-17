module.exports = function( grunt ) {
	
	grunt.initConfig({
		
		// Grab config
		
		pkg: grunt.file.readJSON('bower.json'),
		
		// Concatenate Javascript files
		
		concat: {
			options: {
				separator: "\n\n\n"
			},
			dist: {
				src: [
					'../../lib/jslib/src/js/StringExt.js',
					'../../lib/jslib/src/js/TimeStamp.js',
					'../../lib/jslib/third_party/datejs/date.js',
					'bower_components/ng-file-upload/angular-file-upload.min.js',
					'bower_components/ng-file-upload/angular-file-upload-shim.min.js',
					'angular/**/*.js',
					'js/*.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		
		// Minify Javascript
		
		uglify: {
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		
		// Watch for changes and then rebuild
		
		watch: {
		  files: ['<%= concat.dist.src %>'],
		  tasks: ['concat', 'uglify']
		}
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', [ 'concat', 'uglify']);
}