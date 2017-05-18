/**
 * Extensions files like ext-language-tools / mode-warpscript / theme-monikai
 * need to prefix their define function with ace :
 * ace.define();
 */

export function Editor(ctrl) {
  var path = '/public/plugins/grafana-warp10-datasource/';

  System.import(path + 'ace.js').then(() => {

    System.import(path + 'ext-language_tools.js').then(() => {

      System.import(path + 'mode-warpscript.js').then(() => {

        System.import(path + 'theme-monokai.js').then(() => {

          // force render query directive
          ctrl.scope.$apply();
          setTimeout(() => {
            var el = document.getElementById(ctrl.textAreaID);
            console.log(el);

            console.log("try to link");
            // Link to dom
            var editor = window.ace.edit(el);
            // Theme
            editor.setTheme("ace/theme/monokai");
            // Warpscript language
            editor.getSession().setMode("ace/mode/warpscript");
            // Autocompletion
            editor.setOptions({
              enableBasicAutocompletion: true
            });
            // Resizable
            editor.$blockScrolling = Infinity;
            editor.setAutoScrollEditorIntoView(true);

            editor.resize(true);

            // Fill content
            editor.setValue(ctrl.target.expr);

            editor.on('change', (ev) => {
              console.log("change", ev);
              ctrl.target.expr = editor.getValue();
            });
          }, 0);
        });
      });
    });
  });
};