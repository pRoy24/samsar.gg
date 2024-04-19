

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' })
  }

  return res.status(200).json({ 
    status: 'ok',
    timestamp: Date.now()
  });

}