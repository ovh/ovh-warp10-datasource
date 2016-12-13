ace.define ("ace/mode/warpscript_keywords", function(require, exports, module) {
"use strict";

  var warpscriptFunctions = "\-\>B64|\-\>B64URL|\-\>HEX|\-\>JSON|\-\>LIST|\-\>MAP|\-\>Q|\-\>SET|ABS|ACOS|ADDVALUE|AND|APPEND|APPLY|ASIN|ATAN|ATBUCKET|ATINDEX|ATTICK|ATTRIBUTES|AUTHENTICATE|B64\-\>|B64URL\-\>|BUCKETCOUNT|BUCKETIZE|BUCKETSPAN|CBRT|CEIL|CHUNK|CLEAR|CLEARTOMARK|CLONE|CLONEEMPTY|CLONEREVERSE|COMMONTICKS|COMPACT|CONTAINS|CONTAINSKEY|CONTAINSVALUE|CONTINUE|COPYGEO|COPYSIGN|CORRELATE|COS|COSH|COUNTTOMARK|CROP|CSTORE|CUDF|DEBUGOFF|DEBUGON|DEDUP|DEF|DEFINED|DEPTH|DIFFERENCE|DISCORDS|DOC|DOCMODE|DOUBLEEXPONENTIALSMOOTHING|DROP|DROPN|DTW|DUP|DUPN|DURATION|DWTSPLIT|ELAPSED|ELEVATIONS|ESDTEST|EVAL|EVALSECURE|EVERY|EXP|EXPM1|FDWT|FETCH|FFT|FFTAP|FILLNEXT|FILLPREVIOUS|FILLTICKS|FILLVALUE|FILTER|FIND|FINDSETS|FINDSTATS|FIRSTTICK|FLATTEN|FLOOR|FORGET|FROMBITS|FROMHEX|FUSE|GEO\.INTERSECTS|GEO\.WITHIN|GEO_INTERSECTION|GEO_SUBTRACTION|GEO_UNION|GEO_WKT|GET|GROOVY|GRUBBSTEST|HASH|HAVERSINE|HEX\-\>|HUMANDURATION|HYBRIDTEST|HYBRIDTEST2|HYPOT|IDENT|IDWT|IEEEREMAINDER|IFFT|INTEGRATE|INTERPOLATE|INTERSECTION|ISNULL|ISNaN|ISO8601|ISODURATION|ISONORMALIZE|JOIN|JS|JSON\-\>|JSONLOOSE|JSONSTRICT|KEYLIST|LABELS|LASTBUCKET|LASTSORT|LASTTICK|LBOUNDS|LFLATMAP|LIMIT|LIST\-\>|LMAP|LOAD|LOCATIONOFFSET|LOCATIONS|LOCSTRINGS|LOG|LOG10|LOG1P|LOWESS|LSORT|LUA|MACROBUCKETIZER|MACROFILTER|MACROMAPPER|MACROREDUCER|MAKEGTS|MAP\-\>|MAP|MAPID|MARK|MATCH|MAX|MAXBUCKETS|MAXDEPTH|MAXGTS|MAXOPS|MAXSYMBOLS|MERGE|META|METASORT|MIN|MONOTONIC|MSGFAIL|MSORT|MSTU|MUSIGMA|NAME|NBOUNDS|NDEBUGON|NEWGTS|NEXTAFTER|NEXTUP|NONEMPTY|NOOP|NORMALIZE|NOT|NOTAFTER|NOTBEFORE|NOTIMINGS|NOW|NPDF|NRETURN|NSUMSUMSQ|ONLYBUCKETS|OPS|OR|PAPPLY|PARSESELECTOR|PARTITION|PATTERNDETECTION|PATTERNS|PFILTER|PICK|PROBABILITY|PUT|PYTHON|Q\-\>|QCONJUGATE|QDIVIDE|QMULTIPLY|QROTATE|QROTATION|QUANTIZE|R|R\-\>|RAND|RANGE|RANGECOMPACT|REDUCE|RELABEL|REMOVE|RENAME|RESET|RESETS|REV|REVERSE|RINT|RLOWESS|ROLL|ROLLD|ROT|ROTATIONQ|ROUND|RSORT|RUBY|RUN|RVALUESORT|SECUREKEY|SET|SET\-\>|SETATTRIBUTES|SHRINK|SIGNUM|SIN|SINGLEEXPONENTIALSMOOTHING|SINH|SIZE|SORT|SPLIT|SQRT|STACKATTRIBUTE|STANDARDIZE|STL|STLESDTEST|STOP|STORE|STRICTMAPPER|STRICTPARTITION|STU|SUBLIST|SUBMAP|SUBSTRING|SWAP|SWITCH|TAN|TANH|TEMPLATE|THRESHOLDTEST|TICKINDEX|TICKLIST|TIMECLIP|TIMEMODULO|TIMESCALE|TIMESHIFT|TIMESPLIT|TIMINGS|TOBITS|TODEGREES|TODOUBLE|TOHEX|TOKENINFO|TOLONG|TOLOWER|TORADIANS|TOSELECTOR|TOSTRING|TOTIMESTAMP|TOUPPER|TRIM|TSELEMENTS|TYPEOF|UDF|ULP|UNBUCKETIZE|UNION|UNIQUE|UNSECURE|UNWRAP|UPDATE|URLDECODE|URLENCODE|UUID|VALUEDEDUP|VALUEHISTOGRAM|VALUELIST|VALUES|VALUESORT|VALUESPLIT|WEBCALL|WRAP|ZIP|ZSCORE|ZSCORETEST";

  var warpscriptControl = "ASSERT|BREAK|FAIL|FOR|FOREACH|FORSTEP|IFT|IFTE|RETURN|UNTIL|WHILE";


  var warpscriptConstants = "NULL|NaN|E|e|PI|pi|NOW|MAXLONG|MINLONG|TRUE|true|FALSE|false";
  var warpscriptFrameworkFunctions = "bucketizer\.count|bucketizer\.count\.exclude-nulls|bucketizer\.count\.include-nulls|bucketizer\.count\.nonnull|bucketizer\.first|bucketizer\.join|bucketizer\.join\.forbid-nulls|bucketizer\.last|bucketizer\.max|bucketizer\.max\.forbid-nulls|bucketizer\.mean|bucketizer\.mean\.exclude-nulls|bucketizer\.median|bucketizer\.min|bucketizer\.min\.forbid-nulls|bucketizer\.percentile|bucketizer\.sum|bucketizer\.sum\.forbid-nulls|filter\.byclass|filter|\.bylabels|filter\.last\.eq|filter\.last\.ge|filter\.last\.gt|filter\.last\.le|filter\.last\.lt|filter\.last\.ne|mapper\.abs|mapper\.add|mapper\.ceil|mapper\.count|mapper\.count\.exclude-nulls|mapper\.count\.include-nulls|mapper\.count\.nonnull|mapper\.day|mapper\.delta|mapper\.dotproduct|mapper\.dotproduct\.positive|mapper\.dotproduct\.sigmoid|mapper\.dotproduct\.tanh|mapper\.eq|mapper\.exp|mapper\.first|mapper\.floor|mapper\.ge|mapper\.geo\.approximate|mapper\.geo\.clear|mapper\.geo\.outside|mapper\.geo\.within|mapper\.gt|mapper\.hdist|mapper\.highest|mapper\.hour|mapper\.hspeed|mapper\.join|mapper\.join\.forbid-nulls|mapper\.kernel\.cosine|mapper\.kernel\.epanechnikov|mapper\.kernel\.gaussian|mapper\.kernel\.logistic|mapper\.kernel\.quartic|mapper\.kernel\.silverman|mapper\.kernel\.triangular|mapper\.kernel\.tricube|mapper\.kernel\.triweight|mapper\.kernel\.uniform|mapper\.last|mapper\.le|mapper\.log|mapper\.lowest|mapper\.lt|mapper\.max|mapper\.max\.forbid-nulls|mapper\.max\.x|mapper\.mean|mapper\.mean\.exclude-nulls|mapper\.median|mapper\.min|mapper\.min\.forbid-nulls|mapper\.min\.x|mapper\.minute|mapper\.month|mapper\.mul|mapper\.ne|mapper\.npdf|mapper\.percentile|mapper\.pow|mapper\.product|mapper\.rate|mapper\.replace|mapper\.round|mapper\.sd|mapper\.sd\.forbid-nulls|mapper\.second|mapper\.sigmoid|mapper\.sum|mapper\.sum\.forbid-nulls|mapper\.tanh|mapper\.tick|mapper\.toboolean|mapper\.todouble|mapper\.tolong|mapper\.tostring|mapper\.truecourse|mapper\.var|mapper\.var\.forbid-nulls|mapper\.vdist|mapper\.vspeed|mapper\.weekday|mapper\.year|max\.tick\.sliding\.window|max\.time\.sliding\.window|op\.add|op\.and|op\.div|op\.eq|op\.ge|op\.gt|op\.le|op\.lt|op\.mask|op\.mul|op\.ne|op\.or|op\.sub|reducer\.argmax|reducer\.argmin|reducer\.count|reducer\.count\.exclude-nulls|reducer\.count\.include-nulls|reducer\.count\.nonnull|reducer\.join|reducer\.join\.forbid-nulls|reducer\.join\.nonnull|reducer\.max|reducer\.max\.forbid-nulls|reducer\.max\.nonnull|reducer\.mean|reducer\.mean\.exclude-nulls|reducer\.median|reducer\.min|reducer\.min\.forbid-nulls|reducer\.min\.nonnull|reducer\.percentile|reducer\.product|reducer\.sd|reducer\.sd\.forbid-nulls|reducer\.shannonentropy\.0|reducer\.shannonentropy\.1|reducer\.sum|reducer\.sum\.forbid-nulls|reducer\.sum\.nonnull|reducer\.var|reducer\.var\.forbid-nulls";

var keywordMap = {
    "constant.language": warpscriptConstants,
    "keyword.control": warpscriptControl,
    "keyword.other": warpscriptFrameworkFunctions,
    "support.function": warpscriptFunctions
}

// console.debug("[mode-warpscript] keywordMap", keywordMap);
exports.KeywordMap = keywordMap;
});

