var Editor = function(scope) {
  System.import('/public/plugins/grafana-warp10-datasource/codemirror.js').then(
  (CodeMirror) => {
    
    System.import('/public/plugins/grafana-warp10-datasource/codemirror-simple.js').then(
    (simple) => {
      simple(CodeMirror);

      CodeMirror.defineSimpleMode('warpscript', {
        // The start state contains the rules that are intially used
        start: [{
            regex: /\/\/.*/,
            token: "comment"
          }, {
            regex: /'[^']*'/,
            token: "string.quoted.single" // '' string
          }, {
            regex: /"[^"]*"/,
            token: "string.quoted.double" // "" string
          }, {
            regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
            token: "number"
          }, {
            token: "support.variable",
            regex: /\@[a-zA-Z0-9_$]*\b/
          }, {
            regex: /(?:NULL|NaN|E|e|PI|pi|NOW|MAXLONG|MINLONG|TRUE|true|FALSE|false)\b/,
            token: "constant.language"
          }, {
            regex: /(?:ASSERT|BREAK|FAIL|FOR|FOREACH|FORSTEP|IFT|IFTE|RETURN|UNTIL|WHILE)\b/,
            token: "keyword.control"
          }, {
            regex: /(?:bucketizer\.count|bucketizer\.count\.exclude-nulls|bucketizer\.count\.include-nulls|bucketizer\.count\.nonnull|bucketizer\.first|bucketizer\.join|bucketizer\.join\.forbid-nulls|bucketizer\.last|bucketizer\.max|bucketizer\.max\.forbid-nulls|bucketizer\.mean|bucketizer\.mean\.exclude-nulls|bucketizer\.median|bucketizer\.min|bucketizer\.min\.forbid-nulls|bucketizer\.percentile|bucketizer\.sum|bucketizer\.sum\.forbid-nulls|filter\.byclass|filter|\.bylabels|filter\.last\.eq|filter\.last\.ge|filter\.last\.gt|filter\.last\.le|filter\.last\.lt|filter\.last\.ne|mapper\.abs|mapper\.add|mapper\.ceil|mapper\.count|mapper\.count\.exclude-nulls|mapper\.count\.include-nulls|mapper\.count\.nonnull|mapper\.day|mapper\.delta|mapper\.dotproduct|mapper\.dotproduct\.positive|mapper\.dotproduct\.sigmoid|mapper\.dotproduct\.tanh|mapper\.eq|mapper\.exp|mapper\.first|mapper\.floor|mapper\.ge|mapper\.geo\.approximate|mapper\.geo\.clear|mapper\.geo\.outside|mapper\.geo\.within|mapper\.gt|mapper\.hdist|mapper\.highest|mapper\.hour|mapper\.hspeed|mapper\.join|mapper\.join\.forbid-nulls|mapper\.kernel\.cosine|mapper\.kernel\.epanechnikov|mapper\.kernel\.gaussian|mapper\.kernel\.logistic|mapper\.kernel\.quartic|mapper\.kernel\.silverman|mapper\.kernel\.triangular|mapper\.kernel\.tricube|mapper\.kernel\.triweight|mapper\.kernel\.uniform|mapper\.last|mapper\.le|mapper\.log|mapper\.lowest|mapper\.lt|mapper\.max|mapper\.max\.forbid-nulls|mapper\.max\.x|mapper\.mean|mapper\.mean\.exclude-nulls|mapper\.median|mapper\.min|mapper\.min\.forbid-nulls|mapper\.min\.x|mapper\.minute|mapper\.month|mapper\.mul|mapper\.ne|mapper\.npdf|mapper\.percentile|mapper\.pow|mapper\.product|mapper\.rate|mapper\.replace|mapper\.round|mapper\.sd|mapper\.sd\.forbid-nulls|mapper\.second|mapper\.sigmoid|mapper\.sum|mapper\.sum\.forbid-nulls|mapper\.tanh|mapper\.tick|mapper\.toboolean|mapper\.todouble|mapper\.tolong|mapper\.tostring|mapper\.truecourse|mapper\.var|mapper\.var\.forbid-nulls|mapper\.vdist|mapper\.vspeed|mapper\.weekday|mapper\.year|max\.tick\.sliding\.window|max\.time\.sliding\.window|op\.add|op\.and|op\.div|op\.eq|op\.ge|op\.gt|op\.le|op\.lt|op\.mask|op\.mul|op\.ne|op\.or|op\.sub|reducer\.argmax|reducer\.argmin|reducer\.count|reducer\.count\.exclude-nulls|reducer\.count\.include-nulls|reducer\.count\.nonnull|reducer\.join|reducer\.join\.forbid-nulls|reducer\.join\.nonnull|reducer\.max|reducer\.max\.forbid-nulls|reducer\.max\.nonnull|reducer\.mean|reducer\.mean\.exclude-nulls|reducer\.median|reducer\.min|reducer\.min\.forbid-nulls|reducer\.min\.nonnull|reducer\.percentile|reducer\.product|reducer\.sd|reducer\.sd\.forbid-nulls|reducer\.shannonentropy\.0|reducer\.shannonentropy\.1|reducer\.sum|reducer\.sum\.forbid-nulls|reducer\.sum\.nonnull|reducer\.var|reducer\.var\.forbid-nulls)\b/,
            token: "keyword.other"
          }, {
            regex: /(?:\-\>B64|\-\>B64URL|\-\>HEX|\-\>JSON|\-\>LIST|\-\>MAP|\-\>Q|\-\>SET|ABS|ACOS|ADDVALUE|AND|APPEND|APPLY|ASIN|ATAN|ATBUCKET|ATINDEX|ATTICK|ATTRIBUTES|AUTHENTICATE|B64\-\>|B64URL\-\>|BUCKETCOUNT|BUCKETIZE|BUCKETSPAN|CBRT|CEIL|CHUNK|CLEAR|CLEARTOMARK|CLONE|CLONEEMPTY|CLONEREVERSE|COMMONTICKS|COMPACT|CONTAINS|CONTAINSKEY|CONTAINSVALUE|CONTINUE|COPYGEO|COPYSIGN|CORRELATE|COS|COSH|COUNTTOMARK|CROP|CSTORE|CUDF|DEBUGOFF|DEBUGON|DEDUP|DEF|DEFINED|DEPTH|DIFFERENCE|DISCORDS|DOC|DOCMODE|DOUBLEEXPONENTIALSMOOTHING|DROP|DROPN|DTW|DUP|DUPN|DURATION|DWTSPLIT|ELAPSED|ELEVATIONS|ESDTEST|EVAL|EVALSECURE|EVERY|EXP|EXPM1|FDWT|FETCH|FFT|FFTAP|FILLNEXT|FILLPREVIOUS|FILLTICKS|FILLVALUE|FILTER|FIND|FINDSETS|FINDSTATS|FIRSTTICK|FLATTEN|FLOOR|FORGET|FROMBITS|FROMHEX|FUSE|GEO\.INTERSECTS|GEO\.WITHIN|GEO_INTERSECTION|GEO_SUBTRACTION|GEO_UNION|GEO_WKT|GET|GROOVY|GRUBBSTEST|HASH|HAVERSINE|HEX\-\>|HUMANDURATION|HYBRIDTEST|HYBRIDTEST2|HYPOT|IDENT|IDWT|IEEEREMAINDER|IFFT|INTEGRATE|INTERPOLATE|INTERSECTION|ISNULL|ISNaN|ISO8601|ISODURATION|ISONORMALIZE|JOIN|JS|JSON\-\>|JSONLOOSE|JSONSTRICT|KEYLIST|LABELS|LASTBUCKET|LASTSORT|LASTTICK|LBOUNDS|LFLATMAP|LIMIT|LIST\-\>|LMAP|LOAD|LOCATIONOFFSET|LOCATIONS|LOCSTRINGS|LOG|LOG10|LOG1P|LOWESS|LSORT|LUA|MACROBUCKETIZER|MACROFILTER|MACROMAPPER|MACROREDUCER|MAKEGTS|MAP\-\>|MAP|MAPID|MARK|MATCH|MAX|MAXBUCKETS|MAXDEPTH|MAXGTS|MAXOPS|MAXSYMBOLS|MERGE|META|METASORT|MIN|MONOTONIC|MSGFAIL|MSORT|MSTU|MUSIGMA|NAME|NBOUNDS|NDEBUGON|NEWGTS|NEXTAFTER|NEXTUP|NONEMPTY|NOOP|NORMALIZE|NOT|NOTAFTER|NOTBEFORE|NOTIMINGS|NOW|NPDF|NRETURN|NSUMSUMSQ|ONLYBUCKETS|OPS|OR|PAPPLY|PARSESELECTOR|PARTITION|PATTERNDETECTION|PATTERNS|PFILTER|PICK|PROBABILITY|PUT|PYTHON|Q\-\>|QCONJUGATE|QDIVIDE|QMULTIPLY|QROTATE|QROTATION|QUANTIZE|R|R\-\>|RAND|RANGE|RANGECOMPACT|REDUCE|RELABEL|REMOVE|RENAME|RESET|RESETS|REV|REVERSE|RINT|RLOWESS|ROLL|ROLLD|ROT|ROTATIONQ|ROUND|RSORT|RUBY|RUN|RVALUESORT|SECUREKEY|SET|SET\-\>|SETATTRIBUTES|SHRINK|SIGNUM|SIN|SINGLEEXPONENTIALSMOOTHING|SINH|SIZE|SORT|SPLIT|SQRT|STACKATTRIBUTE|STANDARDIZE|STL|STLESDTEST|STOP|STORE|STRICTMAPPER|STRICTPARTITION|STU|SUBLIST|SUBMAP|SUBSTRING|SWAP|SWITCH|TAN|TANH|TEMPLATE|THRESHOLDTEST|TICKINDEX|TICKLIST|TIMECLIP|TIMEMODULO|TIMESCALE|TIMESHIFT|TIMESPLIT|TIMINGS|TOBITS|TODEGREES|TODOUBLE|TOHEX|TOKENINFO|TOLONG|TOLOWER|TORADIANS|TOSELECTOR|TOSTRING|TOTIMESTAMP|TOUPPER|TRIM|TSELEMENTS|TYPEOF|UDF|ULP|UNBUCKETIZE|UNION|UNIQUE|UNSECURE|UNWRAP|UPDATE|URLDECODE|URLENCODE|UUID|VALUEDEDUP|VALUEHISTOGRAM|VALUELIST|VALUES|VALUESORT|VALUESPLIT|WEBCALL|WRAP|ZIP|ZSCORE|ZSCORETEST)\b/,
            token: "support.function"
          }, {
            token: "paren.lparen",
            regex: /[\[\{]/
          }, {
            token: "paren.rparen",
            regex: /[\]\}]/
          }, {
            token: "keyword.operator",
            regex: /!=|!|%|&|&&|\*|\*\*|\+|\-|\/|<|<=|==|>|>=|\[|\]|\[\]|\^|\{\}|\{|\}|\||\|\||~=/
          }, {
            token: "text",
            regex: /\s+/
          },

          // indent and dedent properties guide autoindentation
          {
            regex: /[\{\[\(]/,
            indent: true
          }, {
            regex: /[\}\]\)]/,
            dedent: true
          },
        ],
        meta: {
          dontIndentStates: ["comment"],
          lineComment: "//"
        }
      });      

      function plugEditor() {

        var codeAreas = $('.editor');
        var editorsID = [];

        for (var textArea of codeAreas) {
          if ($(textArea).attr('id') == null) {
            let id = Math.trunc(Math.random() * 1000); 
            $(textArea).attr('id', id);
          }
          editorsID.push('#' + $(textArea).attr('id'));
          console.log('id', $(textArea).attr('id'));
        }

        for (var textArea of editorsID) {
          
          // if next is not div.CodeMirror
          console.log($(textArea));
          if (($(textArea)).next("div.CodeMirror").length == 0) {

            // CodeMirror need a real element
            let codeArea = CodeMirror.fromTextArea($(textArea)[0], {
              lineNumbers: true,
              matchBrackets: true,
              viewportMargin: Infinity,
              mode: 'warpscript',
              theme: 'monokai'
            });

            codeArea.errLine = function (l) {
              if (!l) {
                return;
              }

              codeArea.markText({
                line: l - 1,
                ch: 0
              }, {
                line: l - 1,
                ch: codeArea.getLine(l - 1).length
              }, {
                css: "background: #EF9A9A",
                clearOnEnter: true
              });
            }
            codeArea.on('changes', (e) => {
              console.log(e);
              scope.$apply(() => {
                var wscript = e.getValue(); 
                scope.val = wscript;
                $(e.getTextArea()).val(wscript);
              });
            })
          }
        }
      }
      plugEditor()

      $("button[ng-click='ctrl.addDataQuery()']").on('click', function() {
        setTimeout(function() {
          plugEditor()
        }, 800); 
      });
    });
  });
}