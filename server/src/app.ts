import appInit from "./server";
const port = Number(process.env.PORT) || 4000;
const serverApi = process.env.SERVER_API || "0.0.0.0";

const tmpFunc = async () => {
  const app = await appInit();
  app.listen(port, serverApi ,() => {
    console.log(`Example app listening at http://${serverApi}:${port}`);
  });
};

tmpFunc();
