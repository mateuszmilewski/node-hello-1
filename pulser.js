var events = require('events');
var util   = require('util');

// Definicja typu Pulser
function Pulser() {
    events.EventEmitter.call(this);
}
util.inherits(Pulser, events.EventEmitter);

Pulser.prototype.start = function() {
    var self = this;
    setInterval(() => {
        util.log('>>>> pulse');
        self.emit('pulse');
        util.log('<<<< pulse');
    }, 1000);
};

// Tworzenie obiektu typu Pulser
var pulser = new Pulser();
// Funkcja obsługi zdarzeń
pulser.on('pulse', () => {
    util.log('Otrzymano zdarzenie pulse');
});
// Rozpoczęcie "pulsowania"
pulser.start();
