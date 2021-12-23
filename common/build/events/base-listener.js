"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
// generic class with type extends interface Event
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.acWait = 5 * 1000; //5sec wait for ack
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setAckWait(this.acWait)
            .setDurableName(this.queueGroupName);
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', function (msg) {
            console.log("Message Received: " + _this.subject + " / " + _this.queueGroupName);
            var parseData = _this.parseMessage(msg);
            _this.onMessage(parseData, msg);
        });
    };
    Listener.prototype.parseMessage = function (msg) {
        var data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8')); //for parsing a buffer
    };
    return Listener;
}());
exports.Listener = Listener;
