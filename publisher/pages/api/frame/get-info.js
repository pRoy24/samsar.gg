import { getPinataClient } from "../../../utils/pinata";
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;

const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export default async function handler(req, res) {

  const tokenId = req.query.id;
  const imageHash = req.query.imageHash;
  const fdk = getPinataClient();

  const frameMetadata = `
  <meta name="fc:frame" content="vNext">
  <meta name="og:image" content="${API_SERVER}/price/${tokenId}.png">
  <meta name="fc:frame:image" content="${API_SERVER}/price/${tokenId}.png">
  <meta name="fc:frame:image:aspect_ratio" content="1:1">
  <meta name="fc:frame:button:1" content="Mint">
  <meta name="fc:frame:button:1:action" content="tx">
  <meta name="fc:frame:button:1:target" content="${HOST_URL}/api/frame/get-mint-tx?id=${tokenId}">
  <meta name="fc:frame:button:2" content="Burn">
  <meta name="fc:frame:button:2:action" content="tx">
  <meta name="fc:frame:button:2:target" content="${HOST_URL}/api/frame/get-burn-tx?id=${tokenId}">
  <meta name="fc:frame:button:3" content="Image">
  <meta name="fc:frame:button:3:action" content="post">
  <meta name="fc:frame:button:3:target" content="${HOST_URL}/api/frame/get-image?id=${tokenId}&imageHash=${imageHash}">
  <meta name="fc:frame:post_url" content="${HOST_URL}/api/frame/get-pending-tx?id=${tokenId}&imageHash=${imageHash}">
  `;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
    ${frameMetadata}
    </head>
  </html>
  `;

  // Set the response Content-Type to text/html
  res.setHeader('Content-Type', 'text/html');

  // Send the HTML page as the response
  res.status(200).send(htmlContent);



}