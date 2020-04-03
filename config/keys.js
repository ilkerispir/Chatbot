if(process.env.NODE_ENV === 'productionn') {
    module.exports = require('./prod');
}else {
    module.exports = require('./dev');
}

