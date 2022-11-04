const puppeteer = require("puppeteer");

async function startScraping() {


    var all_the_years = [];
    

    const brower = await puppeteer.launch({

        //headless: false,
        //defaultViewport: null
    });


    //STEP 1
    const page = await brower.newPage();
    const url = "https://www.lottostat.dk/lordagdraw.php?drawing=arr&aar=2016";
    await page.goto(url);



    //select the CSS
    await page.waitForTimeout("#Lordagslotto");



    // how many year rows do we have  
    const countYearOfRows = await page.$$eval("#Lordagslotto > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > div:nth-child(1) > div:nth-child(8) > table > tbody > tr > td:nth-child(1) > table > tbody tr", x => x.length);

    // loop the years
    for (var i = 1; i < countYearOfRows; i++) {

        const column3 = await page.$$eval("#Lordagslotto > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > div:nth-child(1) > div:nth-child(8) > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child("+i+") > td > a", (list) => list.map((elm) => elm.href));
       
        // Check if there are 1, 2 or 3 years in the row
        for (var y = 0; y < column3.length; y++) {
            all_the_years.push(column3[y]);
        }

    }
    console.log("STEP 1");
    console.log("Get all the Years - Done");
    console.log("Years: " + all_the_years.length);



    //STEP 2
    //*****************************************************************************************************



    var all_the_season = [];



    //loop all the years
    for (var u = 0; u < all_the_years.length; u++) {   


        await page.goto(all_the_years[u]);
        await page.waitForTimeout("#Lordagslotto");

        console.log("Scaping: " + all_the_years[u]);

        //loop all 3 row of date
        for (var t = 1; t < 4; t++) {


            //loop first 4 columns
            for (var i = 1; i < 5; i++) {

                // how many year do we have in date  
                const countJanOfRows = await page.$$eval("#Lordagslotto > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > div:nth-child(1) > div:nth-child(8) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child("+t+") > td:nth-child("+i+") > table > tbody > tr", x => x.length);


                //get every date and push to array
                for (var c = 2; c < countJanOfRows+1; c++) {
    
                    const jan = await page.$$eval("#Lordagslotto > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > div:nth-child(1) > div:nth-child(8) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child("+t+") > td:nth-child("+i+") > table > tbody > tr:nth-child(" + c + ") > td > a", (list) => list.map((elm) => elm.href));
                    all_the_season.push(jan[0]);
                    //console.log("jan:");
                    //console.log(jan);
        
                }

            }


        }
        console.log("Done");


    }
    console.log("STEP 2");
    console.log("Get all the Season/date - Done");
    console.log("Season/date: " + all_the_season.length);
   


    //STEP 3 - use all the season link to get numbers
    //*****************************************************************************************************


    var countdown = all_the_season.length;
    var final_array = [];


        for (var i = 0; i < all_the_season.length; i++) {


            await page.goto(all_the_season[i]);  
            await page.waitForTimeout("#firstaid");

            var array_seven_numbers = [];


            //length of balls pick
            const getNumbers = await page.$$eval("#firstaid > div.col-xs-12.col-sm-12.col-md-12.col-lg-12 > div:nth-child(7) > div:nth-child(1) > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > div", x => x.length);


            // get numbers one by one
            for (var o = 1; o < getNumbers+1; o++) {

                const getNumbers = await page.$eval("#firstaid > div.col-xs-12.col-sm-12.col-md-12.col-lg-12 > div:nth-child(7) > div:nth-child(1) > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > div:nth-child("+o+") > div", element => element.childNodes[2].textContent);
                array_seven_numbers.push(getNumbers);
        
            }





            final_array.push(array_seven_numbers);

            //display count
            console.log("countdown: " + countdown);
            countdown--;

            //reset array
            array_seven_numbers = [];


        }

        console.log("STEP 3");
        console.log("final Array length: "+final_array.length);
       
  


        const fs = require('fs');

        var filename = 'lotto_numbers.txt';
        var str = JSON.stringify(final_array);


        fs.writeFile(filename, str, (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("lotto_numbers.txt", "utf8"));
            }
        });



  


















}


startScraping();







// how to run it
// node index.js