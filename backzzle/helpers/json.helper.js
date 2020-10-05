const JsonHelper = {
    isJson: function (value) {
        try {
            if (typeof value !== 'string') {
                return false;
            }

            JSON.parse(value);
        }
        catch (err) {
            return false;
        }

        return true;
    },

    toB64: function (obj) {
        if (!JsonHelper.isJson(obj)) {
            obj = JSON.stringify(obj);
        }

        return JsonHelper.btoa(obj);
    },

    fromB64: function (data) {
        var json = JsonHelper.atob(data);
        return JSON.parse(json);
    },

    stringFromB64: function (data) {
        return JsonHelper.atob(data);
    },

    fromB64ToBuffer: function (b64str) {
        let buffer = Buffer.from(b64str, 'base64');
        return buffer;
    },

    btoa: function (str) {
        return Buffer.from(str, 'binary').toString('base64');
    },

    atob: function (str) {
        return Buffer.from(str, 'base64').toString('binary');
    }
};

module.exports = JsonHelper;