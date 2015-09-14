module.exports = {
    getFileName: function(bundleName) {
        return bundleName.split('/').pop();
    }
};