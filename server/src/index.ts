import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const port = 5000;

app.get('/api', (req: Request, res: Response) => {
  res.send('TypeScript With Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
