import fs from 'fs'
import path from 'path'
import Cors from 'cors'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

function runMiddleware(
  req,
  res,
  fn
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors)

  try {
    const { name } = req.query;
    const filePath = path.resolve('./public', './drawings', `${name}.excalidraw`);
    const fileString = await new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      })
    })
    const fileData = JSON.parse(fileString)
    res.status(200).json({
      elements: fileData.elements,
      files: fileData.files,
    })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
}
