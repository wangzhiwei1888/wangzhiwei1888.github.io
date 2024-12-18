const http = require('http');

const heapdump = require('heapdump');


leakArray = [];

// const leakArray = [];


const showMem = function(){

    var mem = process.memoryUsage();
    
    const format = function(bytes){
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }

    console.log(`Memory Usage: ${format(mem.rss - mem.heapUsed)} 堆外, ${format(mem.heapTotal)} heapTotal, ${format(mem.heapUsed)} heapUsed.`);
    // console.log(mem);

}

var leak = function(){

    leakArray.push(new Array(20*1024*1024));

}

http.createServer(function (req, res) {

    leak();

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');

    showMem();

}).listen(8001, ()=>{
    console.log('Server running at http://127.0.0.1:8001/ pid:' + process.pid);
});

// kill -USR2 pid
