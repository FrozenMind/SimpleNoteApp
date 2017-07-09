// src/electron/electron.js

const {
  app,
  BrowserWindow
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//create http server
var express = require('express')
var server = express()
var cors = require('cors')
var fs = require('fs')
var bodyParser = require('body-parser')

server.use(bodyParser.json()); // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

server.use(cors());
server.get('/api/users', function(req, res) {
  console.log("worked")
  res.json({
    message: 'hooray! welcome to my app!'
  });
});
//http write to file request
server.post('/api/writeFile', (req, res) => {
  //write to file using fs
  console.log(req.body)
  var d = new Date()
  var weirdDate = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "_" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds()
  fs.writeFile(__dirname + "/../notes/" + req.body.title.replace(' ', '') + "_" + weirdDate + ".nt", JSON.stringify(req.body),
    function(err) {
      if (err) {
        res.send({
          successfull: false
        })
        return console.log("Write file ERR: " + err)
      }
      console.log("The file was saved!")
      res.send({
        successfull: true
      })
    })
})

//http get all notes request
server.get('/api/getNotes', (req, res) => {
  var data = []
  console.log("/api/getNotes")
  var url = __dirname + "/../notes"
  //read all filenames
  fs.readdir(url, function(err, files) {
    if (err) return;
    var idCounter = 0
    //files is an array with all filenames
    files.forEach(function(file) {
      //ignore .gitignore --> this file is necessary for now
      //TODO: on app open check if notes folder exist, otherwise create it, so gitignore is not necessary
      if (file != ".gitignore") {
        var fileContent = JSON.parse(fs.readFileSync(url + "/" + file, 'utf8'))
        //send every file
        data.push({
          id: idCounter,
          title: fileContent.title,
          content: fileContent.data
        })
        idCounter++
      }
    })
    res.send(JSON.stringify(data))
  })
})


//start HTTP Server
//http.listen(3000, function() {
//  console.log('HTTP Server listening on Port 52001');
//});
server.listen(3000)