ace.define("ace/mode/warpscript_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules","ace/mode/warpscript_keywords"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var keywordMap =  require("./warpscript_keywords").KeywordMap;

var WarpScriptHighlightRules = function() {
    this.keywordMapper = this.createKeywordMapper(keywordMap, "identifier", false);


    this.$rules = {
      "start" : [
        {
          token: "comment",
          regex: /\/\//,        // Token '//'
          next:  "line_comment"
        }, {
          token : "string.quoted.single",           // '' string
          regex : /'[^']*'/
        }, {
          token : "constant.numeric", // float
          regex : /[+-]?\d+(\.\d+)?([eE][+-]?\d+)?\b/
        }, {
          token: "support.variable",
          regex: /\@[a-zA-Z0-9_$]*\b/
        }, {
          token : this.keywordMapper,
          regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
          caseInsensitive: false
        }, {
          token : "keyword.operator",
          regex : /!=|!|%|&|&&|\*|\*\*|\+|\-|\/|<|<=|==|>|>=|\[|\]|\[\]|\^|\{\}|\{|\}|\||\|\||~=/
        }, {
          token : "paren.lparen",
          regex : /[\[\{]/
        }, {
          token : "paren.rparen",
          regex : /[\]\}]/
        }, {
          token : "text",
          regex : /\s+/
        }
      ],
      "line_comment" : [           // If end of line, back to start state, else it's a comment
        {
          token : "comment",
          regex : "$|^",
          next : "start"
        },
        {
          defaultToken : "comment",
          caseInsensitive: true
        }
      ],
    };
};

