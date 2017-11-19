# iotdb-match
match objects against templates

# example

The template is the first argument.
The thing you're testing - the event -
is the second argument

## Exact Match

    const matcher = require("iotdb-match")

    ## true
    matcher.match({
        first: "David",
        last: "Janes",
    }, {
        first: "David",
        last: "Janes",
        height: 180,
    })

## Glob Match

    const matcher = require("iotdb-match")

    ## true
    matcher.match({
        first: "*",
        last: "Janes",
    }, {
        first: "David",
        last: "Janes",
        height: 180,
    })

## Array Match

    const matcher = require("iotdb-match")

    ## true
    matcher.match({
        first: [ "David", "John", "Jacqui", ],
        last: "Janes",
    }, {
        first: "David",
        last: "Janes",
        height: 180,
    })
