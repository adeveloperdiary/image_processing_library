# Code Highlight
## Usage

### Specifying the language

This uses the same syntax as regular Markdown code blocks,
but needs to know the language of the code block. This can be done in three
different ways.

#### via Markdown syntax <small>recommended</small>

In Markdown, code blocks can be opened and closed by writing three backticks on
separate lines. To add code highlighting to those blocks, the easiest way is
to specify the language directly after the opening block.

Example:

```` markdown
``` python
import tensorflow as tf
```
````

Result:

``` python
import tensorflow as tf
```

#### via Shebang

Alternatively, if the first line of a code block contains a shebang, the
language is derived from the path referenced in the shebang. This will only
work for code blocks that are indented using four spaces, not for those
encapsulated in three backticks.

Example:

````markdown
#!/usr/bin/python
import tensorflow as tf

````

Result:

    #!/usr/bin/python
    import tensorflow as tf


#### via three colons

If the first line starts with three colons followed by a language identifier,
the first line is stripped. This will only work for code blocks that are
indented using four spaces, not for those encapsulated in three backticks.

Example:

``` markdown
:::python
import tensorflow as tf
```

Result:

    :::python
    import tensorflow as tf

### Adding line numbers

Example:

```` markdown
``` python
""" Bubble sort """
def bubble_sort(items):
    for i in range(len(items)):
        for j in range(len(items) - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
```
````

Result:

    #!python
    """ Bubble sort """
    def bubble_sort(items):
        for i in range(len(items)):
            for j in range(len(items) - 1 - i):
                if items[j] > items[j + 1]:
                    items[j], items[j + 1] = items[j + 1], items[j]

### Highlighting specific lines

Specific lines can be highlighted by passing the line numbers to the `hl_lines`
argument placed right after the language identifier. Line counts start at 1.

Example:

```` markdown
``` python hl_lines="3 4"
""" Bubble sort """
def bubble_sort(items):
    for i in range(len(items)):
        for j in range(len(items) - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
```
````

Result:

    #!python hl_lines="3 4"
    """ Bubble sort """
    def bubble_sort(items):
        for i in range(len(items)):
            for j in range(len(items) - 1 - i):
                if items[j] > items[j + 1]:
                    items[j], items[j + 1] = items[j + 1], items[j]


## Supported languages <small>excerpt</small>

CodeHilite uses [Pygments][2], a generic syntax highlighter with support for
over [300 languages][3], so the following list of examples is just an excerpt.



### Diff

``` diff
Index: grunt.js
===================================================================
--- grunt.js	(revision 31200)
+++ grunt.js	(working copy)
@@ -12,6 +12,7 @@

 module.exports = function (grunt) {

+  console.log('hello world');
   // Project configuration.
   grunt.initConfig({
     lint: {
@@ -19,10 +20,6 @@
         'packages/services.web/{!(test)/**/,}*.js',
         'packages/error/**/*.js'
       ],
-      scripts: [
-        'grunt.js',
-        'db/**/*.js'
-      ],
       browser: [
         'packages/web/server.js',
         'packages/web/server/**/*.js',
```

### Docker

``` docker
FROM ubuntu

# Install vnc, xvfb in order to create a 'fake' display and firefox
RUN apt-get update && apt-get install -y x11vnc xvfb firefox
RUN mkdir ~/.vnc

# Setup a password
RUN x11vnc -storepasswd 1234 ~/.vnc/passwd

# Autostart firefox (might not be the best way, but it does the trick)
RUN bash -c 'echo "firefox" >> /.bashrc'

EXPOSE 5900
CMD ["x11vnc", "-forever", "-usepw", "-create"]
```


### HTML

``` html
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>HTML5 Boilerplate</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/main.css">
    <script src="js/vendor/modernizr-2.8.3.min.js"></script>
  </head>
  <body>
    <p>Hello world! This is HTML5 Boilerplate.</p>
  </body>
</html>
```

### Java

``` java
import java.util.LinkedList;
import java.lang.reflect.Array;

public class UnsortedHashSet<E> {

  private static final double LOAD_FACTOR_LIMIT = 0.7;

  private int size;
  private LinkedList<E>[] con;

  public UnsortedHashSet() {
    con  = (LinkedList<E>[])(new LinkedList[10]);
  }

  public boolean add(E obj) {
    int oldSize = size;
    int index = Math.abs(obj.hashCode()) % con.length;
    if (con[index] == null)
      con[index] = new LinkedList<E>();
    if (!con[index].contains(obj)) {
      con[index].add(obj);
      size++;
    }
    if (1.0 * size / con.length > LOAD_FACTOR_LIMIT)
      resize();
    return oldSize != size;
  }

  private void resize() {
    UnsortedHashSet<E> temp = new UnsortedHashSet<E>();
    temp.con = (LinkedList<E>[])(new LinkedList[con.length * 2 + 1]);
    for (int i = 0; i < con.length; i++) {
      if (con[i] != null)
        for (E e : con[i])
          temp.add(e);
    }
    con = temp.con;
  }

  public int size() {
    return size;
  }
}
```

### JavaScript

``` javascript
var Math = require('lib/math');

var _extends = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }

  return target;
};

var e = exports.e = 2.71828182846;
exports['default'] = function (x) {
  return Math.exp(x);
};

module.exports = _extends(exports['default'], exports);
```

### JSON

``` json
{
  "name": "mkdocs-material",
  "version": "0.2.4",
  "description": "A Material Design theme for MkDocs",
  "homepage": "http://squidfunk.github.io/mkdocs-material/",
  "authors": [
    "squidfunk <martin.donath@squidfunk.com>"
  ],
  "license": "MIT",
  "main": "Gulpfile.js",
  "scripts": {
    "start": "./node_modules/.bin/gulp watch --mkdocs",
    "build": "./node_modules/.bin/gulp build --production"
  }
  ...
}
```


### XML

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mainTag SYSTEM "some.dtd" [ENTITY % entity]>
<?oxygen RNGSchema="some.rng" type="xml"?>
<xs:main-Tag xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <!-- This is a sample comment -->
  <childTag attribute="Quoted Value" another-attribute='Single quoted value'
      a-third-attribute='123'>
    <withTextContent>Some text content</withTextContent>
    <withEntityContent>Some text content with &lt;entities&gt; and
      mentioning uint8_t and int32_t</withEntityContent>
    <otherTag attribute='Single quoted Value'/>
  </childTag>
  <![CDATA[ some CData ]]>
</main-Tag>
```