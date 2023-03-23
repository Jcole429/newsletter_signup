const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const localPort = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;

mailchimp.setConfig({
    apiKey: mailchimpApiKey,
    server: mailchimpServerPrefix,
});

app.listen(process.env.PORT || localPort, () => {
    console.log("App listening on port " + localPort);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const subscribingUser = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    }

    const run = async () => {
        try {
            const response = await mailchimp.lists.addListMember(mailchimpAudienceId, subscribingUser);
            console.log("Response: " + response);
            console.log("Here: " + response.id);
            res.sendFile(__dirname + "/success.html");
        } catch (e) {
            console.log(e.response.statusCode);
            console.log(e.response.body.title);
            console.log("Detail: " + e.response.body.detail);

            res.sendFile(__dirname + "/failure.html");
        }
    }
    run();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});