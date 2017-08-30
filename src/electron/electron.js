//src/electron/electron.js

const {
  app,
  BrowserWindow
} = require('electron')

var express = require('express')
var server = express()
var cors = require('cors')
var fs = require('fs')
var bodyParser = require('body-parser')

const notesPath = __dirname + "/../notes.json" //njson file location

//Keep a global reference of the window object, if you don't, the window will
//be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  //Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, //remove frames, menu bar, etc.
    webPreferences: {
      experimentalFeatures: true, //enable to use display grid
    }
  })

  //load the index.html of the app.
  console.log(__dirname)
  //  win.loadURL(`file://${__dirname}/../../dist/index.html`) //build path
  win.loadURL(`file://${__dirname}/index.html`) //test path

  //Open the DevTools with next line (can be done always by pressing ctrl+alt+i)
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    //Dereference the window object, usually you would store windows
    //in an array if your app supports multi windows, this is the time
    //when you should delete the corresponding element.
    win = null
  })
  //check if notes.json exist, otherwise create it
  if (!fs.existsSync(notesPath)) {
    fs.closeSync(fs.openSync(notesPath, 'a')) //a only creates file if it does not exist
  }

  console.log("electron app loaded")
}

//This method will be called when Electron has finished
//initialization and is ready to create browser windows.
//Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})


//all the http server stuff TODO new file pls
var notes = [];

server.use(bodyParser.json()); // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

server.use(cors());
//http request definitions
server.get('/api/users', function(req, res) { //test stuff TODO check if it can deleted safe
  console.log("worked")
  res.json({
    message: 'hooray! welcome to my app!'
  });
});
//http write to file request
server.post('/api/saveNote', (req, res) => {
  //write to file using fs
  console.log(req.body)
  var d = new Date()
  var fullDate = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + "_" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
  var newNote
  if (req.body.id == -1) { //-1 = new note
    newNote = {
      id: notes.length,
      title: req.body.title,
      content: req.body.content
    }
    notes.push(newNote)
  } else {
    //TODO what happens if id doesnt exist?
    for (i = 0; i < notes.length; i++) {
      if (notes[i].id == req.body.id) {
        notes[i].title = req.body.title
        notes[i].content = req.body.content
      }
    }
  }
  //create new ids, so no numbers are duplicated or lost
  for (i = 0; i < notes.length; i++) {
    notes[i].id = i
  }
  //write notes to file
  fs.writeFile(notesPath, JSON.stringify(notes),
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

//http get (all) note(s) request
server.get('/api/getNotes/:id?', (req, res) => {
  console.log("/api/getNotes")
  var requiredId = req.params.id || -100 //-100 --> getAllNotes
  console.log(requiredId == -1 ? "New Note" : "ID " + requiredId + " requested")
  if (requiredId < 0) return //id shouldnt be less than 0
  var fileRes = fs.readFileSync(notesPath, 'utf8')
  if (fileRes && fileRes != "") //if file has a content parse it
    notes = JSON.parse(fileRes)
  else //else return err TODO: return error
    return
  if (requiredId == -100) {
    res.send(JSON.stringify(notes))
  } else {
    //search for the note and return it to the client
    for (i = 0; i < notes.length; i++) {
      if (notes[i].id == requiredId) {
        res.send(JSON.stringify(notes[i]))
        return;
      }
    }
  }
})

//delete one note
server.delete('/api/deleteNote/:id', function(req, res) {
  var requiredId = req.params.id
  //search for id and delete it
  //TODO if not found reorder the ids because something is wrong on the client side
  for (i = notes.length - 1; i >= 0; i--) {
    if (notes[i].id == requiredId)
      notes.splice(i, 1)
  }
  //save changes to file and send client response if it worked
  fs.writeFile(notesPath, JSON.stringify(notes),
    function(err) {
      if (err) {
        res.send({
          successfull: false
        })
        return console.log("Note delete ERR: " + err)
      }
      console.log("The note was deleted!")
      res.send({
        successfull: true
      })
    })
})

//start HTTP Server
server.listen(3000)
