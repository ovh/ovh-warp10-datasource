Grafana Warp 10™ Datasource Plugin
===

# Install the plugin

Just clone the repository in the Grafana *plugins* folder
```sh
git clone git@github.com:ovh/ovh-warp10-datasource.git /var/lib/grafana/plugins/ovh-warp10-datasource
```
Grafana will use the *dist/* folder by default

# Add a new Warp 10™ Datasource

- Go to the Grafana menu (top left) > "datasources" > "add data source"
- Choose a name
- Set Warp10 as type
- Paste the Warp 10™ Platform `exec` endpoint URL ( do not append /api/v0/... )

![Global Variables](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-endpoint.png)


# Add execution variables

You can define variables at datasource level (~ organisation level) which can be available for all dashboards. you can put tokens, constants, macros, ...
In case of a macro definition, the variable value must start with *<%* and end with *%>*. In the query you can prepend *@* to the macro name to execute it.

For example, you can store a read token here:

![Global Variables](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-globalvar.png)


# Make a query

On a new dashboard, in a Graph visualization, click on Query icon on the left side bar, and choose Warp10 datasource.

A user friendly query editor will appear. You can use the global variable you defined previously:

![First query](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-simplifiedquery.png)

It will generate WarpScript for you. The generated WarpScript is visible in your browser console:

![Console output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-console.png)

You will see at the beginning of the query some special variables set by the plugin.


| Name          | Description                                                   | Example                    |
|---------------|---------------------------------------------------------------|----------------------------|
| **$end**      | Timestamp of the most recent point in the Grafana time window | 1498038153276000           |
| **$endISO**   | *end* value in ISO-8601 format                                | '2017-06-21T09:42:33.276Z' |
| **$start**    | Timestamp of the less recent point in the Grafana time window | 1498034553276000           |
| **$startISO** | *start* value in ISO-8601 format                              | '2017-06-21T08:42:33.276Z' |
| **$interval** | Difference between $end and $start                            | 3600000000                 |
| **$__interval** | Could be used as a bucket span to display less datapoints on a graph, saving your browser RAM. See [Grafana doc](https://grafana.com/docs/grafana/latest/reference/templating/#the-interval-variable).                            | 3600000000                 |



Advanced users can check the *WarpScript editor* and write the WarpScript they need.

To graph something on Grafana you need to return some Geo Time Series™ (GTS)

## Graph example

The plugin look for GTS or GTS array in your stack, all other stack entry will be ignored. Turn on the WarpScript™ editor, and use this script:

```WarpScript
NEWGTS
'io.warp10.grafana.test' RENAME
{ 'func' 'sinus' } RELABEL
'sinus' STORE

NEWGTS
'io.warp10.grafana.testmetric' RENAME
{ 'func' 'cosinus' } RELABEL
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

![sinus output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-generatedsinus.png)


## Table example

By default, the plugin build a table with the timestamp as the first column, and one column per GTS.

You can build custom tables instead of formating GTS array, if your result stack have only 1 element and this element have `columns` and `rows` property.
Then you can choose *Table* as *Table transform* in Table Options section

WarpScript™ example:
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

![table output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-table.png)


## Worldmap example

You can use `ovh-warp10-datasource` as datasource for showing position data on grafana using `grafana-worldmap-panel` plugin.

In order to do it, you need to install the `grafana-worldmap-panel` plugin: [Worldmap Panel](https://grafana.com/plugins/grafana-worldmap-panel).

When both `ovh-warp10-datasource` and the `grafana-worldmap-panel` installed, you can define a new Worldmap widget,
with a Warp&nbsp;10 datasource and `json result` as *Location Data* in the *Worlmap* tab:

![Warp&nbsp;10™ datasource](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/README-worldmap-datasource-tab.jpg)

![`json result` as *Location Data* in the *Worlmap* tab](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/README-worldmap-worldmap-tab.jpg)

Now in your WarpScript™ you can generate data in the JSON format supported by Worldmap, for example :

```
'[ { "key": "amsterdam", "latitude": 52.3702, "longitude": 4.8952, "name": "Amsterdam" }, { "key": "charleroi", "latitude": 50.4108, "longitude": 4.4446, "name": "Charleroi" }, { "key": "frankfurt", "latitude": 50.110924, "longitude": 8.682127, "name": "Frankfurt" }, { "key": "london", "latitude": 51.503399, "longitude": -0.119519, "name": "London" }, { "key": "paris", "latitude": 48.864716, "longitude": 2.349014, "name": "Paris" } ]'
JSON->
```

And then you can see the chosen locations in the map:

![Worlmap view without values](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/README-worldmap-view-without-values.jpg)

You can also give a `value` to each location, in order to show the locations with different sizes and colors, as Worldmap allows:

```
'[ { "key": "amsterdam", "latitude": 52.3702, "longitude": 4.8952, "name": "Amsterdam", "value": 9 }, { "key": "charleroi", "latitude": 50.4108, "longitude": 4.4446, "name": "Charleroi", "value": 6 }, { "key": "frankfurt", "latitude": 50.110924, "longitude": 8.682127, "name": "Frankfurt", "value": 9 }, { "key": "london", "latitude": 51.503399, "longitude": -0.119519, "name": "London", "value": 12 }, { "key": "paris", "latitude": 48.864716, "longitude": 2.349014, "name": "Paris", "value": 15 } ]'
JSON->
```

![Worlmap view with values](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/README-worldmap-view-with-values.jpg)

# Use Annotations

You can add Annotation on your graph: Dashboard > "Manage dashboard" > "Annotations"

Just add you WarpScript™

/!\ You must return a single GTS on TOP of your stack

## Annotation example

```warpScript
NEWGTS
'alerts' RENAME
{ 'a' 'b' 'c' 'd' } RELABEL
$end $interval 2 / - NaN DUP DUP 'Restart WebServer' ADDVALUE
$end $interval 3 / - NaN DUP DUP 'Update v1.0.2' ADDVALUE
```

![annotation output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-annotationFromWarpScript.png)


# Define Templating variables

You can make a WarpScript query to build the choice list of your templating variables.
In the dashboard settings, select Variables, and create a new one from a Query, with Warp10 as datasource.
You can write any WarpScript in the Query field to build your list of choices:

![annotation output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-queryForVariable.png)

- If you let several values on the stack, each value will be added to the choice list.
- Best practice: Let a list on the stack. Each value will be added to the choice list.
- Best practice: Let a map on the stack. The map keys will be added to the choice list, the map values will be available within the pannels WarpScript query. The values will be hidden from the dashboard user. This allow to hide complex values behind user friendly labels.

Here are valid queries for variable definition:
![annotation output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-variablesQueries.png)


Each value is transformed into two WarpScript variables you can use in your queries:
- A string, named as you named your variable.
- A list of strings, named as you named your variable, suffixed by `_list`.

![annotation output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-templatevariablesTable.png)

- If you do not use multiple selection, variable and variable_list will contain the currently selected value
- If you use multiple selection:
  * the string will contain an optimized WarpScript regular expression
  * the list will contain each element selected
- If you defined a *custom all value* and checked "All", variable and variable_list will contain your customized value.

In the example below, 
- testMap has a *custom all value* set to `~custom.*allvalue.*`
- testList has no defined *custom all value*.

![annotation output](https://raw.githubusercontent.com/ovh/ovh-warp10-datasource/master/dist/assets/screenshot-customAllValue.png)



# Templating variable evaluation

To understand the variable resolution, this is how a query is built

- Inject dashboard variables (**$end**, **$interval**, etc...)
- Inject datasource execution variables (Customized by datasource)
- Inject templating variables following the configuration order (a templating variable can call the previous templating variables in its resolution)
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
// you can use this public token on the https://warp.senx.io endpoint to fetch raw sensor data from a connected BeerTender.

"gCA1SVjbDkaxtmTx9ydI4TI2iGc5hFgcbCWnzMRZSt45XW8dZ53Z7VK_if28i0kXwNDLazXHgLrXUKgxLK0RbS79eJmBCpyBlIxw9US7bPfdWH4Fta51.kXN.D4Hsk5OZOwl.vLRBzMpP7F2pAMfclMXSGtCOT6F"
'rt' STORE


[ $rt '~beertender.(rawvalue|rawoffset)' {} $end $interval ] FETCH 
'rawResult' STORE

[ $rawResult [] 'beertender.rawvalue' filter.byclass ] FILTER 0 GET 'rawvalue' STORE

// do a linear interpolation to convert raw sensor value into percent.
// empty : 30.8e6
// full (cold): 30.52e6
30.8e6  $rawvalue - // you can substract GTS and constants
[ SWAP 0 mapper.max.x 0 0 0 ] MAP 0 GET // clamp min value to zero
2800 /  //divide by 2800
[ SWAP 100 mapper.min.x 0 0 0 ] MAP 0 GET // clamp max value to 100
[ SWAP bucketizer.mean 0 1 h 0 ] BUCKETIZE // keep one point per hour, the mean of each hour.


'level in percent' RENAME 

```

## Related links

 * Contribute: https://github.com/ovh/ovh-warp10-datasource/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh/ovh-warp10-datasource/issues
