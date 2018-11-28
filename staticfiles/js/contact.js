"use strict"
const contactForm = document.querySelector('#contact-form')
const contactButton = document.querySelector('#contact-button')
const userEmail = document.querySelector('#email1')
const userSubject = document.querySelector('#subject')
const userMessage = document.querySelector('#form-message')
const CSRF_Element = document.getElementsByName('csrfmiddlewaretoken')[0]
const alertContainer = document.querySelector('#alertContainer')
let CSRF_COOKIE
if(CSRF_Element !== undefined) {
	CSRF_COOKIE = CSRF_Element.value
}

let msg = {}
if(contactForm) {
	contactForm.addEventListener('submit', function(e) {
		e.preventDefault()
		contactForm.classList.add('was-validated')

		if(contactForm.checkValidity()) {
			// aqui significa que los campos se validaron correctamente
			msg.email = userEmail.value
			msg.subject = userSubject.value
			msg.message = userMessage.value
			sendMessage(msg)
		}
	})
}


// ###functions###

function sendMessage(obj) {
	//const HOST = 'http://127.0.0.1:8000/contacto/'
	const HEADERS = new Headers({
		'Accept': 'text/json',
		'Content-Type': 'text/json',
		"X-CSRFToken": CSRF_COOKIE
	})
	contactButton.disabled = true
	contactButton.textContent = 'Enviando ...'
	fetch(`${HOST}/contacto/`,{
		method: 'POST',
		credentials: "same-origin",
		headers: HEADERS,
		body: JSON.stringify(obj)
	})
		.then(function (res) {
			if(res.status !== 200) {
				buildAlert("Error al intentar comunicarse con el servidor. " + res.statusText, true)
			}
			res.json().then(function(json){
				if(json.wasSended) {
					buildAlert("Mensaje enviado correctamente", false)
					resetFields()
				} else {
					buildAlert(json.errorMessage, true)
				}
			})

		})
		.catch(function (error) {
			buildMessage("Error inesperado...", true)
		})
}

function buildAlert(msg, isError) {
	alertContainer.innerHTML = ''
	isError = isError || false
	var templateHTML = `<div class="${isError ? 'alert alert-warning' : 'alert alert-success'}" role="alert">
  										<h2 class="m-0">${msg}</h2>
											</div>`
	alertContainer.innerHTML = templateHTML
	contactButton.disabled = false
	contactButton.textContent = 'Enviar'
}

function resetFields() {
	userEmail.value = ''
	userSubject.value = ''
	userMessage.value = ''
	msg = {}
	contactForm.classList.remove('was-validated')
}
