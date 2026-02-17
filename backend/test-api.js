
import fs from 'fs';
import { FormData } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';
import fetch from 'node-fetch';

async function run() {
    try {
        const form = new FormData();
        const image = await fileFromPath("OIP (1).jpg");
        form.append("image", image);

        console.log("Sending request to http://localhost:5000/api/analyze-hair...");
        const response = await fetch("http://localhost:5000/api/analyze-hair", {
            method: "POST",
            body: form
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response:", text);

    } catch (error) {
        console.error("Error:", error);
    }
}

run();
