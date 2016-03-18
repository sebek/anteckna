<!DOCTYPE html>
<html>
    <head>
        <title>Anteckna</title>
        <link href="https://fonts.googleapis.com/css?family=Lato:100,300,400" rel="stylesheet" type="text/css">
        <link href='https://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="css/app.css">
        <script src="http://localhost:7575/socket.io/socket.io.js"></script>
    </head>
    <body id="app">
        <div class="container-fluid">
            <div class="row">
                <div class="title">Anteckna</div>
                <div class="name"><input type="text" v-model="documentName"></div>
                <div class="buttons">
                    <button class="btn btn-primary-outline" v-on:click="showLibrary = !showLibrary">Library</button>
                    <button class="btn btn-success-outline" v-on:click="editMode = true" v-show="!editMode">Edit</button>
                    <button class="btn btn-success-outline" v-on:click="editMode = false" v-show="editMode">Close editor</button>
                    <button class="btn btn-primary save" v-on:click="save" v-show="editMode">Save</button>
                </div>

            </div>
            <div class="full-height">
                <div class="library" v-show="showLibrary" transition="expand">

                    <div class="cards">

                        <div class="card" v-for="document in documents">
                            <div class="card-block">
                                <h5 class="card-title">[[ document.name ]]</h5>
                                <a href="#" class="card-link btn btn-primary-outline" v-on:click="loadDocument(document);">Load</a>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="editor col-md-6" v-show="editMode" transition="expand">
                    <div contenteditable="true" v-on:keydown="keyPressed" id="editor"></div>
                </div>
                <div class="viewer col-md-6" v-bind:class="{'col-md-12': !editMode}">
                    <div>@{{{ markdown }}}</div>
                </div>
            </div>

        </div>
    </body>

    <script src="js/main.js"></script>
</html>
