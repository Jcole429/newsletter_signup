const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
    apiKey: mailchimpApiKey,
    server: mailchimpServerPrefix,
});

app.listen(port, () => {
    console.log("App listening on port " + port);
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

    mailchimpAddContact(subscribingUser);
});

async function mailchimpAddContact(subscribingUser) {
    const response = await mailchimp.lists.addListMember(mailchimpAudienceId, subscribingUser);
    console.log(response);
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
}