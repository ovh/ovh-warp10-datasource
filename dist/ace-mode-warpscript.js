System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function default_1() {
        if (!window['ace']) {
            return;
        }
        ace.define('ace/mode/warpscript_keywords', function (require, exports, module) {
            var warpscriptFunctions = "REV|BOOTSTRAP|RTFM|REXEC|REXECZ|PIGSCHEMA|MARK|CLEARTOMARK|COUNTTOMARK|AUTHENTICATE|ISAUTHENTICATED|STACKATTRIBUTE|EXPORT|TIMINGS|NOTIMINGS|ELAPSED|\-\>LIST|LIST\-\>|UNLIST|\-\>SET|SET\-\>|\-\>V|V\-\>|UNION|INTERSECTION|DIFFERENCE|\-\>MAP|MAP\-\>|UNMAP|MAPID|\-\>JSON|JSON\-\>|\-\>PICKLE|PICKLE\-\>|GET|SET|PUT|SUBMAP|SUBLIST|KEYLIST|VALUELIST|SIZE|SHRINK|REMOVE|UNIQUE|CONTAINS|CONTAINSKEY|CONTAINSVALUE|REVERSE|CLONEREVERSE|DUP|DUPN|SWAP|DROP|SAVE|RESTORE|CLEAR|CLEARDEFS|CLEARSYMBOLS|DROPN|ROT|ROLL|ROLLD|PICK|DEPTH|MAXDEPTH|RESET|MAXOPS|MAXLOOP|MAXBUCKETS|MAXGEOCELLS|MAXPIXELS|MAXRECURSION|OPS|MAXSYMBOLS|EVAL|AGO|MSTU|STU|APPEND|STORE|CSTORE|LOAD|RUN|DEF|UDF|CUDF|CALL|FORGET|DEFINED|REDEFS|DEFINEDMACRO|ISNaN|TYPEOF|EXTLOADED|ASSERTMSG|MSGFAIL|STOP|TRY|RETHROW|ERROR|JSONSTRICT|JSONLOOSE|DEBUGON|NDEBUGON|DEBUGOFF|LINEON|LINEOFF|LMAP|NONNULL|LFLATMAP|STACKTOLIST|IMMUTABLE|SECUREKEY|SECURE|UNSECURE|EVALSECURE|NOOP|DOC|DOCMODE|INFO|INFOMODE|SECTION|GETSECTION|SNAPSHOT|SNAPSHOTALL|SNAPSHOTTOMARK|SNAPSHOTALLTOMARK|SNAPSHOTCOPY|SNAPSHOTCOPYALL|SNAPSHOTCOPYTOMARK|SNAPSHOTCOPYALLTOMARK|SNAPSHOTN|SNAPSHOTCOPYN|HEADER|MACROTTL|MACROMAPPER|MACROREDUCER|MACROBUCKETIZER|MACROFILTER|STRICTMAPPER|STRICTREDUCER|PARSESELECTOR|TOSELECTOR|PARSE|SMARTPARSE|AND|OR|BITGET|BITCOUNT|BITSTOBYTES|BYTESTOBITS|REVBITS|NOT|ABS|TODOUBLE|TOBOOLEAN|TOLONG|TOSTRING|TOHEX|TOBIN|FROMHEX|FROMBIN|TOBITS|FROMBITS|\-\>DOUBLEBITS|DOUBLEBITS\-\>|\-\>FLOATBITS|FLOATBITS\-\>|TOKENINFO|GETHOOK|HASH|MD5|SHA1|SHA256|SHA256HMAC|SHA1HMAC|AESWRAP|AESUNWRAP|RUNNERNONCE|GZIP|UNGZIP|RSAGEN|RSAPUBLIC|RSAPRIVATE|RSAENCRYPT|RSADECRYPT|RSASIGN|RSAVERIFY|URLDECODE|URLENCODE|SPLIT|UUID|JOIN|SUBSTRING|TOUPPER|TOLOWER|TRIM|B64TOHEX|HEXTOB64|BINTOHEX|HEXTOBIN|BIN\-\>|HEX\-\>|B64\-\>|B64URL\-\>|\-\>BYTES|\-\>BIN|\-\>HEX|\-\>B64|\-\>B64URL|\-\>OPB64|OPB64\-\>|OPB64TOHEX|SWITCH|CONTINUE|EVERY|RANGE|NRETURN|NEWENCODER|CHUNKENCODER|\-\>ENCODER|ENCODER\-\>|\-\>GTS|OPTIMIZE|NEWGTS|MAKEGTS|ADDVALUE|SETVALUE|FETCH|FETCHLONG|FETCHDOUBLE|FETCHSTRING|FETCHBOOLEAN|LIMIT|MAXGTS|FIND|FINDSETS|METASET|FINDSTATS|DEDUP|ONLYBUCKETS|VALUEDEDUP|CLONEEMPTY|COMPACT|RANGECOMPACT|STANDARDIZE|NORMALIZE|ISONORMALIZE|ZSCORE|FILLPREVIOUS|FILLNEXT|FILLVALUE|FILLTICKS|INTERPOLATE|FIRSTTICK|LASTTICK|MERGE|RESETS|MONOTONIC|TIMESPLIT|TIMECLIP|CLIP|TIMEMODULO|CHUNK|FUSE|RENAME|RELABEL|SETATTRIBUTES|CROP|TIMESHIFT|TIMESCALE|TICKINDEX|FFT|FFTAP|IFFT|FFTWINDOW|FDWT|IDWT|DWTSPLIT|EMPTY|NONEMPTY|PARTITION|STRICTPARTITION|ZIP|PATTERNS|PATTERNDETECTION|ZPATTERNS|ZPATTERNDETECTION|DTW|OPTDTW|ZDTW|RAWDTW|VALUEHISTOGRAM|PROBABILITY|PROB|CPROB|RANDPDF|SINGLEEXPONENTIALSMOOTHING|DOUBLEEXPONENTIALSMOOTHING|LOWESS|RLOWESS|STL|LTTB|TLTTB|LOCATIONOFFSET|FLATTEN|CORRELATE|SORT|SORTBY|RSORT|LASTSORT|METASORT|VALUESORT|RVALUESORT|LSORT|MSORT|UPDATE|META|DELETE|WEBCALL|MATCH|MATCHER|REPLACE|REPLACEALL|REOPTALT|TEMPLATE|TOTIMESTAMP|TEMPLATE|TOTIMESTAMP|DISCORDS|ZDISCORDS|INTEGRATE|BUCKETSPAN|BUCKETCOUNT|UNBUCKETIZE|LASTBUCKET|NAME|LABELS|ATTRIBUTES|TICKS|LOCATIONS|LOCSTRINGS|ELEVATIONS|VALUES|VALUESPLIT|TICKLIST|COMMONTICKS|WRAP|WRAPRAW|WRAPOPT|WRAPRAWOPT|UNWRAP|UNWRAPEMPTY|UNWRAPSIZE|UNWRAPENCODER|THRESHOLDTEST|ZSCORETEST|GRUBBSTEST|ESDTEST|STLESDTEST|HYBRIDTEST|HYBRIDTEST2|\-\>Q|Q\-\>|QCONJUGATE|QDIVIDE|QMULTIPLY|QROTATE|QROTATION|ROTATIONQ|ATINDEX|ATTICK|ATBUCKET|CLONE|DURATION|HUMANDURATION|ISODURATION|ISO8601|NOTBEFORE|NOTAFTER|TSELEMENTS|\-\>TSELEMENTS|TSELEMENTS\-\>|ADDDAYS|ADDMONTHS|ADDYEARS|QUANTIZE|NBOUNDS|LBOUNDS|BUCKETIZE|MAP|FILTER|APPLY|PFILTER|PAPPLY|REDUCE|PREDUCE|ISNULL|\-\>HHCODE|\-\>HHCODELONG|HHCODE\-\>|GEO\.REGEXP|GEO\.WKT|GEO\.WKT\.UNIFORM|GEO\.JSON|GEO\.JSON\.UNIFORM|GEO\.OPTIMIZE|GEO\.INTERSECTION|GEO\.UNION|GEO\.DIFFERENCE|GEO\.WITHIN|GEO\.INTERSECTS|HAVERSINE|GEOPACK|GEOUNPACK|COPYGEO|BBOX|\-\>GEOHASH|GEOHASH\-\>|COUNTER|COUNTERVALUE|COUNTERDELTA|RAND|PRNG|SRAND|NPDF|MUSIGMA|KURTOSIS|SKEWNESS|NSUMSUMSQ|LR|MODE|\-\>Z|Z\-\>|PACK|UNPACK|\-\>MAT|MAT\-\>|TR|TRANSPOSE|DET|INV|\-\>VEC|VEC\-\>|COS|COSH|ACOS|SIN|SINH|ASIN|TAN|TANH|ATAN|SIGNUM|FLOOR|CEIL|ROUND|RINT|NEXTUP|ULP|SQRT|CBRT|EXP|EXPM1|LOG|LOG10|LOG1P|TORADIANS|TODEGREES|MAX|MIN|COPYSIGN|HYPOT|IEEEREMAINDER|NEXTAFTER|ATAN2|IDENT|Pencode|PpushStyle|PpopStyle|Parc|Pellipse|Ppoint|Pline|Ptriangle|Prect|Pquad|Pbezier|PbezierPoint|PbezierTangent|PbezierDetail|Pcurve|PcurvePoint|PcurveTangent|PcurveDetail|PcurveTightness|Pbox|Psphere|PsphereDetail|PellipseMode|PrectMode|PstrokeCap|PstrokeJoin|PstrokeWeight|PbeginShape|PendShape|PbeginContour|PendContour|Pvertex|PcurveVertex|PbezierVertex|PquadraticVertex|PpushMatrix|PpopMatrix|PresetMatrix|Protate|ProtateX|ProtateY|ProtateZ|Pscale|PshearX|PshearY|Ptranslate|Pbackground|PcolorMode|Pclear|Pfill|PnoFill|Pstroke|PnoStroke|Palpha|Pblue|Pbrightness|Pcolor|Pgreen|Phue|PlerpColor|Pred|Psaturation|Pdecode|Pimage|PimageMode|Ptint|PnoTint|Ppixels|PupdatePixels|Pblend|Pcopy|Pget|Pset|Pfilter|PblendMode|Pclip|PnoClip|PGraphics|PcreateFont|Ptext|PtextAlign|PtextAscent|PtextDescent|PtextFont|PtextLeading|PtextMode|PtextSize|PtextWidth|Pconstrain|Pdist|Plerp|Pmag|Pmap|Pnorm";
            var warpscriptControl = "ASSERT|BREAK|FAIL|FOR|FOREACH|FORSTEP|IFT|IFTE|RETURN|UNTIL|WHILE";
            var warpscriptConstants = "NULL|NaN|E|e|PI|pi|NOW|MAXLONG|MINLONG|TRUE|true|FALSE|false|w|d|h|m|s|ms|us|ns|ps";
            var warpscriptFrameworkFunctions = "max\.tick\.sliding\.window|max\.time\.sliding\.window|mapper\.replace|mapper\.gt|mapper\.ge|mapper\.eq|mapper\.ne|mapper\.le|mapper\.lt|mapper\.add|mapper\.mul|mapper\.pow|mapper\.sqrt|mapper\.exp|mapper\.log|mapper\.min\.x|mapper\.max\.x|mapper\.parsedouble|mapper\.tick|mapper\.year|mapper\.month|mapper\.day|mapper\.weekday|mapper\.hour|mapper\.minute|mapper\.second|mapper\.npdf|mapper\.dotproduct|mapper\.dotproduct\.tanh|mapper\.dotproduct\.sigmoid|mapper\.dotproduct\.positive|mapper\.kernel\.cosine|mapper\.kernel\.epanechnikov|mapper\.kernel\.gaussian|mapper\.kernel\.logistic|mapper\.kernel\.quartic|mapper\.kernel\.silverman|mapper\.kernel\.triangular|mapper\.kernel\.tricube|mapper\.kernel\.triweight|mapper\.kernel\.uniform|mapper\.percentile|filter\.byclass|filter\.bylabels|filter\.byattr|filter\.bylabelsattr|filter\.bymetadata|filter\.last\.eq|filter\.last\.ge|filter\.last\.gt|filter\.last\.le|filter\.last\.lt|filter\.last\.ne|filter\.latencies|mapper\.geo\.within|mapper\.geo\.outside|mapper\.geo\.approximate|bucketizer\.and|bucketizer\.first|bucketizer\.last|bucketizer\.min|bucketizer\.max|bucketizer\.mean|bucketizer\.median|bucketizer\.mad|bucketizer\.or|bucketizer\.sum|bucketizer\.join|bucketizer\.count|bucketizer\.percentile|bucketizer\.min\.forbid\-nulls|bucketizer\.max\.forbid\-nulls|bucketizer\.mean\.exclude\-nulls|bucketizer\.sum\.forbid\-nulls|bucketizer\.join\.forbid\-nulls|bucketizer\.count\.exclude\-nulls|bucketizer\.count\.include\-nulls|bucketizer\.count\.nonnull|bucketizer\.mean\.circular|bucketizer\.mean\.circular\.exclude\-nulls|mapper\.and|mapper\.count|mapper\.first|mapper\.last|mapper\.min|mapper\.max|mapper\.mean|mapper\.median|mapper\.mad|mapper\.or|mapper\.highest|mapper\.lowest|mapper\.sum|mapper\.join|mapper\.delta|mapper\.rate|mapper\.hspeed|mapper\.hdist|mapper\.truecourse|mapper\.vspeed|mapper\.vdist|mapper\.var|mapper\.sd|mapper\.abs|mapper\.ceil|mapper\.floor|mapper\.finite|mapper\.round|mapper\.toboolean|mapper\.tolong|mapper\.todouble|mapper\.tostring|mapper\.tanh|mapper\.sigmoid|mapper\.product|mapper\.geo\.clear|mapper\.count\.exclude\-nulls|mapper\.count\.include\-nulls|mapper\.count\.nonnull|mapper\.min\.forbid\-nulls|mapper\.max\.forbid\-nulls|mapper\.mean\.exclude\-nulls|mapper\.sum\.forbid\-nulls|mapper\.join\.forbid\-nulls|mapper\.var\.forbid\-nulls|mapper\.sd\.forbid\-nulls|mapper\.mean\.circular|mapper\.mean\.circular\.exclude\-nulls|mapper\.mod|reducer\.and|reducer\.and\.exclude\-nulls|reducer\.min|reducer\.min\.forbid\-nulls|reducer\.min\.nonnull|reducer\.max|reducer\.max\.forbid\-nulls|reducer\.max\.nonnull|reducer\.mean|reducer\.mean\.exclude\-nulls|reducer\.median|reducer\.mad|reducer\.or|reducer\.or\.exclude\-nulls|reducer\.sum|reducer\.sum\.forbid\-nulls|reducer\.sum\.nonnull|reducer\.join|reducer\.join\.forbid\-nulls|reducer\.join\.nonnull|reducer\.join\.urlencoded|reducer\.var|reducer\.var\.forbid\-nulls|reducer\.sd|reducer\.sd\.forbid\-nulls|reducer\.argmin|reducer\.argmax|reducer\.product|reducer\.count|reducer\.count\.include\-nulls|reducer\.count\.exclude\-nulls|reducer\.count\.nonnull|reducer\.shannonentropy\.0|reducer\.shannonentropy\.1|reducer\.percentile|reducer\.mean\.circular|reducer\.mean\.circular\.exclude\-nulls|op\.add|op\.add\.ignore\-nulls|op\.sub|op\.mul|op\.mul\.ignore\-nulls|op\.div|op\.mask|op\.negmask|op\.ne|op\.eq|op\.lt|op\.gt|op\.le|op\.ge|op\.and\.ignore\-nulls|op\.and|op\.or\.ignore\-nulls|op\.or|mapper\.distinct";
            exports.KeywordMap = {
                "constant.language": warpscriptConstants,
                "keyword.control": warpscriptControl,
                "keyword.other": warpscriptFrameworkFunctions,
                "support.function": warpscriptFunctions
            };
        });
        ace.define("ace/mode/warpscript_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules", "ace/mode/warpscript_keywords"], function (require, exports, module) {
            var oop = require("../lib/oop");
            var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
            var keywordMap = require("./warpscript_keywords").KeywordMap;
            var WarpScriptHighlightRules = function () {
                this.keywordMapper = this.createKeywordMapper(keywordMap, "identifier", false);
                this.$rules = {
                    start: [{
                            token: "comment",
                            regex: /(?:#|\/\/)(?:[^?]|\?[^>])*/,
                        }, {
                            token: "comment",
                            regex: "\\/\\*",
                            next: "comment"
                        }, {
                            token: "string.quoted.single",
                            regex: /'[^']*'/
                        }, {
                            token: "constant.numeric",
                            regex: /[+-]?\d+(\.\d+)?([eE][+-]?\d+)?\b/
                        }, {
                            token: "support.variable",
                            regex: /\@[a-zA-Z0-9_$]*\b/
                        }, {
                            token: this.keywordMapper,
                            regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
                            caseInsensitive: false
                        }, {
                            token: "keyword.operator",
                            regex: /!=|!|%|&|&&|\*|\*\*|\+|\-|\/|<|<=|==|>|>=|\[|\]|\[\]|\^|\{\}|\{|\}|\||\|\||~=/
                        }, {
                            token: "paren.lparen",
                            regex: /[\[\{]/
                        }, {
                            token: "paren.rparen",
                            regex: /[\]\}]/
                        }, {
                            token: "text",
                            regex: /\s+/
                        }],
                    line_comment: [{
                            token: "comment",
                            regex: "$|^",
                            next: "start"
                        }, {
                            defaultToken: "comment",
                            caseInsensitive: true
                        }],
                    comment: [{
                            token: "comment",
                            regex: "\\*\\/",
                            next: "start"
                        }, {
                            defaultToken: "comment"
                        }]
                };
            };
            oop.inherits(WarpScriptHighlightRules, TextHighlightRules);
            exports.WarpScriptHighlightRules = WarpScriptHighlightRules;
        });
        ace.define("ace/mode/warpscript_completions", ["require", "exports", "module", "ace/mode/warpscript_keywords"], function (require, exports, module) {
            var keywordMap = require("./warpscript_keywords").KeywordMap;
            var keywordList = [];
            for (var key in keywordMap) {
                keywordList = keywordList.concat(keywordMap[key].split(/\|/));
            }
            keywordList = keywordList.sort();
            var WarpScriptCompletions = function () { };
            (function () {
                this.getCompletions = function (state, session, pos, prefix) {
                    var matchingWords = [];
                    for (var word in keywordList) {
                        if (keywordList[word].search(prefix) > -1)
                            matchingWords.push(keywordList[word]);
                    }
                    var matchingWordsObjects = matchingWords.map(function (value) {
                        return {
                            caption: value,
                            snippet: value,
                            meta: "WARPSCRIPT",
                            score: Number.MAX_VALUE
                        };
                    });
                    return matchingWordsObjects;
                };
            }).call(WarpScriptCompletions.prototype);
            exports.WarpScriptCompletions = WarpScriptCompletions;
        });
        ace.define("ace/mode/warpscript", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/warpscript_highlight_rules", "ace/range", "ace/mode/warpscript_completions"], function (require, exports, module) {
            var oop = require("../lib/oop");
            var TextMode = require("./text").Mode;
            var WarpScriptHighlightRules = require("./warpscript_highlight_rules").WarpScriptHighlightRules;
            var WarpScriptCompletions = require("./warpscript_completions").WarpScriptCompletions;
            var Range = require("../range").Range;
            var Mode = function () {
                this.HighlightRules = WarpScriptHighlightRules;
                this.$completer = new WarpScriptCompletions();
            };
            oop.inherits(Mode, TextMode);
            (function () {
                this.lineCommentStart = "*";
                this.$id = "ace/mode/warpscript";
                this.getCompletions = function (state, session, pos, prefix) {
                    var completerResponse = this.$completer.getCompletions(state, session, pos, prefix);
                    return completerResponse;
                };
            }).call(Mode.prototype);
            exports.Mode = Mode;
        });
        ace.define('ace/snippets/warpscript', ["require", "exports", "module"], function (require, exports, module) {
            exports.scope = 'warpscript';
            exports.snippets = [{
                    name: 'fetch',
                    content: "[ ${1:read_token} '${2:class}' { ${3} } \\$end \\$interval ] FETCH\n"
                }, {
                    name: 'find',
                    content: "[ ${1:read_token} '${2:class}' { ${3} } ] FIND \n"
                }, {
                    name: 'bucketize',
                    content: '[ SWAP bucketizer.${1:max} \\$end ${2:5 m} ${3:0} ] BUCKETIZE \n'
                }, {
                    name: 'map',
                    content: "[ SWAP mapper.${1:max} ${2:0} ${3:0} ${4:0} ] MAP \n"
                }, {
                    name: 'reduce',
                    content: "[ SWAP [ ${1:} ] reducer.${2:sum} ] REDUCE \n"
                }, {
                    name: 'new gts',
                    content: "NEWGTS '${1:name}' RENAME { ${2:labels} } RELABEL \n"
                }, {
                    name: 'lmap',
                    content: '<% ${1:DROP}\n${2:} \n%> LMAP'
                }, {
                    name: 'ift',
                    content: '<% ${1:true} %>\n\t<% ${2:} %>\nIFT \n'
                }, {
                    name: 'ifte',
                    content: '<% ${1:true} %>\n\t<% ${2:} %>\n\t<% ${3:} %>\nIFTE \n'
                }];
        });
    }
    exports_1("default", default_1);
    return {
        setters: [],
        execute: function () {
        }
    };
});
