var Vue = require('vue');
var Marked = require('marked');

/** Use Vue Resource **/
Vue.use(require('vue-resource'));

/** Set Vue debug mode **/
Vue.config.debug = true;

/** Set Vue to use [[ & ]] as not to mess up Blade **/
Vue.config.delimiters = ['[[', ']]'];

/** Configure Marked **/
Marked.setOptions({
    renderer: new Marked.Renderer(),
    gfm: true
});

/** Socket IO **/
var socket = io('http://localhost:7575');

new Vue({

    el: '#app',

    data: {
        documentId: false,
        documentName: "Untitled",
        document: "",
        documents: null,
        shouldSave: false,
        isSaving: false,
        showLibrary: false,
        documentResource: false,
        editMode: false
    },

    computed: {
        markdown() {
            return Marked(this.document);
        }
    },

    watch: {
        document: function(newVal, oldVal) {
            this.shouldSave = true;
        }
    },

    methods: {

        loadDocuments() {
            this.documentResource.get().then((response) => {
                this.documents = response.data.documents;
            })
        },

        loadDocument(document) {
            this.documentId = document.id;
            this.documentName = document.name;
            this.document = document.markdown;
            this.showLibrary = false;

            socket.emit('loaded.document', { id: document.id });
        },

        insertCharacter(character, atPosition, toPosition) {
            this.document = [this.document.slice(0, atPosition), character, this.document.slice(toPosition)].join('');
        },

        removeCharacter(atPosition, toPosition) {

            if (atPosition != toPosition) {
                atPosition++;
            }

            this.document = this.document.substr(0, (atPosition - 1)) + this.document.substr(toPosition);
        },

        keyPressed(key) {

            console.log("Key pressed")

            var positionStart = key.target.selectionStart;
            var positionEnd = key.target.selectionEnd;
            var length = (positionEnd - positionStart);

            var commandKeys = [
                'Escape',
                'PageUp',
                'PageDown',
                'Home',
                'End',
                'Insert',
                'Delete',
                'Backspace',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'ShiftLeft',
                'ShiftRight',
                'OSLeft',
                'OSRight',
                'ControlLeft',
                'ControlRight',
                'AltLeft',
                'AltRight',
                'Enter',
                'NumpadEnter'
            ];

            if (commandKeys.indexOf(key.code) >= 0) {

                console.log("Command", key.code, positionStart, positionEnd);

                if (key.code == "Backspace") {
                    socket.emit('command', { command: 'remove', atPosition: positionStart, toPosition: positionEnd});
                }

                if (key.code == "Delete") {
                    if (positionStart == positionEnd) {
                        positionStart++;
                        positionEnd++;
                    }
                    socket.emit('command', { command: 'remove', atPosition: positionStart, toPosition: positionEnd });
                }

                if (key.code == "Enter") {
                    socket.emit('command', { command: 'insert', character: '\n', atPosition: positionStart, toPosition: positionEnd });
                }


            } else {
                
                setTimeout(() => {
                    var character = key.target.value.substr(positionStart, 1);
                    socket.emit('command', { command: 'insert', character: character, atPosition: positionStart, toPosition: positionEnd});
                });


            }
        },

        save() {

            // We're not saving nothing
            if (!this.document.length) {
                return;
            }

            // Updating
            if (this.documentId) {
                this.documentResource.update({id: this.documentId}, {name: this.documentName, markdown: this.document}).then((response) => {

                }, (response) => {
                    console.log("error", response)
                });

            // Creating
            } else {
                this.documentResource.save({}, {name: this.documentName, markdown: this.document}).then((response) =>  {
                    this.documentId = response.data.id
                }, (response) => {
                    console.log("error", response)
                });
            }
        },

        autoSave() {
            setTimeout(() => {
                if (this.shouldSave == true) {
                    this.shouldSave = false;
                }
                this.autoSave();
            }, 500);
        },

        handleCommand(data) {
            if (data.command == "insert") {
                this.insertCharacter(data.character, data.atPosition, data.toPosition);
            }

            if (data.command == "remove") {
                this.removeCharacter(data.atPosition, data.toPosition);
            }
        }

    },

    ready() {
        this.documentResource = this.$resource('documents{/id}');
        this.autoSave();
        this.loadDocuments();

        socket.on('command', (data) => {
            this.handleCommand(data);
        });

        socket.on('commands', (commands) => {
             for (var data of commands) {
                 this.handleCommand(data);
             }
        });

    }

});