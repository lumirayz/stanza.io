"use strict";

var stanzas = require('../stanza/pubsub');


module.exports = function (client) {

    client.on('message', function (msg) {
        if (msg._extensions.event) {
            client.emit('pubsubEvent', msg);
        }
    });

    client.subscribeToNode = function (jid, opts, cb) {
        client.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                subscribe: {
                    node: opts.node,
                    jid: opts.jid || client.jid
                }
            }
        }, cb);
    };

    client.unsubscribeFromNode = function (jid, opts, cb) {
        client.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                unsubscribe: {
                    node: opts.node,
                    jid: opts.jid || client.jid.split('/')[0]
                }
            }
        }, cb);
    };

    client.publish = function (jid, node, item, cb) {
        client.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                publish: {
                    node: node,
                    item: item
                }
            }
        }, cb);
    };

    client.getItem = function (jid, node, id, cb) {
        client.sendIq({
            type: 'get',
            to: jid,
            pubsub: {
                retrieve: {
                    node: node,
                    item: id
                }
            }
        }, cb);
    };

    client.getItems = function (jid, node, opts, cb) {
        opts = opts || {};
        opts.node = node;
        client.sendIq({
            type: 'get',
            to: jid,
            pubsub: {
                retrieve: {
                    node: node,
                    max: opts.max
                },
                rsm: opts.rsm
            }
        }, cb);
    };

    client.retract = function (jid, node, id, notify, cb) {
        client.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                retract: {
                    node: node,
                    notify: notify,
                    id: id
                }
            }
        }, cb);
    };

    client.purgeNode = function (jid, node, cb) {
        client.sendIq({
            type: 'set',
            to: jid,
            pubsubOwner: {
                purge: node
            }
        }, cb);
    };

    client.deleteNode = function (jid, node, cb) {
        client.sendIq({
            type: 'set',
            to: jid,
            pubsubOwner: {
                del: node
            }
        }, cb);
    };

    client.createNode = function (jid, node, config, cb) {
        var cmd = {
            type: 'set',
            to: jid,
            pubsubOwner: {
                create: node
            }
        };
        
        if (config) {
            cmd.pubsubOwner.config = {form: config};
        }

        client.sendIq(cmd, cb);
    };
};
