var Editor = function($scope) {
  path = '/public/plugins/grafana-warp10-datasource/';

  System.import(path + 'ace.js').then(() => {

    System.import(path + 'theme-monokai.js').then(() => {

      System.import(path + 'mode-warpscript.js').then(() => {

        System.import(path + 'ext-language_tools.js').then(() => {

          setTimeout(() => {
            // Link to dom
            var editor = window.ace.edit(document.getElementById($scope.textAreaID));
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
            // Fill content
            editor.setValue($scope.val);
            // update scope with ace changes
            editor.on('change', (e) => {
              $scope.$apply(() => { 
                $scope.val = editor.getValue();
              });
            });
          }, 3000);
        });
      });
    });
  });
};