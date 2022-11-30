const { google } = require('googleapis');
const CONSTANTS = require('../config/constants');

const importPhotos = async (req, res) => {
    var stage = "";
    try{
        const OAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN});
        //const accessToken = await OAuth2Client.getAccessToken();


        const drive = google.drive({version: 'v3', auth: OAuth2Client});
        const files = [];
        const categories = new Array('Painting"', 'Drawing"');
        const a = new Array();
        let counter = 0;
        try {
            //Get all ID, Name, and links of matching files, then pass array of IDs. May change to array of files (contains ID and name)
            //Draws link on client side since sending link throws off CORS. 
            //Add some sort of descriptor to files so hope can have a caption for each image. 
            for(const title of categories){
                let que = 'name contains "';
                que = que.concat(title);
                const result = await drive.files.list({
                q: que,
                fields: 'nextPageToken, files(id, name, webViewLink)',
                spaces: 'drive',
                });
                let c = new Array();
                var count = 0;
                Array.prototype.push.apply(files, result.files);
                result.data.files.forEach(function(file) {
                    console.log('Found file:', file.name, file.id, file.webViewLink);
                    let temp = new Array();
                    temp = file.name.split(".");
                    let name = temp[0];
                    c[count] = name + "@" + file.id;
                    count++;
                    //console.log(c);
                });
                //console.log("C after adding: " + c);
                //console.log('Found Files: ', count);
                //console.log("A before adding c: " + a);
                a.push(c);
                //console.log("A after adding: " + a);
                counter++;
                //const b = a;
            }
            //res.header("Access-Control-Allow-Origin: *");
            //await function sleep(){return new Promise((resolve) => {setTimeout(resolve, 1000);});}
            //console.log("Ready to return: " + a);
            res.status(200).json(a);
        }catch(err){
            stage = "Loading files "
            console.log(err);
            res.status(500).json(err)
        }

    }catch(err){
        stage = "Auth "
        console.log(err);
        res.status(500).json(err)
    }

}
const importCategory = async (req, res) => {
    try{
        const OAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN});
        //const accessToken = await OAuth2Client.getAccessToken();

        const title = req.body.category;
        const drive = google.drive({version: 'v3', auth: OAuth2Client});
        const files = [];
        try {

            let que = 'name contains "';
            que = que.concat(title);
            que = que.concat('"');
            const result = await drive.files.list({
            q: que,
            fields: 'nextPageToken, files(id, name, webViewLink)',
            spaces: 'drive',
            });
            let c = [];
            var count = 0;
            Array.prototype.push.apply(files, result.files);
            result.data.files.forEach(function(file) {
                console.log('Found file:', file.name, file.id, file.webViewLink);
                c.push(file.id);
                count++;
            });
            console.log('Found Files: ', count);
    
            //res.header("Access-Control-Allow-Origin: *");
            res.status(200).json(c);
        }catch(err){
            stage = "Loading files "
            console.log(stage);
            res.status(500).json(err)
        }

    }catch(err){
        stage = "Auth "
        console.log(stage);
        res.status(500).json(err)
    }

}

module.exports={
    importPhotos,
    importCategory
}