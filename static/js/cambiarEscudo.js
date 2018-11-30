"use strict";

var vmEscudos = new Vue({
    el: '#appChangeShield',
	delimiters: ["[%", "%]"],
    data: {
        clubs: [],
        isSearching: true,
        error: null,
        selectedFile: null,
        upload: {
            isUploading: false,
            percentage: 0,
            isUploadingToDjango: false
        }
    },
    methods: {
        fetchAllClubs: function() {
            this.isSearching = true
            axios.get(`${HOST}/api/clubes?format=json`)
				.then(res => {
                    //TODO: Ordenar alfabeticamente
					this.clubs = res.data.clubes
                    this.isSearching = false
				})
				.catch(err => {
					console.eror(err)
                    this.error = err
                    this.isSearching = false
				})
        },
        onCloseAlertError: function() {
            this.error = null
        },
        onUploadImageToFirebase: function(equipo, event) {
            this.upload.percentage = 0
            this.isUploadingToDjango = false

            //upload image to firebase
            let storageRef = firebase.storage().ref(`shield/${equipo.id}/${this.selectedFile.name}`)
            console.log(storageRef.fullPath)
            var uploadTask = storageRef.put(this.selectedFile)
            this.upload.isUploading = true
            //update progress
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                function(snapshot) {
                    this.upload.percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('va: ' + this.upload.percentage + '%')
                },
                function(err) {
                    this.error = err
                    this.upload.isUploading = false
                },
                function() {
                    this.upload.isUploading = false
                }
            )
            //upload to django server
        },
        onChangeInputFile: function(event) {
            this.selectedFile = event.target.files[0]
            console.log(this.selectedFile)
        }
    }
})

vmEscudos.fetchAllClubs()
