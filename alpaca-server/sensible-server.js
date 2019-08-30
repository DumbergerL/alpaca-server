let express = require('express');

let app = express();
app.use(express.static(__dirname));
app.use(express.json());                        
app.use(express.urlencoded({ extended: true }));

app.get('*', function(req, res){
    console.log();
    console.log("Got hit with GET Method...");
    console.log(req.body);
    res.send();
});

app.post('*', function(req, res){
    console.log();
    console.log("Got hit with POST Method...");
    console.log(req.body);
    res.send();
});

app.listen(3030, function () {
    console.log('\nSensible Server started and listening to port 3030!');
});