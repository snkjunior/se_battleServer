var component = {
    getTime: function() {
        return Math.floor((new Date()).getTime() / 1000);
    },
    
    getDatetime: function() {
        return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }
};

module.exports = component;


