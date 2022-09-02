import axios from "axios";

export default axios.create({
    baseURL: "https://ewk2bv8qji.eu-west-1.awsapprunner.com",
    headers: {
        "Content-type": "application/json"
    }
});