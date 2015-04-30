module.exports = function(mId, callIds, callback) {
    var self = this;
    
    this.mId = mId;

    this.isCallbackBlocked = false;
    this.callData = {};
    this.isSuccess = true;
    
    this.init = function() {
        for (var i = 0; i < callIds.length; i++) {
            this.callData[callIds[i]] = {
                isDone: false,
                data: null
            };
        }
    };
    
    this.process = function(callId, isSuccess, data) {
        self.callData[callId].data = data;
        self.callData[callId].isDone = true;
        
        if (!isSuccess) {
            self.isSuccess = false;
        }
        
        if (!self.isAllCallsDone())
            return;
        
        if (!self.isCallbackBlocked) {
            self.isCallbackBlocked = true;
            callback(self.formCallbackData(), self.mId);
        }
    };
    
    this.formCallbackData = function() {
        var data = {};
        for (var id in self.callData) {
            data[id] = self.callData[id].data;
        }
        data.__isSuccess = self.isSuccess;        
        return data;
    };
    
    this.isAllCallsDone = function() {
        for (var id in this.callData) {
            if (!this.callData[id].isDone)
                return false;
        }
        return true;
    };
    
    this.init();
};