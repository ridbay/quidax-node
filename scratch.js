const https = require('https');

https.get('https://docs.quidax.io/v3.0/reference/create-sub-accounts', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<script id="headlessui-portal-root"[\s\S]*?<\/script>|<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (match && match[1]) {
      try {
        const json = JSON.parse(match[1]);
        const project = json.props.pageProps.project;
        // Sometimes it's inside another prop, let's explore
        const keys = Object.keys(json.props.pageProps);
        console.log("Page props keys:", keys);
        // Specifically look for the OAS / endpoints
        const oas = json.props.pageProps.oasDefinition;
        if (oas) {
          console.log("OAS Definition Found!");
          const paths = Object.keys(oas.paths);
          paths.slice(0, 10).forEach(p => console.log(p));
        } else {
            console.log("No OAS definition found in page props.");
            // Dump part of pageProps to see structure
            console.log(JSON.stringify(json.props.pageProps).substring(0, 500));
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    } else {
      console.log("No NEXT_DATA found");
    }
  });
});
