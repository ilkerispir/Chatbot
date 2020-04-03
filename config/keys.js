if(process.env.NODE_ENV === 'productionnn') {
    module.exports = require('./prod');
}else {
    module.exports = require('./dev');
}

