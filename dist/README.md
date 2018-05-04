Warp10-Grafana Datasource Plugin
===
[![Codeship Status for miton18/grafana-warp10](https://app.codeship.com/projects/71957320-3634-0135-1e05-4ad2f5be4eb7/status?branch=master)](https://app.codeship.com/projects/227176)

[![Build Status](https://travis-ci.org/miton18/grafana-warp10.svg?branch=master)](https://travis-ci.org/miton18/grafana-warp10)

# Install the plugin

Just clone the repository in the Grafana *plugins* folder
```sh
git clone git@github.com:miton18/grafana-warp10.git /var/lib/grafana/plugins/grafana-warp10
```
Grafana will use the *dist/* folder by default

# Add a new Warp10 Datasource

- go to the Grafana menu (top left) > "datasources" > "add data source"
- choose a name
- set Warp10 as type
- paste the Warp10 platform URL ( do not append /api/v0/... )

## Add execution variables

You can define variables at datasource level (~ organisation level) which can be available for all dashboards. you can put tokens, constants, macros, ...
In case of a macro definition, the variable value must start with *<%* and end with *%>*. In the query you can prepend *@* to the macro name to execute it.

# Make a query

On a new dashboard, in a graph edition, choose your previous datasource and click *add query*.

You can write your WarpScript on the editor below, for beginners, you can uncheck *warpScript editor*, a user friendly query editor will appear.

A query is composed by 2 component, the WarpScript from WarpScript editor and the WarpScript from friendly query builder, check or uncheck the *WarpScript editor* will execute the corresponding WarpScript.

to graph something on Grafana you need to return some GTS

## WarpScript example

/!\ The plugin look for GTS or GTS array in your stack, all other stack entry will be ignored

```WarpScript
NEWGTS
'com.cityzendata.grafana.test' RENAME @myMacro
'func' 'sinus' 2 ->MAP RELABEL
'sinus' STORE

NEWGTS
'com.cityzendata.grafana.testmetric' RENAME
'func' 'cosinus' 2 ->MAP RELABEL
'cosinus' STORE

100 // Not graphable -> ignored
'b' // Not graphable -> ignored

$interval 20 / TOLONG 'step' STORE

<% $step + %> 'stepMacro' STORE
<% 'index' STORE $sinus $index NaN NaN NaN $index SIN  ADDVALUE DROP %> 'execMacroSinus' STORE
<% 'index' STORE $cosinus $index NaN NaN NaN $index COS  ADDVALUE DROP %> 'execMacroCoinus' STORE

$start $end $stepMacro $execMacroSinus FORSTEP
$start $end $stepMacro $execMacroCoinus FORSTEP
$sinus $cosinus
```

### Table case
There is a way to build custom tables instead of formating GTS array
If your stack have only 1 element and this element have `columns` and `rows` property
Then you can choose *Table* as *Table transform* in Table Options section

WarpScript example:
```WarpScript
{
  'columns' [
    {
      'text' 'columnA'
      'type' 'number'
      'sort' true
      'desc' true
    }
    {
      'text' 'columnB'
      'type' 'number'
    }
  ]
  'rows' [
    [ 10 20 ]
    [ 100 200 ]
  ]
}
```

## Available variables
On your WarpScript you can use (all timestamps are in µSeconds):

| Name          | Description                                                   | Example                    |
|---------------|---------------------------------------------------------------|----------------------------|
| **$end**      | Timestamp of the most recent point in the Grafana time window | 1498038153276000           |
| **$endISO**   | *end* value in ISO-8601 format                                | '2017-06-21T09:42:33.276Z' |
| **$start**    | Timestamp of the less recent point in the Grafana time window | 1498034553276000           |
| **$startISO** | *start* value in ISO-8601 format                              | '2017-06-21T08:42:33.276Z' |
| **$interval** | Difference between $end and $start                            | 3600000000                 |

# Use Annotations
You can add Annotation on your graph: Dashboard > "Manage dashboard" > "Annotations"
Just add you WarpScript

/!\ You must return a single GTS on TOP of your stack

## Annotation example
```warpScript
NEWGTS
'alerts' RENAME
{ 'a' 'b' 'c' 'd' } RELABEL
$end $interval 2 / - NaN DUP DUP 'Restart WebServer' ADDVALUE
$end $interval 3 / - NaN DUP DUP 'Update v1.0.2' ADDVALUE
```

# Templating variable evaluation

To understand the variable resolution, this is how a query is built

- Inject dashboard variables (**$end**, **$interval**, etc...)
- Inject datasource variables
- Inject templating variables resoled in the configuration order (a templating variable can call the previous templating variables in its resolution)
- Inject user query (can use all previous variables)

/!\ all of the templating values are casted into strings by Grafana engine.

# User friendly query builder
- [x] Basic Fetch
- [x] Bucketizer
- [x] Reducer
- [ ] Renamer
- [ ] Mapper
- [ ] Filter
- [ ] Extend limits (LIMIT, MAXOPS, MAXFETCH, ...)
- [ ] Anomaly detection


# Data fetching example
```
100 'datapointsCount' STORE
[ $READ_TOKEN '~.*' {} $end $interval ] FETCH
[ SWAP bucketiser.max $end $interval $datapointsCount/ datapointsCount ] BUCKETIZE
```
