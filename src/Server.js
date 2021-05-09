import dotenv from "dotenv";
import express from "express";
import knex from "knex";
import {
  getModels,
  createModelTree,
  setRoutes,
} from "./Helpers/ModelHelpers.js";
import BaseController from "./Controller/BaseController.js";
import Config from "./Core/Config.js";
import IoC from "./Core/IoC.js";
import Logger from "./Core/Logger.js";
import bodyParser from "body-parser";

class Server {
  constructor(appFolder) {
    this.appFolder = appFolder;
  }

  async listen() {
    await this._bindDependencies();
    await this._loadConfigurations();
    await this._loadExpress();
  }

  async _bindDependencies() {
    IoC.singleton("Config", () => new Config());
    IoC.singleton("Database", async () => {
      const Config = await IoC.use("Config");
      return knex(Config.Database);
    });
    IoC.singleton("Controller", async () => {
      return new BaseController();
    });
    IoC.singleton("App", async () => {
      return express();
    });
    IoC.singleton("Logger", async () => {
      const Config = await IoC.use("Config");
      return new Logger(Config.Application.logLevel);
    });
  }

  async _loadConfigurations() {
    dotenv.config();
    const Config = await IoC.use("Config");
    await Config.load(this.appFolder);
  }

  async _loadExpress() {
    const App = await IoC.use("App");
    App.use(bodyParser.json());
    App.use(bodyParser.urlencoded({ extended: true }));

    this.instances = await getModels(this.appFolder);
    await setRoutes(createModelTree(this.instances));

    App.get("/", (req, res) => {
      res.json({
        name: "AXE API",
        description: "The best API creation tool in the world.",
        aim: "To kill them all!",
      });
    });

    const Config = await IoC.use("Config");

    App.listen(Config.Application.port, () => {
      console.log(
        `Example app listening at http://localhost:${Config.Application.port}`
      );
    });
  }
}

export default Server;
