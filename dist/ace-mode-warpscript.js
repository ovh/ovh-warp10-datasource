System.register(["./monarch"], function (exports_1, context_1) {
    "use strict";
    var monarch_1;
    var __moduleName = context_1 && context_1.id;
    function default_1() {
        if (!window['ace']) {
            return;
        }
        ace.define('ace/mode/warpscript_keywords', function (require, exports, module) {
            var warpscriptConstants = monarch_1.Monarch.rules['constants'].join('|') + "|TRUE|true|FALSE|false";
            var warpscriptFunctions = monarch_1.Monarch.rules['keywords'].join('|');
            var warpscriptControl = monarch_1.Monarch.rules['control'].join('|');
            var warpscriptFrameworkFunctions = monarch_1.Monarch.rules['functions'].join('|');
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
        return true;
    }
    exports_1("default", default_1);
    return {
        setters: [
            function (monarch_1_1) {
                monarch_1 = monarch_1_1;
            }
        ],
        execute: function () {
        }
    };
});
