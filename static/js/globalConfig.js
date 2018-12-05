'use strict';
var HOST_DEV = 'http://127.0.0.1:8000'
var HOST_PRODUC = 'https://www.tigrecitosunchales.com'
var HOST;

// poner en false si se pone en producción.
const DEV_MODE = true

if(DEV_MODE) {
	HOST = HOST_DEV
} else {
	HOST = HOST_PRODUC
}
