<!DOCTYPE html>
<html>
    <head>
        <title>Anteckna</title>
        <link href="https://fonts.googleapis.com/css?family=Lato:100,300,400" rel="stylesheet" type="text/css">
        <link href='https://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="css/app.css">
    </head>
    <body id="app">
        <div class="container-fluid">
            <div class="row">
                <div class="title">Anteckna</div>
                <div class="name"><input type="text" v-model="documentName"></div>
                <div class="buttons">
                    <button class="btn btn-default save" v-on:click="showLibrary = !showLibrary">Library</button>
                    <button class="btn btn-primary save" v-on:click="save">Save</button>
                </div>

            </div>
            <div class="full-height">
                <div class="library" v-show="!showLibrary" transition="expand">

                    <div class="cards">

                        <div class="card col-md-1">
                            <div class="card-block">
                                <h4 class="card-title">Card title</h4>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Created at: </li>
                            </ul>
                            <div class="card-block">
                                <a href="#" class="card-link">Load</a>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="editor">
                    <!--<div v-content-editable="editor"></div>-->
                    <textarea v-model="document"></textarea>
                </div>
                <div class="viewer">
                    <div>@{{{ markdown }}}</div>
                </div>
            </div>

        </div>
    </body>

    <script src="js/main.js"></script>
</html>
