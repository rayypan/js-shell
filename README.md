# js-shell

List of in-built functions

```
Time: [21:11:29]
Code: help
General codes:
help                    -- view this menu
echo(value, color)      -- print value in color, color is optional, no linefeed
println(value)          -- print value, with time, code, and line feed
printObj(value)         -- print value as JSON
printerr(value)         -- println() in red
printwrn(value)         -- println() in yellow
richPrint(value, color) -- print in color, color is optional
console.log()           -- same as println()
console.err()           -- same as printerr()
console.wrn()           -- same as printwrn()
console.cls()           -- same as cls()
cls()                   -- clear screen

Time: [21:11:31]
Code: xhlp
DB management codes
dbRoot                  -- prints local root path
getData(path)           -- print data at path as JSON
startDBListener(path)   -- start listening for database changes at path
runningListeners()      -- list currently running database listeners
stopDBListener(path)    -- stops listening at path
setData(path, value)    -- sets data = value(value is an object) to path
rmData(path)            -- removes data from path
encode(value)           -- converts special symbols to special string codes
decode(value)           -- opposite of encode()

Warning:
 - If path is not passed to a function, it'll default to dbRoot, which is safe
 - If you don't know what you're doing, DO NOT enter paths starting with '/'
```
