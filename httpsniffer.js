
var util = require('util');
var url  = require('url');

exports.sniffOn = function(server) {
	// Zgłaszane przy każdym żądaniu.
	// request to obiekt typu http.ServerRequest
	// response to obiekt typu http.ServerResponse
    server.on('request', (req, res) => {
        util.log('request');
        util.log(reqToString(req));
    });

	// Wywoływane po utworzeniu nowego strumienia TCP.
	// stream to obiekt typu net.Stream.
	// Zwykle użytkownicy nie korzystają z tego zdarzenia.
	// Dostęp do strumienia jest też możliwy za pomocą wywołania request.connection.
    // var e_connection = function(stream) {
    // };
    
	// Zgłaszane po zamknięciu serwera
    server.on('close', errno => { util.log('Błąd zamykania='+ errno); });

	// Zgłaszane po otrzymaniu żądania http Expect: 100-continue.
	// Jeśli kod nie obsługuje tego zdarzenia, serwer automatycznie
	// zwróci odpowiedź 100 Continue.
    // Obsługa zdarzenia pole na uruchomieniu wywołania response.writeContinue,
	// jeśli klient powinien przekazać treść żądania,
	// lub wygenerowaniu odpowiedniej odpowiedzi HTTP (np. 400 Bad Request),
	// jeżeli klient nie powinien przesyłać treści żądania.
    server.on('checkContinue', (req, res) => {
        util.log('checkContinue');
        util.log(reqToString(req));
        res.writeContinue();
    });

	// Zgłaszane za każdym razem, gdy klient zażąda aktualizacji.
	// Jeśli kod nie obsługuje tego zdarzenia, połączenia klientów
	// żądających aktualizacji zostaną zamknięte.
    server.on('upgrade', (req, socket, head) => {
        util.log('upgrade');
        util.log(reqToString(req));
    });

	// Jeśli połączenie z klientem zgłasza zdarzenie 'error', to zdarzenie jest przekazywane tutaj.
    server.on('clientError', () => { util.log('clientError'); });

    // server.on('connection',    e_connection);
};

var reqToString = exports.reqToString = function(req) {
    var ret = `request ${req.method} ${req.httpVersion} ${req.url}` +'\n';
    ret += JSON.stringify(url.parse(req.url, true)) +'\n';
    var keys = Object.keys(req.headers);
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        ret += `${i} ${key}: ${req.headers[key]}` +'\n';
    }
    if (req.trailers)
        ret += req.trailers +'\n';
    return ret;
};

