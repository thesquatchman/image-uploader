let dropArea = document.getElementById('drop-area')

  // dropArea.addEventListener('dragenter', handlerFunction, false) //The dragged item is dragged over dropArea, making it the target for the drop event if the user drops it there.
  // dropArea.addEventListener('dragleave', handlerFunction, false) //The dragged item is dragged off of dropArea and onto another element, making it the target for the drop event instead.
  // dropArea.addEventListener('dragover', handlerFunction, false) //Every few hundred milliseconds, while the dragged item is over dropArea and is moving.
  // dropArea.addEventListener('drop', handlerFunction, false) //The user releases their mouse button, dropping the dragged item onto dropArea.


;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}


;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  files = [...files]
  initializeProgress(files.length)
  files.forEach(uploadFile)
  files.forEach(previewFile)
}

// function uploadFile(file) {
//   let url = 'YOUR URL HERE'
//   let formData = new FormData()

//   formData.append('file', file)

//   fetch(url, {
//     method: 'POST',
//     body: formData //built-in browser API for creating form data to send to the server.
//   })
//   .then(progressDone)
//   .catch(() => { /* Error. Inform the user */ })
// }

function uploadFile(file, i) { // <- Add i parameter
	//npm install -g upload-test-server
	//upload-test-server start
  var url = 'http://localhost:8989/upload'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)

  // Add following event listener
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Done. Inform the user
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  formData.append('file', file)
  xhr.send(formData)
}



function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img')
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}


let filesDone = 0
let filesToDo = 0
let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

function initializeProgress(numFiles) {
  progressBar.value = 0
  uploadProgress = []

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  progressBar.value = total
}


