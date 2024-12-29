// apollo.config.js
module.exports = {
     client: {
       service: {
         name: 'vue-graphql',
         url: 'http://localhost:8055/graphql',  // Direct URL to Directus GraphQL endpoint
       },
       includes: [
         'src/**/*.vue',
         'src/**/*.js',
       ],
     },
   }