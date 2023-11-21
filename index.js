const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors'); // Importe o pacote cors
require('dotenv').config();

const app = express();

app.use(cors()); // Configuração do CORS

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


app.get("/", (req,res) =>{https://localhost:8000/buckets
  return res.json("hello world")
})
app.get('/lastUploadDate', async (req, res) => {
  // Resto do código...

  res.json({ horarioBrasileiro });
});

app.get('/bucketObjects', async (req, res) => {
  // Resto do código...

  res.json({ Contents: objects });
});

app.get('/buckets', async (req, res) => {
  try {
    const response = await s3.listBuckets().promise();
    const buckets = response.Buckets.map((bucket) => ({
      Name: bucket.Name,
      CreationDate: bucket.CreationDate,
    }));
    res.json({ Buckets: buckets });
  } catch (error) {
    console.error('Erro ao listar buckets:', error);
    res.status(500).json({ message: 'Erro ao consultar os buckets.' });
  }
});

// Rota para listar detalhes de um bucket específico
app.get('/bucketDetails/:bucketName', async (req, res) => {
  const { bucketName } = req.params;

  const params = {
    Bucket: bucketName,
  };

  try {
    const response = await s3.listObjectsV2(params).promise();
    if (response.Contents.length > 0) {
      const standardFiles = response.Contents.filter((file) => file.StorageClass === 'STANDARD')
        .map((file) => ({
          Key: file.Key,
          LastModified: file.LastModified,
        }));

      res.json({ BucketName: bucketName, Files: standardFiles });
    } else {
      res.status(404).json({ message: 'Nenhum objeto encontrado no bucket.' });
    }
  } catch (error) {
    console.error('Erro ao listar objetos do bucket:', error);
    res.status(500).json({ message: 'Erro ao consultar o bucket.' });
  }
});

const port = process.env.PORT ||8000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
