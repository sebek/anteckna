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

new Vue({

    el: '#app',

    data: {
        documentId: false,
        documentName: "Untitled",
        document: "",
        shouldSave: false,
        isSaving: false,
        showLibrary: false,
        documentResource: false
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
                    console.log("Sparar");
                    this.shouldSave = false;
                }
                this.autoSave();
            }, 500);
        }

    },

    ready() {
        this.documentResourc = this.$resource('documents{/id}');
        this.autoSave();
    }

});