oop.inherits(WarpScriptHighlightRules, TextHighlightRules);

exports.WarpScriptHighlightRules = WarpScriptHighlightRules;
});



ace.define("ace/mode/warpscript_completions",["require","exports","module","ace/token_iterator","ace/mode/warpscript_keywords"], function(require, exports, module) {
"use strict";



  var keywordMap =  require("./warpscript_keywords").KeywordMap;


  var keywordList = [];

  for (var key in keywordMap) {
    keywordList = keywordList.concat(keywordMap[key].split(/\|/));
  }
  keywordList = keywordList.sort();
  // console.debug("[mode-warpscript] keyword list", keywordList);

  var WarpScriptCompletions = function() {
  };
  (function() {
    this.getCompletions = function(state, session, pos, prefix) {
      console.debug("[mode-warpscript] getCompletions - keywordList", keywordList);
      var matchingWords = [];
      for (var word in keywordList) {

        if (keywordList[word].search(prefix) > -1) {
          matchingWords.push(keywordList[word])
        }
      }
      var matchingWordsObjects = matchingWords.map(function(value){
        return {
            caption: value,
            snippet: value,
            meta: "WARPSCRIPT",
            score: Number.MAX_VALUE
        };
      });
      console.debug("[mode-warpscript] getCompletions - matching words", matchingWordsObjects );
      return matchingWordsObjects;
    }
  }).call(WarpScriptCompletions.prototype);

  exports.WarpScriptCompletions = WarpScriptCompletions;
});


ace.define("ace/mode/warpscript",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/warpscript_highlight_rules","ace/range","ace/mode/warpscript_completions"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var WarpScriptHighlightRules = require("./warpscript_highlight_rules").WarpScriptHighlightRules;
var WarpScriptCompletions = require("./warpscript_completions").WarpScriptCompletions;
var Range = require("../range").Range;

var Mode = function() {
  console.debug("[mode-warpscript] Mode initializing" )
    this.HighlightRules = WarpScriptHighlightRules;
    this.$completer = new WarpScriptCompletions();
};
oop.inherits(Mode, TextMode);


(function() {

  this.lineCommentStart = "*";

  this.$id = "ace/mode/warpscript";

  this.getCompletions = function(state, session, pos, prefix) {
    var completerResponse = this.$completer.getCompletions(state, session, pos, prefix);
    console.debug("[mode-warpscript] completer response", completerResponse);
    return completerResponse;
  };

}).call(Mode.prototype);

exports.Mode = Mode;

});
