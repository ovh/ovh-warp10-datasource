var Editor = function($scope) {
  path = '/public/plugins/grafana-warp10-datasource/';

  System.import(path + 'ace.js').then(() => {

    System.import(path + 'theme-monokai.js').then(() => {

      System.import(path + 'mode-warpscript.js').then(() => {

        System.import(path + 'ext-language_tools.js').then(() => {

          setTimeout(() => {
            var editor = window.ace.edit(document.getElementById($scope.textAreaID));
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/warpscript");
            editor.setOptions({
              enableBasicAutocompletion: true
            });
            editor.$blockScrolling = 'Infinity';
            editor.setValue($scope.val);
            // place holder "query expression"
            // update scope with ace changes
            editor.on('change', (e) => {
              $scope.$apply(() => { 
                $scope.val = editor.getValue();
              });
            });
          }, 3000);
        
          /*codeArea.on('changes', (e) => {
            console.log(e);
            scope.$apply(() => {
              var wscript = e.getValue(); 
              scope.val = wscript;
              $(e.getTextArea()).val(wscript);
            });
          });*/
        });
      });
    });
  });
};