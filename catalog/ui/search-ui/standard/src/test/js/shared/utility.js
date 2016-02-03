module.exports = {
    /*
     Mocha Utility for Asynchronous Tests

     If done is not called in asynchonous tests, mocha simply reports a timeout error.
     However, we're more concerned with the assertion that threw the error than the
     timeout.  This wrapper function ensures that done will be called with the appropriate
     error (the assertion error), resulting in better test reports.
     */
    tryAssertions: function (assertions) {
        try {
            assertions();
        } catch (error) {
            return error;
        }
    },
    getSquire: function(){
        var requirejs = require('requirejs');
        requirejs.config({
            baseUrl: '.',
            nodeRequire: require,
            packages: [
                {
                    name: 'squirejs',
                    location: 'node_modules/squirejs',
                    main: 'src/Squire'
                }
            ]
        });
        return requirejs('squirejs');
    }
};